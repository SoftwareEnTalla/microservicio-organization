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
import { HeadcountOverrideCommandService } from "../services/headcountoverridecommand.service";
import { HeadcountOverrideAuthGuard } from "../guards/headcountoverrideauthguard.guard";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { HeadcountOverride } from "../entities/headcount-override.entity";
import { HeadcountOverrideResponse, HeadcountOverridesResponse } from "../types/headcountoverride.types";
import { CreateHeadcountOverrideDto, UpdateHeadcountOverrideDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { HeadcountOverrideCreatedEvent } from "../events/headcountoverridecreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("HeadcountOverride Command")
@UseGuards(HeadcountOverrideAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticación requerida." })
@Controller("headcountoverrides/command")
export class HeadcountOverrideCommandController {

  #logger = new Logger(HeadcountOverrideCommandController.name);

  //Constructor del controlador: HeadcountOverrideCommandController
  constructor(
  private readonly service: HeadcountOverrideCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new headcountoverride" })
  @ApiBody({ type: CreateHeadcountOverrideDto })
  @ApiResponse({ status: 201, type: HeadcountOverrideResponse<HeadcountOverride> })
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
      .registerClient(HeadcountOverrideCommandController.name)
      .get(HeadcountOverrideCommandController.name),
  })
  async create(
    @Body() createHeadcountOverrideDtoInput: CreateHeadcountOverrideDto
  ): Promise<HeadcountOverrideResponse<HeadcountOverride>> {
    try {
      logger.info("Receiving in controller:", createHeadcountOverrideDtoInput);
      const entity = await this.service.create(createHeadcountOverrideDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response headcountoverride entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("HeadcountOverride entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id headcountoverride is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple headcountoverrides" })
  @ApiBody({ type: [CreateHeadcountOverrideDto] })
  @ApiResponse({ status: 201, type: HeadcountOverridesResponse<HeadcountOverride> })
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
      .registerClient(HeadcountOverrideCommandController.name)
      .get(HeadcountOverrideCommandController.name),
  })
  async bulkCreate(
    @Body() createHeadcountOverrideDtosInput: CreateHeadcountOverrideDto[]
  ): Promise<HeadcountOverridesResponse<HeadcountOverride>> {
    try {
      const entities = await this.service.bulkCreate(createHeadcountOverrideDtosInput);

      if (!entities) {
        throw new NotFoundException("HeadcountOverride entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an headcountoverride" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdateHeadcountOverrideDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: HeadcountOverrideResponse<HeadcountOverride> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia HeadcountOverride a actualizar.",
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
      .registerClient(HeadcountOverrideCommandController.name)
      .get(HeadcountOverrideCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<HeadcountOverrideResponse<HeadcountOverride>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs
      if (partialEntity?.id && id !== partialEntity.id) {

        throw new BadRequestException(

          "El ID en la URL no coincide con el ID en la instancia de HeadcountOverride a actualizar."

        );

      }

      if (partialEntity && !partialEntity.id) { partialEntity.id = id; }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de HeadcountOverride no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple headcountoverrides" })
  @ApiBody({ type: [UpdateHeadcountOverrideDto] })
  @ApiResponse({ status: 200, type: HeadcountOverridesResponse<HeadcountOverride> })
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
      .registerClient(HeadcountOverrideCommandController.name)
      .get(HeadcountOverrideCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdateHeadcountOverrideDto[]
  ): Promise<HeadcountOverridesResponse<HeadcountOverride>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("HeadcountOverride entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an headcountoverride" })   
  @ApiResponse({ status: 200, type: HeadcountOverrideResponse<HeadcountOverride>,description:
    "Instancia de HeadcountOverride eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia HeadcountOverride a eliminar.",
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
      .registerClient(HeadcountOverrideCommandController.name)
      .get(HeadcountOverrideCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<HeadcountOverrideResponse<HeadcountOverride>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("HeadcountOverride entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple headcountoverrides" })
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
      .registerClient(HeadcountOverrideCommandController.name)
      .get(HeadcountOverrideCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

