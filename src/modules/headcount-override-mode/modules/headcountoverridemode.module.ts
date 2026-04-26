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
import { HeadcountOverrideModeCommandController } from "../controllers/headcountoverridemodecommand.controller";
import { HeadcountOverrideModeQueryController } from "../controllers/headcountoverridemodequery.controller";
import { HeadcountOverrideModeCommandService } from "../services/headcountoverridemodecommand.service";
import { HeadcountOverrideModeQueryService } from "../services/headcountoverridemodequery.service";

import { HeadcountOverrideModeCommandRepository } from "../repositories/headcountoverridemodecommand.repository";
import { HeadcountOverrideModeQueryRepository } from "../repositories/headcountoverridemodequery.repository";
import { HeadcountOverrideModeRepository } from "../repositories/headcountoverridemode.repository";
import { HeadcountOverrideModeResolver } from "../graphql/headcountoverridemode.resolver";
import { HeadcountOverrideModeAuthGuard } from "../guards/headcountoverridemodeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HeadcountOverrideMode } from "../entities/headcount-override-mode.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateHeadcountOverrideModeHandler } from "../commands/handlers/createheadcountoverridemode.handler";
import { UpdateHeadcountOverrideModeHandler } from "../commands/handlers/updateheadcountoverridemode.handler";
import { DeleteHeadcountOverrideModeHandler } from "../commands/handlers/deleteheadcountoverridemode.handler";
import { GetHeadcountOverrideModeByIdHandler } from "../queries/handlers/getheadcountoverridemodebyid.handler";
import { GetHeadcountOverrideModeByFieldHandler } from "../queries/handlers/getheadcountoverridemodebyfield.handler";
import { GetAllHeadcountOverrideModeHandler } from "../queries/handlers/getallheadcountoverridemode.handler";
import { HeadcountOverrideModeCrudSaga } from "../sagas/headcountoverridemode-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { HeadcountOverrideModeInterceptor } from "../interceptors/headcountoverridemode.interceptor";
import { HeadcountOverrideModeLoggingInterceptor } from "../interceptors/headcountoverridemode.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, HeadcountOverrideMode]), // Incluir BaseEntity para herencia
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
  controllers: [HeadcountOverrideModeCommandController, HeadcountOverrideModeQueryController],
  providers: [
    //Services
    EventStoreService,
    HeadcountOverrideModeQueryService,
    HeadcountOverrideModeCommandService,
  
    //Repositories
    HeadcountOverrideModeCommandRepository,
    HeadcountOverrideModeQueryRepository,
    HeadcountOverrideModeRepository,      
    //Resolvers
    HeadcountOverrideModeResolver,
    //Guards
    HeadcountOverrideModeAuthGuard,
    //Interceptors
    HeadcountOverrideModeInterceptor,
    HeadcountOverrideModeLoggingInterceptor,
    //CQRS Handlers
    CreateHeadcountOverrideModeHandler,
    UpdateHeadcountOverrideModeHandler,
    DeleteHeadcountOverrideModeHandler,
    GetHeadcountOverrideModeByIdHandler,
    GetHeadcountOverrideModeByFieldHandler,
    GetAllHeadcountOverrideModeHandler,
    HeadcountOverrideModeCrudSaga,
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
    HeadcountOverrideModeQueryService,
    HeadcountOverrideModeCommandService,
  
    //Repositories
    HeadcountOverrideModeCommandRepository,
    HeadcountOverrideModeQueryRepository,
    HeadcountOverrideModeRepository,      
    //Resolvers
    HeadcountOverrideModeResolver,
    //Guards
    HeadcountOverrideModeAuthGuard,
    //Interceptors
    HeadcountOverrideModeInterceptor,
    HeadcountOverrideModeLoggingInterceptor,
  ],
})
export class HeadcountOverrideModeModule {}

