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
import { HeadcountOverrideCommandController } from "../controllers/headcountoverridecommand.controller";
import { HeadcountOverrideQueryController } from "../controllers/headcountoverridequery.controller";
import { HeadcountOverrideCommandService } from "../services/headcountoverridecommand.service";
import { HeadcountOverrideQueryService } from "../services/headcountoverridequery.service";

import { HeadcountOverrideCommandRepository } from "../repositories/headcountoverridecommand.repository";
import { HeadcountOverrideQueryRepository } from "../repositories/headcountoverridequery.repository";
import { HeadcountOverrideRepository } from "../repositories/headcountoverride.repository";
import { HeadcountOverrideResolver } from "../graphql/headcountoverride.resolver";
import { HeadcountOverrideAuthGuard } from "../guards/headcountoverrideauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HeadcountOverride } from "../entities/headcount-override.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateHeadcountOverrideHandler } from "../commands/handlers/createheadcountoverride.handler";
import { UpdateHeadcountOverrideHandler } from "../commands/handlers/updateheadcountoverride.handler";
import { DeleteHeadcountOverrideHandler } from "../commands/handlers/deleteheadcountoverride.handler";
import { GetHeadcountOverrideByIdHandler } from "../queries/handlers/getheadcountoverridebyid.handler";
import { GetHeadcountOverrideByFieldHandler } from "../queries/handlers/getheadcountoverridebyfield.handler";
import { GetAllHeadcountOverrideHandler } from "../queries/handlers/getallheadcountoverride.handler";
import { HeadcountOverrideCrudSaga } from "../sagas/headcountoverride-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { HeadcountOverrideInterceptor } from "../interceptors/headcountoverride.interceptor";
import { HeadcountOverrideLoggingInterceptor } from "../interceptors/headcountoverride.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, HeadcountOverride]), // Incluir BaseEntity para herencia
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
  controllers: [HeadcountOverrideCommandController, HeadcountOverrideQueryController],
  providers: [
    //Services
    EventStoreService,
    HeadcountOverrideQueryService,
    HeadcountOverrideCommandService,
  
    //Repositories
    HeadcountOverrideCommandRepository,
    HeadcountOverrideQueryRepository,
    HeadcountOverrideRepository,      
    //Resolvers
    HeadcountOverrideResolver,
    //Guards
    HeadcountOverrideAuthGuard,
    //Interceptors
    HeadcountOverrideInterceptor,
    HeadcountOverrideLoggingInterceptor,
    //CQRS Handlers
    CreateHeadcountOverrideHandler,
    UpdateHeadcountOverrideHandler,
    DeleteHeadcountOverrideHandler,
    GetHeadcountOverrideByIdHandler,
    GetHeadcountOverrideByFieldHandler,
    GetAllHeadcountOverrideHandler,
    HeadcountOverrideCrudSaga,
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
    HeadcountOverrideQueryService,
    HeadcountOverrideCommandService,
  
    //Repositories
    HeadcountOverrideCommandRepository,
    HeadcountOverrideQueryRepository,
    HeadcountOverrideRepository,      
    //Resolvers
    HeadcountOverrideResolver,
    //Guards
    HeadcountOverrideAuthGuard,
    //Interceptors
    HeadcountOverrideInterceptor,
    HeadcountOverrideLoggingInterceptor,
  ],
})
export class HeadcountOverrideModule {}

