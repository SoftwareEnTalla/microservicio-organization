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
import { PlannedSeatCommandController } from "../controllers/plannedseatcommand.controller";
import { PlannedSeatQueryController } from "../controllers/plannedseatquery.controller";
import { PlannedSeatCommandService } from "../services/plannedseatcommand.service";
import { PlannedSeatQueryService } from "../services/plannedseatquery.service";

import { PlannedSeatCommandRepository } from "../repositories/plannedseatcommand.repository";
import { PlannedSeatQueryRepository } from "../repositories/plannedseatquery.repository";
import { PlannedSeatRepository } from "../repositories/plannedseat.repository";
import { PlannedSeatResolver } from "../graphql/plannedseat.resolver";
import { PlannedSeatAuthGuard } from "../guards/plannedseatauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlannedSeat } from "../entities/planned-seat.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePlannedSeatHandler } from "../commands/handlers/createplannedseat.handler";
import { UpdatePlannedSeatHandler } from "../commands/handlers/updateplannedseat.handler";
import { DeletePlannedSeatHandler } from "../commands/handlers/deleteplannedseat.handler";
import { GetPlannedSeatByIdHandler } from "../queries/handlers/getplannedseatbyid.handler";
import { GetPlannedSeatByFieldHandler } from "../queries/handlers/getplannedseatbyfield.handler";
import { GetAllPlannedSeatHandler } from "../queries/handlers/getallplannedseat.handler";
import { PlannedSeatCrudSaga } from "../sagas/plannedseat-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PlannedSeatInterceptor } from "../interceptors/plannedseat.interceptor";
import { PlannedSeatLoggingInterceptor } from "../interceptors/plannedseat.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PlannedSeat]), // Incluir BaseEntity para herencia
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
  controllers: [PlannedSeatCommandController, PlannedSeatQueryController],
  providers: [
    //Services
    EventStoreService,
    PlannedSeatQueryService,
    PlannedSeatCommandService,
  
    //Repositories
    PlannedSeatCommandRepository,
    PlannedSeatQueryRepository,
    PlannedSeatRepository,      
    //Resolvers
    PlannedSeatResolver,
    //Guards
    PlannedSeatAuthGuard,
    //Interceptors
    PlannedSeatInterceptor,
    PlannedSeatLoggingInterceptor,
    //CQRS Handlers
    CreatePlannedSeatHandler,
    UpdatePlannedSeatHandler,
    DeletePlannedSeatHandler,
    GetPlannedSeatByIdHandler,
    GetPlannedSeatByFieldHandler,
    GetAllPlannedSeatHandler,
    PlannedSeatCrudSaga,
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
    PlannedSeatQueryService,
    PlannedSeatCommandService,
  
    //Repositories
    PlannedSeatCommandRepository,
    PlannedSeatQueryRepository,
    PlannedSeatRepository,      
    //Resolvers
    PlannedSeatResolver,
    //Guards
    PlannedSeatAuthGuard,
    //Interceptors
    PlannedSeatInterceptor,
    PlannedSeatLoggingInterceptor,
  ],
})
export class PlannedSeatModule {}

