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
import { NodeAssignmentCommandController } from "../controllers/nodeassignmentcommand.controller";
import { NodeAssignmentQueryController } from "../controllers/nodeassignmentquery.controller";
import { NodeAssignmentCommandService } from "../services/nodeassignmentcommand.service";
import { NodeAssignmentQueryService } from "../services/nodeassignmentquery.service";

import { NodeAssignmentCommandRepository } from "../repositories/nodeassignmentcommand.repository";
import { NodeAssignmentQueryRepository } from "../repositories/nodeassignmentquery.repository";
import { NodeAssignmentRepository } from "../repositories/nodeassignment.repository";
import { NodeAssignmentResolver } from "../graphql/nodeassignment.resolver";
import { NodeAssignmentAuthGuard } from "../guards/nodeassignmentauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeAssignment } from "../entities/node-assignment.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateNodeAssignmentHandler } from "../commands/handlers/createnodeassignment.handler";
import { UpdateNodeAssignmentHandler } from "../commands/handlers/updatenodeassignment.handler";
import { DeleteNodeAssignmentHandler } from "../commands/handlers/deletenodeassignment.handler";
import { GetNodeAssignmentByIdHandler } from "../queries/handlers/getnodeassignmentbyid.handler";
import { GetNodeAssignmentByFieldHandler } from "../queries/handlers/getnodeassignmentbyfield.handler";
import { GetAllNodeAssignmentHandler } from "../queries/handlers/getallnodeassignment.handler";
import { NodeAssignmentCrudSaga } from "../sagas/nodeassignment-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { NodeAssignmentInterceptor } from "../interceptors/nodeassignment.interceptor";
import { NodeAssignmentLoggingInterceptor } from "../interceptors/nodeassignment.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, NodeAssignment]), // Incluir BaseEntity para herencia
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
  controllers: [NodeAssignmentCommandController, NodeAssignmentQueryController],
  providers: [
    //Services
    EventStoreService,
    NodeAssignmentQueryService,
    NodeAssignmentCommandService,
  
    //Repositories
    NodeAssignmentCommandRepository,
    NodeAssignmentQueryRepository,
    NodeAssignmentRepository,      
    //Resolvers
    NodeAssignmentResolver,
    //Guards
    NodeAssignmentAuthGuard,
    //Interceptors
    NodeAssignmentInterceptor,
    NodeAssignmentLoggingInterceptor,
    //CQRS Handlers
    CreateNodeAssignmentHandler,
    UpdateNodeAssignmentHandler,
    DeleteNodeAssignmentHandler,
    GetNodeAssignmentByIdHandler,
    GetNodeAssignmentByFieldHandler,
    GetAllNodeAssignmentHandler,
    NodeAssignmentCrudSaga,
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
    NodeAssignmentQueryService,
    NodeAssignmentCommandService,
  
    //Repositories
    NodeAssignmentCommandRepository,
    NodeAssignmentQueryRepository,
    NodeAssignmentRepository,      
    //Resolvers
    NodeAssignmentResolver,
    //Guards
    NodeAssignmentAuthGuard,
    //Interceptors
    NodeAssignmentInterceptor,
    NodeAssignmentLoggingInterceptor,
  ],
})
export class NodeAssignmentModule {}

