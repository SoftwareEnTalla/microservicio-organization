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
import { OrganizationStatusCommandController } from "../controllers/organizationstatuscommand.controller";
import { OrganizationStatusQueryController } from "../controllers/organizationstatusquery.controller";
import { OrganizationStatusCommandService } from "../services/organizationstatuscommand.service";
import { OrganizationStatusQueryService } from "../services/organizationstatusquery.service";

import { OrganizationStatusCommandRepository } from "../repositories/organizationstatuscommand.repository";
import { OrganizationStatusQueryRepository } from "../repositories/organizationstatusquery.repository";
import { OrganizationStatusRepository } from "../repositories/organizationstatus.repository";
import { OrganizationStatusResolver } from "../graphql/organizationstatus.resolver";
import { OrganizationStatusAuthGuard } from "../guards/organizationstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationStatus } from "../entities/organization-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateOrganizationStatusHandler } from "../commands/handlers/createorganizationstatus.handler";
import { UpdateOrganizationStatusHandler } from "../commands/handlers/updateorganizationstatus.handler";
import { DeleteOrganizationStatusHandler } from "../commands/handlers/deleteorganizationstatus.handler";
import { GetOrganizationStatusByIdHandler } from "../queries/handlers/getorganizationstatusbyid.handler";
import { GetOrganizationStatusByFieldHandler } from "../queries/handlers/getorganizationstatusbyfield.handler";
import { GetAllOrganizationStatusHandler } from "../queries/handlers/getallorganizationstatus.handler";
import { OrganizationStatusCrudSaga } from "../sagas/organizationstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { OrganizationStatusInterceptor } from "../interceptors/organizationstatus.interceptor";
import { OrganizationStatusLoggingInterceptor } from "../interceptors/organizationstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, OrganizationStatus]), // Incluir BaseEntity para herencia
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
  controllers: [OrganizationStatusCommandController, OrganizationStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    OrganizationStatusQueryService,
    OrganizationStatusCommandService,
  
    //Repositories
    OrganizationStatusCommandRepository,
    OrganizationStatusQueryRepository,
    OrganizationStatusRepository,      
    //Resolvers
    OrganizationStatusResolver,
    //Guards
    OrganizationStatusAuthGuard,
    //Interceptors
    OrganizationStatusInterceptor,
    OrganizationStatusLoggingInterceptor,
    //CQRS Handlers
    CreateOrganizationStatusHandler,
    UpdateOrganizationStatusHandler,
    DeleteOrganizationStatusHandler,
    GetOrganizationStatusByIdHandler,
    GetOrganizationStatusByFieldHandler,
    GetAllOrganizationStatusHandler,
    OrganizationStatusCrudSaga,
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
    OrganizationStatusQueryService,
    OrganizationStatusCommandService,
  
    //Repositories
    OrganizationStatusCommandRepository,
    OrganizationStatusQueryRepository,
    OrganizationStatusRepository,      
    //Resolvers
    OrganizationStatusResolver,
    //Guards
    OrganizationStatusAuthGuard,
    //Interceptors
    OrganizationStatusInterceptor,
    OrganizationStatusLoggingInterceptor,
  ],
})
export class OrganizationStatusModule {}

