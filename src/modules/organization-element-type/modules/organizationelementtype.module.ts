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
import { OrganizationElementTypeCommandController } from "../controllers/organizationelementtypecommand.controller";
import { OrganizationElementTypeQueryController } from "../controllers/organizationelementtypequery.controller";
import { OrganizationElementTypeCommandService } from "../services/organizationelementtypecommand.service";
import { OrganizationElementTypeQueryService } from "../services/organizationelementtypequery.service";

import { OrganizationElementTypeCommandRepository } from "../repositories/organizationelementtypecommand.repository";
import { OrganizationElementTypeQueryRepository } from "../repositories/organizationelementtypequery.repository";
import { OrganizationElementTypeRepository } from "../repositories/organizationelementtype.repository";
import { OrganizationElementTypeResolver } from "../graphql/organizationelementtype.resolver";
import { OrganizationElementTypeAuthGuard } from "../guards/organizationelementtypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationElementType } from "../entities/organization-element-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateOrganizationElementTypeHandler } from "../commands/handlers/createorganizationelementtype.handler";
import { UpdateOrganizationElementTypeHandler } from "../commands/handlers/updateorganizationelementtype.handler";
import { DeleteOrganizationElementTypeHandler } from "../commands/handlers/deleteorganizationelementtype.handler";
import { GetOrganizationElementTypeByIdHandler } from "../queries/handlers/getorganizationelementtypebyid.handler";
import { GetOrganizationElementTypeByFieldHandler } from "../queries/handlers/getorganizationelementtypebyfield.handler";
import { GetAllOrganizationElementTypeHandler } from "../queries/handlers/getallorganizationelementtype.handler";
import { OrganizationElementTypeCrudSaga } from "../sagas/organizationelementtype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { OrganizationElementTypeInterceptor } from "../interceptors/organizationelementtype.interceptor";
import { OrganizationElementTypeLoggingInterceptor } from "../interceptors/organizationelementtype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, OrganizationElementType]), // Incluir BaseEntity para herencia
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
  controllers: [OrganizationElementTypeCommandController, OrganizationElementTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    OrganizationElementTypeQueryService,
    OrganizationElementTypeCommandService,
  
    //Repositories
    OrganizationElementTypeCommandRepository,
    OrganizationElementTypeQueryRepository,
    OrganizationElementTypeRepository,      
    //Resolvers
    OrganizationElementTypeResolver,
    //Guards
    OrganizationElementTypeAuthGuard,
    //Interceptors
    OrganizationElementTypeInterceptor,
    OrganizationElementTypeLoggingInterceptor,
    //CQRS Handlers
    CreateOrganizationElementTypeHandler,
    UpdateOrganizationElementTypeHandler,
    DeleteOrganizationElementTypeHandler,
    GetOrganizationElementTypeByIdHandler,
    GetOrganizationElementTypeByFieldHandler,
    GetAllOrganizationElementTypeHandler,
    OrganizationElementTypeCrudSaga,
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
    OrganizationElementTypeQueryService,
    OrganizationElementTypeCommandService,
  
    //Repositories
    OrganizationElementTypeCommandRepository,
    OrganizationElementTypeQueryRepository,
    OrganizationElementTypeRepository,      
    //Resolvers
    OrganizationElementTypeResolver,
    //Guards
    OrganizationElementTypeAuthGuard,
    //Interceptors
    OrganizationElementTypeInterceptor,
    OrganizationElementTypeLoggingInterceptor,
  ],
})
export class OrganizationElementTypeModule {}

