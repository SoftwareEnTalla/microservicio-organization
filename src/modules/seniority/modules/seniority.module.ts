/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { Module } from "@nestjs/common";
import { SeniorityCommandController } from "../controllers/senioritycommand.controller";
import { SeniorityQueryController } from "../controllers/seniorityquery.controller";
import { SeniorityCommandService } from "../services/senioritycommand.service";
import { SeniorityQueryService } from "../services/seniorityquery.service";

import { SeniorityCommandRepository } from "../repositories/senioritycommand.repository";
import { SeniorityQueryRepository } from "../repositories/seniorityquery.repository";
import { SeniorityRepository } from "../repositories/seniority.repository";
import { SeniorityResolver } from "../graphql/seniority.resolver";
import { SeniorityAuthGuard } from "../guards/seniorityauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Seniority } from "../entities/seniority.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateSeniorityHandler } from "../commands/handlers/createseniority.handler";
import { UpdateSeniorityHandler } from "../commands/handlers/updateseniority.handler";
import { DeleteSeniorityHandler } from "../commands/handlers/deleteseniority.handler";
import { GetSeniorityByIdHandler } from "../queries/handlers/getsenioritybyid.handler";
import { GetSeniorityByFieldHandler } from "../queries/handlers/getsenioritybyfield.handler";
import { GetAllSeniorityHandler } from "../queries/handlers/getallseniority.handler";
import { SeniorityCrudSaga } from "../sagas/seniority-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { SeniorityInterceptor } from "../interceptors/seniority.interceptor";
import { SeniorityLoggingInterceptor } from "../interceptors/seniority.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Seniority]), // Incluir BaseEntity para herencia
    CacheModule.registerAsync({
      useFactory: async () => {
        try {
          const store = await redisStore({
            socket: { host: process.env.REDIS_HOST || "data-center-redis", port: parseInt(process.env.REDIS_PORT || "6379", 10) },
            ttl: parseInt(process.env.REDIS_TTL || "60", 10),
          });
          return { store: store as any, isGlobal: true };
        } catch {
          return { isGlobal: true }; // fallback in-memory
        }
      },
    }),
  ],
  controllers: [SeniorityCommandController, SeniorityQueryController],
  providers: [
    //Services
    EventStoreService,
    SeniorityQueryService,
    SeniorityCommandService,
  
    //Repositories
    SeniorityCommandRepository,
    SeniorityQueryRepository,
    SeniorityRepository,      
    //Resolvers
    SeniorityResolver,
    //Guards
    SeniorityAuthGuard,
    //Interceptors
    SeniorityInterceptor,
    SeniorityLoggingInterceptor,
    //CQRS Handlers
    CreateSeniorityHandler,
    UpdateSeniorityHandler,
    DeleteSeniorityHandler,
    GetSeniorityByIdHandler,
    GetSeniorityByFieldHandler,
    GetAllSeniorityHandler,
    SeniorityCrudSaga,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED !== 'false',
        kafkaEnabled: process.env.KAFKA_ENABLED !== 'false',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: EVENT_TOPICS
      })
    },
  ],
  exports: [
    CqrsModule,
    KafkaModule,
    //Services
    EventStoreService,
    SeniorityQueryService,
    SeniorityCommandService,
  
    //Repositories
    SeniorityCommandRepository,
    SeniorityQueryRepository,
    SeniorityRepository,      
    //Resolvers
    SeniorityResolver,
    //Guards
    SeniorityAuthGuard,
    //Interceptors
    SeniorityInterceptor,
    SeniorityLoggingInterceptor,
  ],
})
export class SeniorityModule {}

