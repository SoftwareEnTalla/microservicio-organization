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
import { OrganizationNode } from "../entities/organization-node.entity";
import { CreateOrganizationNodeDto, UpdateOrganizationNodeDto, DeleteOrganizationNodeDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { OrganizationNodeCommandRepository } from "../repositories/organizationnodecommand.repository";
import { OrganizationNodeQueryRepository } from "../repositories/organizationnodequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { OrganizationNodeResponse, OrganizationNodesResponse } from "../types/organizationnode.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { OrganizationNodeQueryService } from "./organizationnodequery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class OrganizationNodeCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(OrganizationNodeCommandService.name);
  //Constructo del servicio OrganizationNodeCommandService
  constructor(
    private readonly repository: OrganizationNodeCommandRepository,
    private readonly queryRepository: OrganizationNodeQueryRepository,
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
      .registerClient(OrganizationNodeQueryService.name)
      .get(OrganizationNodeQueryService.name),
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
        await this.eventStore.appendEvent('organization-node-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: OrganizationNode | null,
    current?: OrganizationNode | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: node-requires-organization
      // Todo nodo requiere organizationId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'organizationId') === undefined || this.dslValue(entityData, currentData, inputData, 'organizationId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'organizationId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'organizationId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'organizationId')) && this.dslValue(entityData, currentData, inputData, 'organizationId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'organizationId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'organizationId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'organizationId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'organizationId'))).length === 0)))) {
        throw new Error('ORG_NODE_001: organizationId requerido');
      }

      // Regla de servicio: node-requires-code
      // Todo nodo requiere nodeCode.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'nodeCode') === undefined || this.dslValue(entityData, currentData, inputData, 'nodeCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'nodeCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'nodeCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeCode')) && this.dslValue(entityData, currentData, inputData, 'nodeCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'nodeCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'nodeCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'nodeCode'))).length === 0)))) {
        throw new Error('ORG_NODE_002: nodeCode requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: node-requires-organization
      // Todo nodo requiere organizationId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'organizationId') === undefined || this.dslValue(entityData, currentData, inputData, 'organizationId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'organizationId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'organizationId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'organizationId')) && this.dslValue(entityData, currentData, inputData, 'organizationId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'organizationId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'organizationId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'organizationId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'organizationId'))).length === 0)))) {
        throw new Error('ORG_NODE_001: organizationId requerido');
      }

      // Regla de servicio: node-requires-code
      // Todo nodo requiere nodeCode.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'nodeCode') === undefined || this.dslValue(entityData, currentData, inputData, 'nodeCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'nodeCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'nodeCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeCode')) && this.dslValue(entityData, currentData, inputData, 'nodeCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'nodeCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'nodeCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'nodeCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'nodeCode'))).length === 0)))) {
        throw new Error('ORG_NODE_002: nodeCode requerido');
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
      .registerClient(OrganizationNodeCommandService.name)
      .get(OrganizationNodeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateOrganizationNodeDto>("createOrganizationNode", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createOrganizationNodeDtoInput: CreateOrganizationNodeDto
  ): Promise<OrganizationNodeResponse<OrganizationNode>> {
    try {
      logger.info("Receiving in service:", createOrganizationNodeDtoInput);
      const candidate = OrganizationNode.fromDto(createOrganizationNodeDtoInput);
      await this.applyDslServiceRules("create", createOrganizationNodeDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createOrganizationNodeDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el organizationnode no existe
      if (!entity)
        throw new NotFoundException("Entidad OrganizationNode no encontrada.");
      // Devolver organizationnode
      return {
        ok: true,
        message: "OrganizationNode obtenido con éxito.",
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
      .registerClient(OrganizationNodeCommandService.name)
      .get(OrganizationNodeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<OrganizationNode>("createOrganizationNodes", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createOrganizationNodeDtosInput: CreateOrganizationNodeDto[]
  ): Promise<OrganizationNodesResponse<OrganizationNode>> {
    try {
      const entities = await this.repository.bulkCreate(
        createOrganizationNodeDtosInput.map((entity) => OrganizationNode.fromDto(entity))
      );

      // Respuesta si el organizationnode no existe
      if (!entities)
        throw new NotFoundException("Entidades OrganizationNodes no encontradas.");
      // Devolver organizationnode
      return {
        ok: true,
        message: "OrganizationNodes creados con éxito.",
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
      .registerClient(OrganizationNodeCommandService.name)
      .get(OrganizationNodeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateOrganizationNodeDto>("updateOrganizationNode", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateOrganizationNodeDto
  ): Promise<OrganizationNodeResponse<OrganizationNode>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new OrganizationNode(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el organizationnode no existe
      if (!entity)
        throw new NotFoundException("Entidades OrganizationNodes no encontradas.");
      // Devolver organizationnode
      return {
        ok: true,
        message: "OrganizationNode actualizada con éxito.",
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
      .registerClient(OrganizationNodeCommandService.name)
      .get(OrganizationNodeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateOrganizationNodeDto>("updateOrganizationNodes", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateOrganizationNodeDto[]
  ): Promise<OrganizationNodesResponse<OrganizationNode>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => OrganizationNode.fromDto(entity))
      );
      // Respuesta si el organizationnode no existe
      if (!entities)
        throw new NotFoundException("Entidades OrganizationNodes no encontradas.");
      // Devolver organizationnode
      return {
        ok: true,
        message: "OrganizationNodes actualizadas con éxito.",
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
      .registerClient(OrganizationNodeCommandService.name)
      .get(OrganizationNodeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteOrganizationNodeDto>("deleteOrganizationNode", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<OrganizationNodeResponse<OrganizationNode>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el organizationnode no existe
      if (!entity)
        throw new NotFoundException("Instancias de OrganizationNode no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver organizationnode
      return {
        ok: true,
        message: "Instancia de OrganizationNode eliminada con éxito.",
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
      .registerClient(OrganizationNodeCommandService.name)
      .get(OrganizationNodeCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteOrganizationNodes", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

