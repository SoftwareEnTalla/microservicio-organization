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
import { OrganizationElementType } from "../entities/organization-element-type.entity";

//Definición de comandos
import {
  CreateOrganizationElementTypeCommand,
  UpdateOrganizationElementTypeCommand,
  DeleteOrganizationElementTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { OrganizationElementTypeQueryService } from "../services/organizationelementtypequery.service";


import { OrganizationElementTypeResponse, OrganizationElementTypesResponse } from "../types/organizationelementtype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateOrganizationElementTypeDto, 
CreateOrUpdateOrganizationElementTypeDto, 
OrganizationElementTypeValueInput, 
OrganizationElementTypeDto, 
CreateOrganizationElementTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => OrganizationElementType)
export class OrganizationElementTypeResolver {

   //Constructor del resolver de OrganizationElementType
  constructor(
    private readonly service: OrganizationElementTypeQueryService,
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => OrganizationElementTypeResponse<OrganizationElementType>)
  async createOrganizationElementType(
    @Args("input", { type: () => CreateOrganizationElementTypeDto }) input: CreateOrganizationElementTypeDto
  ): Promise<OrganizationElementTypeResponse<OrganizationElementType>> {
    return this.commandBus.execute(new CreateOrganizationElementTypeCommand(input));
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  @Mutation(() => OrganizationElementTypeResponse<OrganizationElementType>)
  async updateOrganizationElementType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateOrganizationElementTypeDto
  ): Promise<OrganizationElementTypeResponse<OrganizationElementType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateOrganizationElementTypeCommand(payLoad, {
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  @Mutation(() => OrganizationElementTypeResponse<OrganizationElementType>)
  async createOrUpdateOrganizationElementType(
    @Args("data", { type: () => CreateOrUpdateOrganizationElementTypeDto })
    data: CreateOrUpdateOrganizationElementTypeDto
  ): Promise<OrganizationElementTypeResponse<OrganizationElementType>> {
    if (data.id) {
      const existingOrganizationElementType = await this.service.findById(data.id);
      if (existingOrganizationElementType) {
        return this.commandBus.execute(
          new UpdateOrganizationElementTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateOrganizationElementTypeDto | UpdateOrganizationElementTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateOrganizationElementTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateOrganizationElementTypeDto | UpdateOrganizationElementTypeDto).createdBy ||
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteOrganizationElementType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteOrganizationElementTypeCommand(id));
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  // Queries
  @Query(() => OrganizationElementTypesResponse<OrganizationElementType>)
  async organizationelementtypes(
    options?: FindManyOptions<OrganizationElementType>,
    paginationArgs?: PaginationArgs
  ): Promise<OrganizationElementTypesResponse<OrganizationElementType>> {
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  @Query(() => OrganizationElementTypesResponse<OrganizationElementType>)
  async organizationelementtype(
    @Args("id", { type: () => String }) id: string
  ): Promise<OrganizationElementTypeResponse<OrganizationElementType>> {
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  @Query(() => OrganizationElementTypesResponse<OrganizationElementType>)
  async organizationelementtypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => OrganizationElementTypeValueInput }) value: OrganizationElementTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationElementTypesResponse<OrganizationElementType>> {
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  @Query(() => OrganizationElementTypesResponse<OrganizationElementType>)
  async organizationelementtypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationElementTypesResponse<OrganizationElementType>> {
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  @Query(() => Number)
  async totalOrganizationElementTypes(): Promise<number> {
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  @Query(() => OrganizationElementTypesResponse<OrganizationElementType>)
  async searchOrganizationElementTypes(
    @Args("where", { type: () => OrganizationElementTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationElementTypesResponse<OrganizationElementType>> {
    const organizationelementtypes = await this.service.findAndCount(where);
    return organizationelementtypes;
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  @Query(() => OrganizationElementTypeResponse<OrganizationElementType>, { nullable: true })
  async findOneOrganizationElementType(
    @Args("where", { type: () => OrganizationElementTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationElementTypeResponse<OrganizationElementType>> {
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
      .registerClient(OrganizationElementTypeResolver.name)

      .get(OrganizationElementTypeResolver.name),
    })
  @Query(() => OrganizationElementTypeResponse<OrganizationElementType>)
  async findOneOrganizationElementTypeOrFail(
    @Args("where", { type: () => OrganizationElementTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationElementTypeResponse<OrganizationElementType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

