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
import { OrganizationNodeStatusCommandController } from "../controllers/organizationnodestatuscommand.controller";
import { OrganizationNodeStatusQueryController } from "../controllers/organizationnodestatusquery.controller";
import { OrganizationNodeStatusCommandService } from "../services/organizationnodestatuscommand.service";
import { OrganizationNodeStatusQueryService } from "../services/organizationnodestatusquery.service";

import { OrganizationNodeStatusCommandRepository } from "../repositories/organizationnodestatuscommand.repository";
import { OrganizationNodeStatusQueryRepository } from "../repositories/organizationnodestatusquery.repository";
import { OrganizationNodeStatusRepository } from "../repositories/organizationnodestatus.repository";
import { OrganizationNodeStatusResolver } from "../graphql/organizationnodestatus.resolver";
import { OrganizationNodeStatusAuthGuard } from "../guards/organizationnodestatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationNodeStatus } from "../entities/organization-node-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateOrganizationNodeStatusHandler } from "../commands/handlers/createorganizationnodestatus.handler";
import { UpdateOrganizationNodeStatusHandler } from "../commands/handlers/updateorganizationnodestatus.handler";
import { DeleteOrganizationNodeStatusHandler } from "../commands/handlers/deleteorganizationnodestatus.handler";
import { GetOrganizationNodeStatusByIdHandler } from "../queries/handlers/getorganizationnodestatusbyid.handler";
import { GetOrganizationNodeStatusByFieldHandler } from "../queries/handlers/getorganizationnodestatusbyfield.handler";
import { GetAllOrganizationNodeStatusHandler } from "../queries/handlers/getallorganizationnodestatus.handler";
import { OrganizationNodeStatusCrudSaga } from "../sagas/organizationnodestatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { OrganizationNodeStatusInterceptor } from "../interceptors/organizationnodestatus.interceptor";
import { OrganizationNodeStatusLoggingInterceptor } from "../interceptors/organizationnodestatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, OrganizationNodeStatus]), // Incluir BaseEntity para herencia
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
  controllers: [OrganizationNodeStatusCommandController, OrganizationNodeStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    OrganizationNodeStatusQueryService,
    OrganizationNodeStatusCommandService,
  
    //Repositories
    OrganizationNodeStatusCommandRepository,
    OrganizationNodeStatusQueryRepository,
    OrganizationNodeStatusRepository,      
    //Resolvers
    OrganizationNodeStatusResolver,
    //Guards
    OrganizationNodeStatusAuthGuard,
    //Interceptors
    OrganizationNodeStatusInterceptor,
    OrganizationNodeStatusLoggingInterceptor,
    //CQRS Handlers
    CreateOrganizationNodeStatusHandler,
    UpdateOrganizationNodeStatusHandler,
    DeleteOrganizationNodeStatusHandler,
    GetOrganizationNodeStatusByIdHandler,
    GetOrganizationNodeStatusByFieldHandler,
    GetAllOrganizationNodeStatusHandler,
    OrganizationNodeStatusCrudSaga,
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
    OrganizationNodeStatusQueryService,
    OrganizationNodeStatusCommandService,
  
    //Repositories
    OrganizationNodeStatusCommandRepository,
    OrganizationNodeStatusQueryRepository,
    OrganizationNodeStatusRepository,      
    //Resolvers
    OrganizationNodeStatusResolver,
    //Guards
    OrganizationNodeStatusAuthGuard,
    //Interceptors
    OrganizationNodeStatusInterceptor,
    OrganizationNodeStatusLoggingInterceptor,
  ],
})
export class OrganizationNodeStatusModule {}

