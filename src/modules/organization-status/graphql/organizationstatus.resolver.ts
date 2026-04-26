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
import { OrganizationStatus } from "../entities/organization-status.entity";

//Definición de comandos
import {
  CreateOrganizationStatusCommand,
  UpdateOrganizationStatusCommand,
  DeleteOrganizationStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { OrganizationStatusQueryService } from "../services/organizationstatusquery.service";


import { OrganizationStatusResponse, OrganizationStatussResponse } from "../types/organizationstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateOrganizationStatusDto, 
CreateOrUpdateOrganizationStatusDto, 
OrganizationStatusValueInput, 
OrganizationStatusDto, 
CreateOrganizationStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => OrganizationStatus)
export class OrganizationStatusResolver {

   //Constructor del resolver de OrganizationStatus
  constructor(
    private readonly service: OrganizationStatusQueryService,
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => OrganizationStatusResponse<OrganizationStatus>)
  async createOrganizationStatus(
    @Args("input", { type: () => CreateOrganizationStatusDto }) input: CreateOrganizationStatusDto
  ): Promise<OrganizationStatusResponse<OrganizationStatus>> {
    return this.commandBus.execute(new CreateOrganizationStatusCommand(input));
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  @Mutation(() => OrganizationStatusResponse<OrganizationStatus>)
  async updateOrganizationStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateOrganizationStatusDto
  ): Promise<OrganizationStatusResponse<OrganizationStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateOrganizationStatusCommand(payLoad, {
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  @Mutation(() => OrganizationStatusResponse<OrganizationStatus>)
  async createOrUpdateOrganizationStatus(
    @Args("data", { type: () => CreateOrUpdateOrganizationStatusDto })
    data: CreateOrUpdateOrganizationStatusDto
  ): Promise<OrganizationStatusResponse<OrganizationStatus>> {
    if (data.id) {
      const existingOrganizationStatus = await this.service.findById(data.id);
      if (existingOrganizationStatus) {
        return this.commandBus.execute(
          new UpdateOrganizationStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateOrganizationStatusDto | UpdateOrganizationStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateOrganizationStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateOrganizationStatusDto | UpdateOrganizationStatusDto).createdBy ||
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteOrganizationStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteOrganizationStatusCommand(id));
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  // Queries
  @Query(() => OrganizationStatussResponse<OrganizationStatus>)
  async organizationstatuss(
    options?: FindManyOptions<OrganizationStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<OrganizationStatussResponse<OrganizationStatus>> {
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  @Query(() => OrganizationStatussResponse<OrganizationStatus>)
  async organizationstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<OrganizationStatusResponse<OrganizationStatus>> {
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  @Query(() => OrganizationStatussResponse<OrganizationStatus>)
  async organizationstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => OrganizationStatusValueInput }) value: OrganizationStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationStatussResponse<OrganizationStatus>> {
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  @Query(() => OrganizationStatussResponse<OrganizationStatus>)
  async organizationstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationStatussResponse<OrganizationStatus>> {
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  @Query(() => Number)
  async totalOrganizationStatuss(): Promise<number> {
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  @Query(() => OrganizationStatussResponse<OrganizationStatus>)
  async searchOrganizationStatuss(
    @Args("where", { type: () => OrganizationStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationStatussResponse<OrganizationStatus>> {
    const organizationstatuss = await this.service.findAndCount(where);
    return organizationstatuss;
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  @Query(() => OrganizationStatusResponse<OrganizationStatus>, { nullable: true })
  async findOneOrganizationStatus(
    @Args("where", { type: () => OrganizationStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationStatusResponse<OrganizationStatus>> {
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
      .registerClient(OrganizationStatusResolver.name)

      .get(OrganizationStatusResolver.name),
    })
  @Query(() => OrganizationStatusResponse<OrganizationStatus>)
  async findOneOrganizationStatusOrFail(
    @Args("where", { type: () => OrganizationStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationStatusResponse<OrganizationStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

