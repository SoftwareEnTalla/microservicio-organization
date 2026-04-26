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
import { NodeAssignmentActionCommandController } from "../controllers/nodeassignmentactioncommand.controller";
import { NodeAssignmentActionQueryController } from "../controllers/nodeassignmentactionquery.controller";
import { NodeAssignmentActionCommandService } from "../services/nodeassignmentactioncommand.service";
import { NodeAssignmentActionQueryService } from "../services/nodeassignmentactionquery.service";

import { NodeAssignmentActionCommandRepository } from "../repositories/nodeassignmentactioncommand.repository";
import { NodeAssignmentActionQueryRepository } from "../repositories/nodeassignmentactionquery.repository";
import { NodeAssignmentActionRepository } from "../repositories/nodeassignmentaction.repository";
import { NodeAssignmentActionResolver } from "../graphql/nodeassignmentaction.resolver";
import { NodeAssignmentActionAuthGuard } from "../guards/nodeassignmentactionauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeAssignmentAction } from "../entities/node-assignment-action.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateNodeAssignmentActionHandler } from "../commands/handlers/createnodeassignmentaction.handler";
import { UpdateNodeAssignmentActionHandler } from "../commands/handlers/updatenodeassignmentaction.handler";
import { DeleteNodeAssignmentActionHandler } from "../commands/handlers/deletenodeassignmentaction.handler";
import { GetNodeAssignmentActionByIdHandler } from "../queries/handlers/getnodeassignmentactionbyid.handler";
import { GetNodeAssignmentActionByFieldHandler } from "../queries/handlers/getnodeassignmentactionbyfield.handler";
import { GetAllNodeAssignmentActionHandler } from "../queries/handlers/getallnodeassignmentaction.handler";
import { NodeAssignmentActionCrudSaga } from "../sagas/nodeassignmentaction-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { NodeAssignmentActionInterceptor } from "../interceptors/nodeassignmentaction.interceptor";
import { NodeAssignmentActionLoggingInterceptor } from "../interceptors/nodeassignmentaction.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, NodeAssignmentAction]), // Incluir BaseEntity para herencia
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
  controllers: [NodeAssignmentActionCommandController, NodeAssignmentActionQueryController],
  providers: [
    //Services
    EventStoreService,
    NodeAssignmentActionQueryService,
    NodeAssignmentActionCommandService,
  
    //Repositories
    NodeAssignmentActionCommandRepository,
    NodeAssignmentActionQueryRepository,
    NodeAssignmentActionRepository,      
    //Resolvers
    NodeAssignmentActionResolver,
    //Guards
    NodeAssignmentActionAuthGuard,
    //Interceptors
    NodeAssignmentActionInterceptor,
    NodeAssignmentActionLoggingInterceptor,
    //CQRS Handlers
    CreateNodeAssignmentActionHandler,
    UpdateNodeAssignmentActionHandler,
    DeleteNodeAssignmentActionHandler,
    GetNodeAssignmentActionByIdHandler,
    GetNodeAssignmentActionByFieldHandler,
    GetAllNodeAssignmentActionHandler,
    NodeAssignmentActionCrudSaga,
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
    NodeAssignmentActionQueryService,
    NodeAssignmentActionCommandService,
  
    //Repositories
    NodeAssignmentActionCommandRepository,
    NodeAssignmentActionQueryRepository,
    NodeAssignmentActionRepository,      
    //Resolvers
    NodeAssignmentActionResolver,
    //Guards
    NodeAssignmentActionAuthGuard,
    //Interceptors
    NodeAssignmentActionInterceptor,
    NodeAssignmentActionLoggingInterceptor,
  ],
})
export class NodeAssignmentActionModule {}

