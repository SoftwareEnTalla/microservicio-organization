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
import { NodeTypeCommandController } from "../controllers/nodetypecommand.controller";
import { NodeTypeQueryController } from "../controllers/nodetypequery.controller";
import { NodeTypeCommandService } from "../services/nodetypecommand.service";
import { NodeTypeQueryService } from "../services/nodetypequery.service";

import { NodeTypeCommandRepository } from "../repositories/nodetypecommand.repository";
import { NodeTypeQueryRepository } from "../repositories/nodetypequery.repository";
import { NodeTypeRepository } from "../repositories/nodetype.repository";
import { NodeTypeResolver } from "../graphql/nodetype.resolver";
import { NodeTypeAuthGuard } from "../guards/nodetypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeType } from "../entities/node-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateNodeTypeHandler } from "../commands/handlers/createnodetype.handler";
import { UpdateNodeTypeHandler } from "../commands/handlers/updatenodetype.handler";
import { DeleteNodeTypeHandler } from "../commands/handlers/deletenodetype.handler";
import { GetNodeTypeByIdHandler } from "../queries/handlers/getnodetypebyid.handler";
import { GetNodeTypeByFieldHandler } from "../queries/handlers/getnodetypebyfield.handler";
import { GetAllNodeTypeHandler } from "../queries/handlers/getallnodetype.handler";
import { NodeTypeCrudSaga } from "../sagas/nodetype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { NodeTypeInterceptor } from "../interceptors/nodetype.interceptor";
import { NodeTypeLoggingInterceptor } from "../interceptors/nodetype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, NodeType]), // Incluir BaseEntity para herencia
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
  controllers: [NodeTypeCommandController, NodeTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    NodeTypeQueryService,
    NodeTypeCommandService,
  
    //Repositories
    NodeTypeCommandRepository,
    NodeTypeQueryRepository,
    NodeTypeRepository,      
    //Resolvers
    NodeTypeResolver,
    //Guards
    NodeTypeAuthGuard,
    //Interceptors
    NodeTypeInterceptor,
    NodeTypeLoggingInterceptor,
    //CQRS Handlers
    CreateNodeTypeHandler,
    UpdateNodeTypeHandler,
    DeleteNodeTypeHandler,
    GetNodeTypeByIdHandler,
    GetNodeTypeByFieldHandler,
    GetAllNodeTypeHandler,
    NodeTypeCrudSaga,
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
    NodeTypeQueryService,
    NodeTypeCommandService,
  
    //Repositories
    NodeTypeCommandRepository,
    NodeTypeQueryRepository,
    NodeTypeRepository,      
    //Resolvers
    NodeTypeResolver,
    //Guards
    NodeTypeAuthGuard,
    //Interceptors
    NodeTypeInterceptor,
    NodeTypeLoggingInterceptor,
  ],
})
export class NodeTypeModule {}

