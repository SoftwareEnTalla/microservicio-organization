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
import { OrganizationType } from "../entities/organization-type.entity";

//Definición de comandos
import {
  CreateOrganizationTypeCommand,
  UpdateOrganizationTypeCommand,
  DeleteOrganizationTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { OrganizationTypeQueryService } from "../services/organizationtypequery.service";


import { OrganizationTypeResponse, OrganizationTypesResponse } from "../types/organizationtype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateOrganizationTypeDto, 
CreateOrUpdateOrganizationTypeDto, 
OrganizationTypeValueInput, 
OrganizationTypeDto, 
CreateOrganizationTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => OrganizationType)
export class OrganizationTypeResolver {

   //Constructor del resolver de OrganizationType
  constructor(
    private readonly service: OrganizationTypeQueryService,
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => OrganizationTypeResponse<OrganizationType>)
  async createOrganizationType(
    @Args("input", { type: () => CreateOrganizationTypeDto }) input: CreateOrganizationTypeDto
  ): Promise<OrganizationTypeResponse<OrganizationType>> {
    return this.commandBus.execute(new CreateOrganizationTypeCommand(input));
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  @Mutation(() => OrganizationTypeResponse<OrganizationType>)
  async updateOrganizationType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateOrganizationTypeDto
  ): Promise<OrganizationTypeResponse<OrganizationType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateOrganizationTypeCommand(payLoad, {
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  @Mutation(() => OrganizationTypeResponse<OrganizationType>)
  async createOrUpdateOrganizationType(
    @Args("data", { type: () => CreateOrUpdateOrganizationTypeDto })
    data: CreateOrUpdateOrganizationTypeDto
  ): Promise<OrganizationTypeResponse<OrganizationType>> {
    if (data.id) {
      const existingOrganizationType = await this.service.findById(data.id);
      if (existingOrganizationType) {
        return this.commandBus.execute(
          new UpdateOrganizationTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateOrganizationTypeDto | UpdateOrganizationTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateOrganizationTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateOrganizationTypeDto | UpdateOrganizationTypeDto).createdBy ||
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteOrganizationType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteOrganizationTypeCommand(id));
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  // Queries
  @Query(() => OrganizationTypesResponse<OrganizationType>)
  async organizationtypes(
    options?: FindManyOptions<OrganizationType>,
    paginationArgs?: PaginationArgs
  ): Promise<OrganizationTypesResponse<OrganizationType>> {
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  @Query(() => OrganizationTypesResponse<OrganizationType>)
  async organizationtype(
    @Args("id", { type: () => String }) id: string
  ): Promise<OrganizationTypeResponse<OrganizationType>> {
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  @Query(() => OrganizationTypesResponse<OrganizationType>)
  async organizationtypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => OrganizationTypeValueInput }) value: OrganizationTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationTypesResponse<OrganizationType>> {
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  @Query(() => OrganizationTypesResponse<OrganizationType>)
  async organizationtypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationTypesResponse<OrganizationType>> {
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  @Query(() => Number)
  async totalOrganizationTypes(): Promise<number> {
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  @Query(() => OrganizationTypesResponse<OrganizationType>)
  async searchOrganizationTypes(
    @Args("where", { type: () => OrganizationTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationTypesResponse<OrganizationType>> {
    const organizationtypes = await this.service.findAndCount(where);
    return organizationtypes;
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  @Query(() => OrganizationTypeResponse<OrganizationType>, { nullable: true })
  async findOneOrganizationType(
    @Args("where", { type: () => OrganizationTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationTypeResponse<OrganizationType>> {
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
      .registerClient(OrganizationTypeResolver.name)

      .get(OrganizationTypeResolver.name),
    })
  @Query(() => OrganizationTypeResponse<OrganizationType>)
  async findOneOrganizationTypeOrFail(
    @Args("where", { type: () => OrganizationTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationTypeResponse<OrganizationType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

