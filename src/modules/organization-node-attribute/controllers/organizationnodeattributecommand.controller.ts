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


import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Get,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { OrganizationNodeAttributeCommandService } from "../services/organizationnodeattributecommand.service";
import { OrganizationNodeAttributeAuthGuard } from "../guards/organizationnodeattributeauthguard.guard";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { OrganizationNodeAttribute } from "../entities/organization-node-attribute.entity";
import { OrganizationNodeAttributeResponse, OrganizationNodeAttributesResponse } from "../types/organizationnodeattribute.types";
import { CreateOrganizationNodeAttributeDto, UpdateOrganizationNodeAttributeDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { OrganizationNodeAttributeCreatedEvent } from "../events/organizationnodeattributecreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("OrganizationNodeAttribute Command")
@UseGuards(OrganizationNodeAttributeAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticación requerida." })
@Controller("organizationnodeattributes/command")
export class OrganizationNodeAttributeCommandController {

  #logger = new Logger(OrganizationNodeAttributeCommandController.name);

  //Constructor del controlador: OrganizationNodeAttributeCommandController
  constructor(
  private readonly service: OrganizationNodeAttributeCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new organizationnodeattribute" })
  @ApiBody({ type: CreateOrganizationNodeAttributeDto })
  @ApiResponse({ status: 201, type: OrganizationNodeAttributeResponse<OrganizationNodeAttribute> })
  @Post()
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(OrganizationNodeAttributeCommandController.name)
      .get(OrganizationNodeAttributeCommandController.name),
  })
  async create(
    @Body() createOrganizationNodeAttributeDtoInput: CreateOrganizationNodeAttributeDto
  ): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute>> {
    try {
      logger.info("Receiving in controller:", createOrganizationNodeAttributeDtoInput);
      const entity = await this.service.create(createOrganizationNodeAttributeDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response organizationnodeattribute entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("OrganizationNodeAttribute entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id organizationnodeattribute is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple organizationnodeattributes" })
  @ApiBody({ type: [CreateOrganizationNodeAttributeDto] })
  @ApiResponse({ status: 201, type: OrganizationNodeAttributesResponse<OrganizationNodeAttribute> })
  @Post("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(OrganizationNodeAttributeCommandController.name)
      .get(OrganizationNodeAttributeCommandController.name),
  })
  async bulkCreate(
    @Body() createOrganizationNodeAttributeDtosInput: CreateOrganizationNodeAttributeDto[]
  ): Promise<OrganizationNodeAttributesResponse<OrganizationNodeAttribute>> {
    try {
      const entities = await this.service.bulkCreate(createOrganizationNodeAttributeDtosInput);

      if (!entities) {
        throw new NotFoundException("OrganizationNodeAttribute entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an organizationnodeattribute" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdateOrganizationNodeAttributeDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: OrganizationNodeAttributeResponse<OrganizationNodeAttribute> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia OrganizationNodeAttribute a actualizar.",
  }) // ✅ Nuevo status para el error de validación
  @Put(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(OrganizationNodeAttributeCommandController.name)
      .get(OrganizationNodeAttributeCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs
      if (id !== partialEntity.id) {
        throw new BadRequestException(
          "El ID en la URL no coincide con el ID en la instancia de OrganizationNodeAttribute a actualizar."
        );
      }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de OrganizationNodeAttribute no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple organizationnodeattributes" })
  @ApiBody({ type: [UpdateOrganizationNodeAttributeDto] })
  @ApiResponse({ status: 200, type: OrganizationNodeAttributesResponse<OrganizationNodeAttribute> })
  @Put("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(OrganizationNodeAttributeCommandController.name)
      .get(OrganizationNodeAttributeCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdateOrganizationNodeAttributeDto[]
  ): Promise<OrganizationNodeAttributesResponse<OrganizationNodeAttribute>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("OrganizationNodeAttribute entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an organizationnodeattribute" })   
  @ApiResponse({ status: 200, type: OrganizationNodeAttributeResponse<OrganizationNodeAttribute>,description:
    "Instancia de OrganizationNodeAttribute eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia OrganizationNodeAttribute a eliminar.",
  }) // ✅ Nuevo status para el error de validación
  @Delete(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(OrganizationNodeAttributeCommandController.name)
      .get(OrganizationNodeAttributeCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("OrganizationNodeAttribute entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple organizationnodeattributes" })
  @ApiResponse({ status: 200, type: DeleteResult })
  @Delete("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(OrganizationNodeAttributeCommandController.name)
      .get(OrganizationNodeAttributeCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

