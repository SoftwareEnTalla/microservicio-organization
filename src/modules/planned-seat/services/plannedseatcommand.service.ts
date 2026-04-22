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


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { PlannedSeat } from "../entities/planned-seat.entity";
import { CreatePlannedSeatDto, UpdatePlannedSeatDto, DeletePlannedSeatDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { PlannedSeatCommandRepository } from "../repositories/plannedseatcommand.repository";
import { PlannedSeatQueryRepository } from "../repositories/plannedseatquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { PlannedSeatResponse, PlannedSeatsResponse } from "../types/plannedseat.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { PlannedSeatQueryService } from "./plannedseatquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class PlannedSeatCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(PlannedSeatCommandService.name);
  //Constructo del servicio PlannedSeatCommandService
  constructor(
    private readonly repository: PlannedSeatCommandRepository,
    private readonly queryRepository: PlannedSeatQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private moduleRef: ModuleRef
  ) {
    //Inicialice aquí propiedades o atributos
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PlannedSeatQueryService.name)
      .get(PlannedSeatQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }

  private dslValue(entityData: Record<string, any>, currentData: Record<string, any>, inputData: Record<string, any>, field: string): any {
    return entityData?.[field] ?? currentData?.[field] ?? inputData?.[field];
  }

  private async publishDslDomainEvents(events: BaseEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventPublisher.publish(event as any);
      if (process.env.EVENT_STORE_ENABLED === "true") {
        await this.eventStore.appendEvent('planned-seat-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: PlannedSeat | null,
    current?: PlannedSeat | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: seat-requires-node
      // Toda plaza requiere nodeId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'nodeId') === undefined || this.dslValue(entityData, currentData, inputData, 'nodeId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'nodeId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && this.dslValue(entityData, currentData, inputData, 'nodeId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'nodeId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'nodeId'))).length === 0)))) {
        throw new Error('ORG_SEAT_001: nodeId requerido');
      }

      // Regla de servicio: seat-requires-job-title
      // Toda plaza requiere jobTitleCode.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'jobTitleCode') === undefined || this.dslValue(entityData, currentData, inputData, 'jobTitleCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'jobTitleCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'jobTitleCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'jobTitleCode')) && this.dslValue(entityData, currentData, inputData, 'jobTitleCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'jobTitleCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'jobTitleCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'jobTitleCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'jobTitleCode'))).length === 0)))) {
        throw new Error('ORG_SEAT_002: jobTitleCode requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: seat-requires-node
      // Toda plaza requiere nodeId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'nodeId') === undefined || this.dslValue(entityData, currentData, inputData, 'nodeId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'nodeId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && this.dslValue(entityData, currentData, inputData, 'nodeId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'nodeId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'nodeId'))).length === 0)))) {
        throw new Error('ORG_SEAT_001: nodeId requerido');
      }

      // Regla de servicio: seat-requires-job-title
      // Toda plaza requiere jobTitleCode.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'jobTitleCode') === undefined || this.dslValue(entityData, currentData, inputData, 'jobTitleCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'jobTitleCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'jobTitleCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'jobTitleCode')) && this.dslValue(entityData, currentData, inputData, 'jobTitleCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'jobTitleCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'jobTitleCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'jobTitleCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'jobTitleCode'))).length === 0)))) {
        throw new Error('ORG_SEAT_002: jobTitleCode requerido');
      }

    }
    if (publishEvents) {
      await this.publishDslDomainEvents(pendingEvents);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PlannedSeatCommandService.name)
      .get(PlannedSeatCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreatePlannedSeatDto>("createPlannedSeat", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createPlannedSeatDtoInput: CreatePlannedSeatDto
  ): Promise<PlannedSeatResponse<PlannedSeat>> {
    try {
      logger.info("Receiving in service:", createPlannedSeatDtoInput);
      const candidate = PlannedSeat.fromDto(createPlannedSeatDtoInput);
      await this.applyDslServiceRules("create", createPlannedSeatDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createPlannedSeatDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el plannedseat no existe
      if (!entity)
        throw new NotFoundException("Entidad PlannedSeat no encontrada.");
      // Devolver plannedseat
      return {
        ok: true,
        message: "PlannedSeat obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      logger.info("Error creating entity on service:", error);
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PlannedSeatCommandService.name)
      .get(PlannedSeatCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<PlannedSeat>("createPlannedSeats", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createPlannedSeatDtosInput: CreatePlannedSeatDto[]
  ): Promise<PlannedSeatsResponse<PlannedSeat>> {
    try {
      const entities = await this.repository.bulkCreate(
        createPlannedSeatDtosInput.map((entity) => PlannedSeat.fromDto(entity))
      );

      // Respuesta si el plannedseat no existe
      if (!entities)
        throw new NotFoundException("Entidades PlannedSeats no encontradas.");
      // Devolver plannedseat
      return {
        ok: true,
        message: "PlannedSeats creados con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PlannedSeatCommandService.name)
      .get(PlannedSeatCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePlannedSeatDto>("updatePlannedSeat", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdatePlannedSeatDto
  ): Promise<PlannedSeatResponse<PlannedSeat>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new PlannedSeat(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el plannedseat no existe
      if (!entity)
        throw new NotFoundException("Entidades PlannedSeats no encontradas.");
      // Devolver plannedseat
      return {
        ok: true,
        message: "PlannedSeat actualizada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PlannedSeatCommandService.name)
      .get(PlannedSeatCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePlannedSeatDto>("updatePlannedSeats", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdatePlannedSeatDto[]
  ): Promise<PlannedSeatsResponse<PlannedSeat>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => PlannedSeat.fromDto(entity))
      );
      // Respuesta si el plannedseat no existe
      if (!entities)
        throw new NotFoundException("Entidades PlannedSeats no encontradas.");
      // Devolver plannedseat
      return {
        ok: true,
        message: "PlannedSeats actualizadas con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

   @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PlannedSeatCommandService.name)
      .get(PlannedSeatCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeletePlannedSeatDto>("deletePlannedSeat", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<PlannedSeatResponse<PlannedSeat>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el plannedseat no existe
      if (!entity)
        throw new NotFoundException("Instancias de PlannedSeat no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver plannedseat
      return {
        ok: true,
        message: "Instancia de PlannedSeat eliminada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PlannedSeatCommandService.name)
      .get(PlannedSeatCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deletePlannedSeats", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

