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


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { OrganizationNodeAttribute } from "../entities/organization-node-attribute.entity";

//Definición de comandos
import {
  CreateOrganizationNodeAttributeCommand,
  UpdateOrganizationNodeAttributeCommand,
  DeleteOrganizationNodeAttributeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { OrganizationNodeAttributeQueryService } from "../services/organizationnodeattributequery.service";


import { OrganizationNodeAttributeResponse, OrganizationNodeAttributesResponse } from "../types/organizationnodeattribute.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateOrganizationNodeAttributeDto, 
CreateOrUpdateOrganizationNodeAttributeDto, 
OrganizationNodeAttributeValueInput, 
OrganizationNodeAttributeDto, 
CreateOrganizationNodeAttributeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => OrganizationNodeAttribute)
export class OrganizationNodeAttributeResolver {

   //Constructor del resolver de OrganizationNodeAttribute
  constructor(
    private readonly service: OrganizationNodeAttributeQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  // Mutaciones
  @Mutation(() => OrganizationNodeAttributeResponse<OrganizationNodeAttribute>)
  async createOrganizationNodeAttribute(
    @Args("input", { type: () => CreateOrganizationNodeAttributeDto }) input: CreateOrganizationNodeAttributeDto
  ): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute>> {
    return this.commandBus.execute(new CreateOrganizationNodeAttributeCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  @Mutation(() => OrganizationNodeAttributeResponse<OrganizationNodeAttribute>)
  async updateOrganizationNodeAttribute(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateOrganizationNodeAttributeDto
  ): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateOrganizationNodeAttributeCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  @Mutation(() => OrganizationNodeAttributeResponse<OrganizationNodeAttribute>)
  async createOrUpdateOrganizationNodeAttribute(
    @Args("data", { type: () => CreateOrUpdateOrganizationNodeAttributeDto })
    data: CreateOrUpdateOrganizationNodeAttributeDto
  ): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute>> {
    if (data.id) {
      const existingOrganizationNodeAttribute = await this.service.findById(data.id);
      if (existingOrganizationNodeAttribute) {
        return this.commandBus.execute(
          new UpdateOrganizationNodeAttributeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateOrganizationNodeAttributeDto | UpdateOrganizationNodeAttributeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateOrganizationNodeAttributeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateOrganizationNodeAttributeDto | UpdateOrganizationNodeAttributeDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteOrganizationNodeAttribute(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteOrganizationNodeAttributeCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  // Queries
  @Query(() => OrganizationNodeAttributesResponse<OrganizationNodeAttribute>)
  async organizationnodeattributes(
    options?: FindManyOptions<OrganizationNodeAttribute>,
    paginationArgs?: PaginationArgs
  ): Promise<OrganizationNodeAttributesResponse<OrganizationNodeAttribute>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  @Query(() => OrganizationNodeAttributesResponse<OrganizationNodeAttribute>)
  async organizationnodeattribute(
    @Args("id", { type: () => String }) id: string
  ): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  @Query(() => OrganizationNodeAttributesResponse<OrganizationNodeAttribute>)
  async organizationnodeattributesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => OrganizationNodeAttributeValueInput }) value: OrganizationNodeAttributeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationNodeAttributesResponse<OrganizationNodeAttribute>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  @Query(() => OrganizationNodeAttributesResponse<OrganizationNodeAttribute>)
  async organizationnodeattributesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationNodeAttributesResponse<OrganizationNodeAttribute>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  @Query(() => Number)
  async totalOrganizationNodeAttributes(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  @Query(() => OrganizationNodeAttributesResponse<OrganizationNodeAttribute>)
  async searchOrganizationNodeAttributes(
    @Args("where", { type: () => OrganizationNodeAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationNodeAttributesResponse<OrganizationNodeAttribute>> {
    const organizationnodeattributes = await this.service.findAndCount(where);
    return organizationnodeattributes;
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  @Query(() => OrganizationNodeAttributeResponse<OrganizationNodeAttribute>, { nullable: true })
  async findOneOrganizationNodeAttribute(
    @Args("where", { type: () => OrganizationNodeAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(OrganizationNodeAttributeResolver.name)

      .get(OrganizationNodeAttributeResolver.name),
    })
  @Query(() => OrganizationNodeAttributeResponse<OrganizationNodeAttribute>)
  async findOneOrganizationNodeAttributeOrFail(
    @Args("where", { type: () => OrganizationNodeAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute> | Error> {
    return this.service.findOneOrFail(where);
  }
}

