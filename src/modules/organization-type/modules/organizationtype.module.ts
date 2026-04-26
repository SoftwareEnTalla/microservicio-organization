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
import { OrganizationTypeCommandController } from "../controllers/organizationtypecommand.controller";
import { OrganizationTypeQueryController } from "../controllers/organizationtypequery.controller";
import { OrganizationTypeCommandService } from "../services/organizationtypecommand.service";
import { OrganizationTypeQueryService } from "../services/organizationtypequery.service";

import { OrganizationTypeCommandRepository } from "../repositories/organizationtypecommand.repository";
import { OrganizationTypeQueryRepository } from "../repositories/organizationtypequery.repository";
import { OrganizationTypeRepository } from "../repositories/organizationtype.repository";
import { OrganizationTypeResolver } from "../graphql/organizationtype.resolver";
import { OrganizationTypeAuthGuard } from "../guards/organizationtypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationType } from "../entities/organization-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateOrganizationTypeHandler } from "../commands/handlers/createorganizationtype.handler";
import { UpdateOrganizationTypeHandler } from "../commands/handlers/updateorganizationtype.handler";
import { DeleteOrganizationTypeHandler } from "../commands/handlers/deleteorganizationtype.handler";
import { GetOrganizationTypeByIdHandler } from "../queries/handlers/getorganizationtypebyid.handler";
import { GetOrganizationTypeByFieldHandler } from "../queries/handlers/getorganizationtypebyfield.handler";
import { GetAllOrganizationTypeHandler } from "../queries/handlers/getallorganizationtype.handler";
import { OrganizationTypeCrudSaga } from "../sagas/organizationtype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { OrganizationTypeInterceptor } from "../interceptors/organizationtype.interceptor";
import { OrganizationTypeLoggingInterceptor } from "../interceptors/organizationtype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, OrganizationType]), // Incluir BaseEntity para herencia
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
  controllers: [OrganizationTypeCommandController, OrganizationTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    OrganizationTypeQueryService,
    OrganizationTypeCommandService,
  
    //Repositories
    OrganizationTypeCommandRepository,
    OrganizationTypeQueryRepository,
    OrganizationTypeRepository,      
    //Resolvers
    OrganizationTypeResolver,
    //Guards
    OrganizationTypeAuthGuard,
    //Interceptors
    OrganizationTypeInterceptor,
    OrganizationTypeLoggingInterceptor,
    //CQRS Handlers
    CreateOrganizationTypeHandler,
    UpdateOrganizationTypeHandler,
    DeleteOrganizationTypeHandler,
    GetOrganizationTypeByIdHandler,
    GetOrganizationTypeByFieldHandler,
    GetAllOrganizationTypeHandler,
    OrganizationTypeCrudSaga,
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
    OrganizationTypeQueryService,
    OrganizationTypeCommandService,
  
    //Repositories
    OrganizationTypeCommandRepository,
    OrganizationTypeQueryRepository,
    OrganizationTypeRepository,      
    //Resolvers
    OrganizationTypeResolver,
    //Guards
    OrganizationTypeAuthGuard,
    //Interceptors
    OrganizationTypeInterceptor,
    OrganizationTypeLoggingInterceptor,
  ],
})
export class OrganizationTypeModule {}

