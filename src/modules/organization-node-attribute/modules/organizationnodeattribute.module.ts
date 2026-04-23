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
import { OrganizationNodeAttributeCommandController } from "../controllers/organizationnodeattributecommand.controller";
import { OrganizationNodeAttributeQueryController } from "../controllers/organizationnodeattributequery.controller";
import { OrganizationNodeAttributeCommandService } from "../services/organizationnodeattributecommand.service";
import { OrganizationNodeAttributeQueryService } from "../services/organizationnodeattributequery.service";

import { OrganizationNodeAttributeCommandRepository } from "../repositories/organizationnodeattributecommand.repository";
import { OrganizationNodeAttributeQueryRepository } from "../repositories/organizationnodeattributequery.repository";
import { OrganizationNodeAttributeRepository } from "../repositories/organizationnodeattribute.repository";
import { OrganizationNodeAttributeResolver } from "../graphql/organizationnodeattribute.resolver";
import { OrganizationNodeAttributeAuthGuard } from "../guards/organizationnodeattributeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationNodeAttribute } from "../entities/organization-node-attribute.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateOrganizationNodeAttributeHandler } from "../commands/handlers/createorganizationnodeattribute.handler";
import { UpdateOrganizationNodeAttributeHandler } from "../commands/handlers/updateorganizationnodeattribute.handler";
import { DeleteOrganizationNodeAttributeHandler } from "../commands/handlers/deleteorganizationnodeattribute.handler";
import { GetOrganizationNodeAttributeByIdHandler } from "../queries/handlers/getorganizationnodeattributebyid.handler";
import { GetOrganizationNodeAttributeByFieldHandler } from "../queries/handlers/getorganizationnodeattributebyfield.handler";
import { GetAllOrganizationNodeAttributeHandler } from "../queries/handlers/getallorganizationnodeattribute.handler";
import { OrganizationNodeAttributeCrudSaga } from "../sagas/organizationnodeattribute-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { OrganizationNodeAttributeInterceptor } from "../interceptors/organizationnodeattribute.interceptor";
import { OrganizationNodeAttributeLoggingInterceptor } from "../interceptors/organizationnodeattribute.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, OrganizationNodeAttribute]), // Incluir BaseEntity para herencia
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
  controllers: [OrganizationNodeAttributeCommandController, OrganizationNodeAttributeQueryController],
  providers: [
    //Services
    EventStoreService,
    OrganizationNodeAttributeQueryService,
    OrganizationNodeAttributeCommandService,
  
    //Repositories
    OrganizationNodeAttributeCommandRepository,
    OrganizationNodeAttributeQueryRepository,
    OrganizationNodeAttributeRepository,      
    //Resolvers
    OrganizationNodeAttributeResolver,
    //Guards
    OrganizationNodeAttributeAuthGuard,
    //Interceptors
    OrganizationNodeAttributeInterceptor,
    OrganizationNodeAttributeLoggingInterceptor,
    //CQRS Handlers
    CreateOrganizationNodeAttributeHandler,
    UpdateOrganizationNodeAttributeHandler,
    DeleteOrganizationNodeAttributeHandler,
    GetOrganizationNodeAttributeByIdHandler,
    GetOrganizationNodeAttributeByFieldHandler,
    GetAllOrganizationNodeAttributeHandler,
    OrganizationNodeAttributeCrudSaga,
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
    OrganizationNodeAttributeQueryService,
    OrganizationNodeAttributeCommandService,
  
    //Repositories
    OrganizationNodeAttributeCommandRepository,
    OrganizationNodeAttributeQueryRepository,
    OrganizationNodeAttributeRepository,      
    //Resolvers
    OrganizationNodeAttributeResolver,
    //Guards
    OrganizationNodeAttributeAuthGuard,
    //Interceptors
    OrganizationNodeAttributeInterceptor,
    OrganizationNodeAttributeLoggingInterceptor,
  ],
})
export class OrganizationNodeAttributeModule {}

