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
import { OrganizationCommandController } from "../controllers/organizationcommand.controller";
import { OrganizationQueryController } from "../controllers/organizationquery.controller";
import { OrganizationCommandService } from "../services/organizationcommand.service";
import { OrganizationQueryService } from "../services/organizationquery.service";

import { OrganizationCommandRepository } from "../repositories/organizationcommand.repository";
import { OrganizationQueryRepository } from "../repositories/organizationquery.repository";
import { OrganizationRepository } from "../repositories/organization.repository";
import { OrganizationResolver } from "../graphql/organization.resolver";
import { OrganizationAuthGuard } from "../guards/organizationauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "../entities/organization.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateOrganizationHandler } from "../commands/handlers/createorganization.handler";
import { UpdateOrganizationHandler } from "../commands/handlers/updateorganization.handler";
import { DeleteOrganizationHandler } from "../commands/handlers/deleteorganization.handler";
import { GetOrganizationByIdHandler } from "../queries/handlers/getorganizationbyid.handler";
import { GetOrganizationByFieldHandler } from "../queries/handlers/getorganizationbyfield.handler";
import { GetAllOrganizationHandler } from "../queries/handlers/getallorganization.handler";
import { OrganizationCrudSaga } from "../sagas/organization-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { OrganizationInterceptor } from "../interceptors/organization.interceptor";
import { OrganizationLoggingInterceptor } from "../interceptors/organization.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Organization]), // Incluir BaseEntity para herencia
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
  controllers: [OrganizationCommandController, OrganizationQueryController],
  providers: [
    //Services
    EventStoreService,
    OrganizationQueryService,
    OrganizationCommandService,
  
    //Repositories
    OrganizationCommandRepository,
    OrganizationQueryRepository,
    OrganizationRepository,      
    //Resolvers
    OrganizationResolver,
    //Guards
    OrganizationAuthGuard,
    //Interceptors
    OrganizationInterceptor,
    OrganizationLoggingInterceptor,
    //CQRS Handlers
    CreateOrganizationHandler,
    UpdateOrganizationHandler,
    DeleteOrganizationHandler,
    GetOrganizationByIdHandler,
    GetOrganizationByFieldHandler,
    GetAllOrganizationHandler,
    OrganizationCrudSaga,
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
    OrganizationQueryService,
    OrganizationCommandService,
  
    //Repositories
    OrganizationCommandRepository,
    OrganizationQueryRepository,
    OrganizationRepository,      
    //Resolvers
    OrganizationResolver,
    //Guards
    OrganizationAuthGuard,
    //Interceptors
    OrganizationInterceptor,
    OrganizationLoggingInterceptor,
  ],
})
export class OrganizationModule {}

