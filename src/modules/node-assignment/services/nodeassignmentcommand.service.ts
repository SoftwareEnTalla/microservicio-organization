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
import { NodeAssignment } from "../entities/node-assignment.entity";
import { CreateNodeAssignmentDto, UpdateNodeAssignmentDto, DeleteNodeAssignmentDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { NodeAssignmentCommandRepository } from "../repositories/nodeassignmentcommand.repository";
import { NodeAssignmentQueryRepository } from "../repositories/nodeassignmentquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { NodeAssignmentResponse, NodeAssignmentsResponse } from "../types/nodeassignment.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { NodeAssignmentQueryService } from "./nodeassignmentquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class NodeAssignmentCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(NodeAssignmentCommandService.name);
  //Constructo del servicio NodeAssignmentCommandService
  constructor(
    private readonly repository: NodeAssignmentCommandRepository,
    private readonly queryRepository: NodeAssignmentQueryRepository,
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
      .registerClient(NodeAssignmentQueryService.name)
      .get(NodeAssignmentQueryService.name),
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
        await this.eventStore.appendEvent('node-assignment-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: NodeAssignment | null,
    current?: NodeAssignment | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: assignment-requires-node
      // La asignación requiere nodeId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'nodeId') === undefined || this.dslValue(entityData, currentData, inputData, 'nodeId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'nodeId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && this.dslValue(entityData, currentData, inputData, 'nodeId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'nodeId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'nodeId'))).length === 0)))) {
        throw new Error('ORG_NA_001: nodeId requerido');
      }

      // Regla de servicio: assignment-requires-employee
      // La asignación requiere employeeId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'employeeId') === undefined || this.dslValue(entityData, currentData, inputData, 'employeeId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'employeeId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'employeeId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'employeeId')) && this.dslValue(entityData, currentData, inputData, 'employeeId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'employeeId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'employeeId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'employeeId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'employeeId'))).length === 0)))) {
        throw new Error('ORG_NA_002: employeeId requerido');
      }

      // Regla de servicio: assignment-requires-source-event
      // La asignación requiere sourceEventId para idempotencia.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'sourceEventId') === undefined || this.dslValue(entityData, currentData, inputData, 'sourceEventId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'sourceEventId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'sourceEventId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'sourceEventId')) && this.dslValue(entityData, currentData, inputData, 'sourceEventId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'sourceEventId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'sourceEventId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'sourceEventId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'sourceEventId'))).length === 0)))) {
        throw new Error('ORG_NA_003: sourceEventId requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: assignment-requires-node
      // La asignación requiere nodeId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'nodeId') === undefined || this.dslValue(entityData, currentData, inputData, 'nodeId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'nodeId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && this.dslValue(entityData, currentData, inputData, 'nodeId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'nodeId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'nodeId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'nodeId'))).length === 0)))) {
        throw new Error('ORG_NA_001: nodeId requerido');
      }

      // Regla de servicio: assignment-requires-employee
      // La asignación requiere employeeId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'employeeId') === undefined || this.dslValue(entityData, currentData, inputData, 'employeeId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'employeeId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'employeeId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'employeeId')) && this.dslValue(entityData, currentData, inputData, 'employeeId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'employeeId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'employeeId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'employeeId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'employeeId'))).length === 0)))) {
        throw new Error('ORG_NA_002: employeeId requerido');
      }

      // Regla de servicio: assignment-requires-source-event
      // La asignación requiere sourceEventId para idempotencia.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'sourceEventId') === undefined || this.dslValue(entityData, currentData, inputData, 'sourceEventId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'sourceEventId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'sourceEventId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'sourceEventId')) && this.dslValue(entityData, currentData, inputData, 'sourceEventId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'sourceEventId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'sourceEventId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'sourceEventId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'sourceEventId'))).length === 0)))) {
        throw new Error('ORG_NA_003: sourceEventId requerido');
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
      .registerClient(NodeAssignmentCommandService.name)
      .get(NodeAssignmentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateNodeAssignmentDto>("createNodeAssignment", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createNodeAssignmentDtoInput: CreateNodeAssignmentDto
  ): Promise<NodeAssignmentResponse<NodeAssignment>> {
    try {
      logger.info("Receiving in service:", createNodeAssignmentDtoInput);
      const candidate = NodeAssignment.fromDto(createNodeAssignmentDtoInput);
      await this.applyDslServiceRules("create", createNodeAssignmentDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createNodeAssignmentDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el nodeassignment no existe
      if (!entity)
        throw new NotFoundException("Entidad NodeAssignment no encontrada.");
      // Devolver nodeassignment
      return {
        ok: true,
        message: "NodeAssignment obtenido con éxito.",
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
      .registerClient(NodeAssignmentCommandService.name)
      .get(NodeAssignmentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<NodeAssignment>("createNodeAssignments", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createNodeAssignmentDtosInput: CreateNodeAssignmentDto[]
  ): Promise<NodeAssignmentsResponse<NodeAssignment>> {
    try {
      const entities = await this.repository.bulkCreate(
        createNodeAssignmentDtosInput.map((entity) => NodeAssignment.fromDto(entity))
      );

      // Respuesta si el nodeassignment no existe
      if (!entities)
        throw new NotFoundException("Entidades NodeAssignments no encontradas.");
      // Devolver nodeassignment
      return {
        ok: true,
        message: "NodeAssignments creados con éxito.",
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
      .registerClient(NodeAssignmentCommandService.name)
      .get(NodeAssignmentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateNodeAssignmentDto>("updateNodeAssignment", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateNodeAssignmentDto
  ): Promise<NodeAssignmentResponse<NodeAssignment>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new NodeAssignment(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el nodeassignment no existe
      if (!entity)
        throw new NotFoundException("Entidades NodeAssignments no encontradas.");
      // Devolver nodeassignment
      return {
        ok: true,
        message: "NodeAssignment actualizada con éxito.",
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
      .registerClient(NodeAssignmentCommandService.name)
      .get(NodeAssignmentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateNodeAssignmentDto>("updateNodeAssignments", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateNodeAssignmentDto[]
  ): Promise<NodeAssignmentsResponse<NodeAssignment>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => NodeAssignment.fromDto(entity))
      );
      // Respuesta si el nodeassignment no existe
      if (!entities)
        throw new NotFoundException("Entidades NodeAssignments no encontradas.");
      // Devolver nodeassignment
      return {
        ok: true,
        message: "NodeAssignments actualizadas con éxito.",
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
      .registerClient(NodeAssignmentCommandService.name)
      .get(NodeAssignmentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteNodeAssignmentDto>("deleteNodeAssignment", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<NodeAssignmentResponse<NodeAssignment>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el nodeassignment no existe
      if (!entity)
        throw new NotFoundException("Instancias de NodeAssignment no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver nodeassignment
      return {
        ok: true,
        message: "Instancia de NodeAssignment eliminada con éxito.",
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
      .registerClient(NodeAssignmentCommandService.name)
      .get(NodeAssignmentCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteNodeAssignments", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

