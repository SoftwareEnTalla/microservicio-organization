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
import { HeadcountOverride } from "../entities/headcount-override.entity";
import { CreateHeadcountOverrideDto, UpdateHeadcountOverrideDto, DeleteHeadcountOverrideDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { HeadcountOverrideCommandRepository } from "../repositories/headcountoverridecommand.repository";
import { HeadcountOverrideQueryRepository } from "../repositories/headcountoverridequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { HeadcountOverrideResponse, HeadcountOverridesResponse } from "../types/headcountoverride.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { HeadcountOverrideQueryService } from "./headcountoverridequery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class HeadcountOverrideCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(HeadcountOverrideCommandService.name);
  //Constructo del servicio HeadcountOverrideCommandService
  constructor(
    private readonly repository: HeadcountOverrideCommandRepository,
    private readonly queryRepository: HeadcountOverrideQueryRepository,
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
      .registerClient(HeadcountOverrideQueryService.name)
      .get(HeadcountOverrideQueryService.name),
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
        await this.eventStore.appendEvent('headcount-override-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: HeadcountOverride | null,
    current?: HeadcountOverride | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: override-requires-node
      // El override requiere nodeId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'nodeId') === undefined || this.dslValue(entityData, currentData, inputData, 'nodeId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'nodeId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && this.dslValue(entityData, currentData, inputData, 'nodeId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'nodeId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'nodeId'))).length === 0)))) {
        throw new Error('ORG_OVR_001: nodeId requerido');
      }

      // Regla de servicio: override-requires-reason
      // El override requiere motivo.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'reason') === undefined || this.dslValue(entityData, currentData, inputData, 'reason') === null || (typeof this.dslValue(entityData, currentData, inputData, 'reason') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'reason')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'reason')) && this.dslValue(entityData, currentData, inputData, 'reason').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'reason') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'reason')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'reason')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'reason'))).length === 0)))) {
        throw new Error('ORG_OVR_002: reason requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: override-requires-node
      // El override requiere nodeId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'nodeId') === undefined || this.dslValue(entityData, currentData, inputData, 'nodeId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'nodeId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && this.dslValue(entityData, currentData, inputData, 'nodeId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'nodeId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'nodeId'))).length === 0)))) {
        throw new Error('ORG_OVR_001: nodeId requerido');
      }

      // Regla de servicio: override-requires-reason
      // El override requiere motivo.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'reason') === undefined || this.dslValue(entityData, currentData, inputData, 'reason') === null || (typeof this.dslValue(entityData, currentData, inputData, 'reason') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'reason')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'reason')) && this.dslValue(entityData, currentData, inputData, 'reason').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'reason') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'reason')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'reason')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'reason'))).length === 0)))) {
        throw new Error('ORG_OVR_002: reason requerido');
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
      .registerClient(HeadcountOverrideCommandService.name)
      .get(HeadcountOverrideCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateHeadcountOverrideDto>("createHeadcountOverride", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createHeadcountOverrideDtoInput: CreateHeadcountOverrideDto
  ): Promise<HeadcountOverrideResponse<HeadcountOverride>> {
    try {
      logger.info("Receiving in service:", createHeadcountOverrideDtoInput);
      const candidate = HeadcountOverride.fromDto(createHeadcountOverrideDtoInput);
      await this.applyDslServiceRules("create", createHeadcountOverrideDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createHeadcountOverrideDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el headcountoverride no existe
      if (!entity)
        throw new NotFoundException("Entidad HeadcountOverride no encontrada.");
      // Devolver headcountoverride
      return {
        ok: true,
        message: "HeadcountOverride obtenido con éxito.",
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
      .registerClient(HeadcountOverrideCommandService.name)
      .get(HeadcountOverrideCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<HeadcountOverride>("createHeadcountOverrides", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createHeadcountOverrideDtosInput: CreateHeadcountOverrideDto[]
  ): Promise<HeadcountOverridesResponse<HeadcountOverride>> {
    try {
      const entities = await this.repository.bulkCreate(
        createHeadcountOverrideDtosInput.map((entity) => HeadcountOverride.fromDto(entity))
      );

      // Respuesta si el headcountoverride no existe
      if (!entities)
        throw new NotFoundException("Entidades HeadcountOverrides no encontradas.");
      // Devolver headcountoverride
      return {
        ok: true,
        message: "HeadcountOverrides creados con éxito.",
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
      .registerClient(HeadcountOverrideCommandService.name)
      .get(HeadcountOverrideCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateHeadcountOverrideDto>("updateHeadcountOverride", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateHeadcountOverrideDto
  ): Promise<HeadcountOverrideResponse<HeadcountOverride>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new HeadcountOverride(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el headcountoverride no existe
      if (!entity)
        throw new NotFoundException("Entidades HeadcountOverrides no encontradas.");
      // Devolver headcountoverride
      return {
        ok: true,
        message: "HeadcountOverride actualizada con éxito.",
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
      .registerClient(HeadcountOverrideCommandService.name)
      .get(HeadcountOverrideCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateHeadcountOverrideDto>("updateHeadcountOverrides", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateHeadcountOverrideDto[]
  ): Promise<HeadcountOverridesResponse<HeadcountOverride>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => HeadcountOverride.fromDto(entity))
      );
      // Respuesta si el headcountoverride no existe
      if (!entities)
        throw new NotFoundException("Entidades HeadcountOverrides no encontradas.");
      // Devolver headcountoverride
      return {
        ok: true,
        message: "HeadcountOverrides actualizadas con éxito.",
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
      .registerClient(HeadcountOverrideCommandService.name)
      .get(HeadcountOverrideCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteHeadcountOverrideDto>("deleteHeadcountOverride", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<HeadcountOverrideResponse<HeadcountOverride>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el headcountoverride no existe
      if (!entity)
        throw new NotFoundException("Instancias de HeadcountOverride no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver headcountoverride
      return {
        ok: true,
        message: "Instancia de HeadcountOverride eliminada con éxito.",
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
      .registerClient(HeadcountOverrideCommandService.name)
      .get(HeadcountOverrideCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteHeadcountOverrides", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

