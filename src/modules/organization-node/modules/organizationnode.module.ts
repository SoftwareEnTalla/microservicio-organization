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
import { OrganizationNodeCommandController } from "../controllers/organizationnodecommand.controller";
import { OrganizationNodeQueryController } from "../controllers/organizationnodequery.controller";
import { OrganizationNodeCommandService } from "../services/organizationnodecommand.service";
import { OrganizationNodeQueryService } from "../services/organizationnodequery.service";

import { OrganizationNodeCommandRepository } from "../repositories/organizationnodecommand.repository";
import { OrganizationNodeQueryRepository } from "../repositories/organizationnodequery.repository";
import { OrganizationNodeRepository } from "../repositories/organizationnode.repository";
import { OrganizationNodeResolver } from "../graphql/organizationnode.resolver";
import { OrganizationNodeAuthGuard } from "../guards/organizationnodeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationNode } from "../entities/organization-node.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateOrganizationNodeHandler } from "../commands/handlers/createorganizationnode.handler";
import { UpdateOrganizationNodeHandler } from "../commands/handlers/updateorganizationnode.handler";
import { DeleteOrganizationNodeHandler } from "../commands/handlers/deleteorganizationnode.handler";
import { GetOrganizationNodeByIdHandler } from "../queries/handlers/getorganizationnodebyid.handler";
import { GetOrganizationNodeByFieldHandler } from "../queries/handlers/getorganizationnodebyfield.handler";
import { GetAllOrganizationNodeHandler } from "../queries/handlers/getallorganizationnode.handler";
import { OrganizationNodeCrudSaga } from "../sagas/organizationnode-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { OrganizationNodeInterceptor } from "../interceptors/organizationnode.interceptor";
import { OrganizationNodeLoggingInterceptor } from "../interceptors/organizationnode.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, OrganizationNode]), // Incluir BaseEntity para herencia
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
  controllers: [OrganizationNodeCommandController, OrganizationNodeQueryController],
  providers: [
    //Services
    EventStoreService,
    OrganizationNodeQueryService,
    OrganizationNodeCommandService,
  
    //Repositories
    OrganizationNodeCommandRepository,
    OrganizationNodeQueryRepository,
    OrganizationNodeRepository,      
    //Resolvers
    OrganizationNodeResolver,
    //Guards
    OrganizationNodeAuthGuard,
    //Interceptors
    OrganizationNodeInterceptor,
    OrganizationNodeLoggingInterceptor,
    //CQRS Handlers
    CreateOrganizationNodeHandler,
    UpdateOrganizationNodeHandler,
    DeleteOrganizationNodeHandler,
    GetOrganizationNodeByIdHandler,
    GetOrganizationNodeByFieldHandler,
    GetAllOrganizationNodeHandler,
    OrganizationNodeCrudSaga,
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
    OrganizationNodeQueryService,
    OrganizationNodeCommandService,
  
    //Repositories
    OrganizationNodeCommandRepository,
    OrganizationNodeQueryRepository,
    OrganizationNodeRepository,      
    //Resolvers
    OrganizationNodeResolver,
    //Guards
    OrganizationNodeAuthGuard,
    //Interceptors
    OrganizationNodeInterceptor,
    OrganizationNodeLoggingInterceptor,
  ],
})
export class OrganizationNodeModule {}

