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
import { Organization } from "../entities/organization.entity";
import { CreateOrganizationDto, UpdateOrganizationDto, DeleteOrganizationDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { OrganizationCommandRepository } from "../repositories/organizationcommand.repository";
import { OrganizationQueryRepository } from "../repositories/organizationquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { OrganizationResponse, OrganizationsResponse } from "../types/organization.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { OrganizationQueryService } from "./organizationquery.service";
import { BaseEvent } from "../events/base.event";
import { OrganizationRootCreatedEvent } from '../events/organizationrootcreated.event';
import { OrganizationArchivedEvent } from '../events/organizationarchived.event';

@Injectable()
export class OrganizationCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(OrganizationCommandService.name);
  //Constructo del servicio OrganizationCommandService
  constructor(
    private readonly repository: OrganizationCommandRepository,
    private readonly queryRepository: OrganizationQueryRepository,
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
      .registerClient(OrganizationQueryService.name)
      .get(OrganizationQueryService.name),
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
        await this.eventStore.appendEvent('organization-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Organization | null,
    current?: Organization | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: organization-code-required
      // La organización requiere organizationCode.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'organizationCode') === undefined || this.dslValue(entityData, currentData, inputData, 'organizationCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'organizationCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'organizationCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'organizationCode')) && this.dslValue(entityData, currentData, inputData, 'organizationCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'organizationCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'organizationCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'organizationCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'organizationCode'))).length === 0)))) {
        throw new Error('ORG_ORG_001: organizationCode requerido');
      }

      // Regla de servicio: organization-name-required
      // La organización requiere nombre.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'name') === undefined || this.dslValue(entityData, currentData, inputData, 'name') === null || (typeof this.dslValue(entityData, currentData, inputData, 'name') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'name')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'name')) && this.dslValue(entityData, currentData, inputData, 'name').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'name') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'name')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'name')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'name'))).length === 0)))) {
        throw new Error('ORG_ORG_002: name requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: organization-code-required
      // La organización requiere organizationCode.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'organizationCode') === undefined || this.dslValue(entityData, currentData, inputData, 'organizationCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'organizationCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'organizationCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'organizationCode')) && this.dslValue(entityData, currentData, inputData, 'organizationCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'organizationCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'organizationCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'organizationCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'organizationCode'))).length === 0)))) {
        throw new Error('ORG_ORG_001: organizationCode requerido');
      }

      // Regla de servicio: organization-name-required
      // La organización requiere nombre.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'name') === undefined || this.dslValue(entityData, currentData, inputData, 'name') === null || (typeof this.dslValue(entityData, currentData, inputData, 'name') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'name')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'name')) && this.dslValue(entityData, currentData, inputData, 'name').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'name') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'name')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'name')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'name'))).length === 0)))) {
        throw new Error('ORG_ORG_002: name requerido');
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
      .registerClient(OrganizationCommandService.name)
      .get(OrganizationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateOrganizationDto>("createOrganization", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createOrganizationDtoInput: CreateOrganizationDto
  ): Promise<OrganizationResponse<Organization>> {
    try {
      logger.info("Receiving in service:", createOrganizationDtoInput);
      const candidate = Organization.fromDto(createOrganizationDtoInput);
      await this.applyDslServiceRules("create", createOrganizationDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createOrganizationDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el organization no existe
      if (!entity)
        throw new NotFoundException("Entidad Organization no encontrada.");
      // Devolver organization
      return {
        ok: true,
        message: "Organization obtenido con éxito.",
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
      .registerClient(OrganizationCommandService.name)
      .get(OrganizationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Organization>("createOrganizations", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createOrganizationDtosInput: CreateOrganizationDto[]
  ): Promise<OrganizationsResponse<Organization>> {
    try {
      const entities = await this.repository.bulkCreate(
        createOrganizationDtosInput.map((entity) => Organization.fromDto(entity))
      );

      // Respuesta si el organization no existe
      if (!entities)
        throw new NotFoundException("Entidades Organizations no encontradas.");
      // Devolver organization
      return {
        ok: true,
        message: "Organizations creados con éxito.",
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
      .registerClient(OrganizationCommandService.name)
      .get(OrganizationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateOrganizationDto>("updateOrganization", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateOrganizationDto
  ): Promise<OrganizationResponse<Organization>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Organization(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el organization no existe
      if (!entity)
        throw new NotFoundException("Entidades Organizations no encontradas.");
      // Devolver organization
      return {
        ok: true,
        message: "Organization actualizada con éxito.",
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
      .registerClient(OrganizationCommandService.name)
      .get(OrganizationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateOrganizationDto>("updateOrganizations", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateOrganizationDto[]
  ): Promise<OrganizationsResponse<Organization>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Organization.fromDto(entity))
      );
      // Respuesta si el organization no existe
      if (!entities)
        throw new NotFoundException("Entidades Organizations no encontradas.");
      // Devolver organization
      return {
        ok: true,
        message: "Organizations actualizadas con éxito.",
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
      .registerClient(OrganizationCommandService.name)
      .get(OrganizationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteOrganizationDto>("deleteOrganization", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<OrganizationResponse<Organization>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el organization no existe
      if (!entity)
        throw new NotFoundException("Instancias de Organization no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver organization
      return {
        ok: true,
        message: "Instancia de Organization eliminada con éxito.",
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
      .registerClient(OrganizationCommandService.name)
      .get(OrganizationCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteOrganizations", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

