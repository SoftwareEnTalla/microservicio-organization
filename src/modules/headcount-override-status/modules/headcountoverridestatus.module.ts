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
import { HeadcountOverrideStatusCommandController } from "../controllers/headcountoverridestatuscommand.controller";
import { HeadcountOverrideStatusQueryController } from "../controllers/headcountoverridestatusquery.controller";
import { HeadcountOverrideStatusCommandService } from "../services/headcountoverridestatuscommand.service";
import { HeadcountOverrideStatusQueryService } from "../services/headcountoverridestatusquery.service";

import { HeadcountOverrideStatusCommandRepository } from "../repositories/headcountoverridestatuscommand.repository";
import { HeadcountOverrideStatusQueryRepository } from "../repositories/headcountoverridestatusquery.repository";
import { HeadcountOverrideStatusRepository } from "../repositories/headcountoverridestatus.repository";
import { HeadcountOverrideStatusResolver } from "../graphql/headcountoverridestatus.resolver";
import { HeadcountOverrideStatusAuthGuard } from "../guards/headcountoverridestatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HeadcountOverrideStatus } from "../entities/headcount-override-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateHeadcountOverrideStatusHandler } from "../commands/handlers/createheadcountoverridestatus.handler";
import { UpdateHeadcountOverrideStatusHandler } from "../commands/handlers/updateheadcountoverridestatus.handler";
import { DeleteHeadcountOverrideStatusHandler } from "../commands/handlers/deleteheadcountoverridestatus.handler";
import { GetHeadcountOverrideStatusByIdHandler } from "../queries/handlers/getheadcountoverridestatusbyid.handler";
import { GetHeadcountOverrideStatusByFieldHandler } from "../queries/handlers/getheadcountoverridestatusbyfield.handler";
import { GetAllHeadcountOverrideStatusHandler } from "../queries/handlers/getallheadcountoverridestatus.handler";
import { HeadcountOverrideStatusCrudSaga } from "../sagas/headcountoverridestatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { HeadcountOverrideStatusInterceptor } from "../interceptors/headcountoverridestatus.interceptor";
import { HeadcountOverrideStatusLoggingInterceptor } from "../interceptors/headcountoverridestatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, HeadcountOverrideStatus]), // Incluir BaseEntity para herencia
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
  controllers: [HeadcountOverrideStatusCommandController, HeadcountOverrideStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    HeadcountOverrideStatusQueryService,
    HeadcountOverrideStatusCommandService,
  
    //Repositories
    HeadcountOverrideStatusCommandRepository,
    HeadcountOverrideStatusQueryRepository,
    HeadcountOverrideStatusRepository,      
    //Resolvers
    HeadcountOverrideStatusResolver,
    //Guards
    HeadcountOverrideStatusAuthGuard,
    //Interceptors
    HeadcountOverrideStatusInterceptor,
    HeadcountOverrideStatusLoggingInterceptor,
    //CQRS Handlers
    CreateHeadcountOverrideStatusHandler,
    UpdateHeadcountOverrideStatusHandler,
    DeleteHeadcountOverrideStatusHandler,
    GetHeadcountOverrideStatusByIdHandler,
    GetHeadcountOverrideStatusByFieldHandler,
    GetAllHeadcountOverrideStatusHandler,
    HeadcountOverrideStatusCrudSaga,
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
    HeadcountOverrideStatusQueryService,
    HeadcountOverrideStatusCommandService,
  
    //Repositories
    HeadcountOverrideStatusCommandRepository,
    HeadcountOverrideStatusQueryRepository,
    HeadcountOverrideStatusRepository,      
    //Resolvers
    HeadcountOverrideStatusResolver,
    //Guards
    HeadcountOverrideStatusAuthGuard,
    //Interceptors
    HeadcountOverrideStatusInterceptor,
    HeadcountOverrideStatusLoggingInterceptor,
  ],
})
export class HeadcountOverrideStatusModule {}

