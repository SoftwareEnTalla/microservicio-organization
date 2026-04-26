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
import { OrganizationNodeStatus } from "../entities/organization-node-status.entity";

//Definición de comandos
import {
  CreateOrganizationNodeStatusCommand,
  UpdateOrganizationNodeStatusCommand,
  DeleteOrganizationNodeStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { OrganizationNodeStatusQueryService } from "../services/organizationnodestatusquery.service";


import { OrganizationNodeStatusResponse, OrganizationNodeStatussResponse } from "../types/organizationnodestatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateOrganizationNodeStatusDto, 
CreateOrUpdateOrganizationNodeStatusDto, 
OrganizationNodeStatusValueInput, 
OrganizationNodeStatusDto, 
CreateOrganizationNodeStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => OrganizationNodeStatus)
export class OrganizationNodeStatusResolver {

   //Constructor del resolver de OrganizationNodeStatus
  constructor(
    private readonly service: OrganizationNodeStatusQueryService,
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => OrganizationNodeStatusResponse<OrganizationNodeStatus>)
  async createOrganizationNodeStatus(
    @Args("input", { type: () => CreateOrganizationNodeStatusDto }) input: CreateOrganizationNodeStatusDto
  ): Promise<OrganizationNodeStatusResponse<OrganizationNodeStatus>> {
    return this.commandBus.execute(new CreateOrganizationNodeStatusCommand(input));
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  @Mutation(() => OrganizationNodeStatusResponse<OrganizationNodeStatus>)
  async updateOrganizationNodeStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateOrganizationNodeStatusDto
  ): Promise<OrganizationNodeStatusResponse<OrganizationNodeStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateOrganizationNodeStatusCommand(payLoad, {
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  @Mutation(() => OrganizationNodeStatusResponse<OrganizationNodeStatus>)
  async createOrUpdateOrganizationNodeStatus(
    @Args("data", { type: () => CreateOrUpdateOrganizationNodeStatusDto })
    data: CreateOrUpdateOrganizationNodeStatusDto
  ): Promise<OrganizationNodeStatusResponse<OrganizationNodeStatus>> {
    if (data.id) {
      const existingOrganizationNodeStatus = await this.service.findById(data.id);
      if (existingOrganizationNodeStatus) {
        return this.commandBus.execute(
          new UpdateOrganizationNodeStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateOrganizationNodeStatusDto | UpdateOrganizationNodeStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateOrganizationNodeStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateOrganizationNodeStatusDto | UpdateOrganizationNodeStatusDto).createdBy ||
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteOrganizationNodeStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteOrganizationNodeStatusCommand(id));
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  // Queries
  @Query(() => OrganizationNodeStatussResponse<OrganizationNodeStatus>)
  async organizationnodestatuss(
    options?: FindManyOptions<OrganizationNodeStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<OrganizationNodeStatussResponse<OrganizationNodeStatus>> {
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  @Query(() => OrganizationNodeStatussResponse<OrganizationNodeStatus>)
  async organizationnodestatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<OrganizationNodeStatusResponse<OrganizationNodeStatus>> {
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  @Query(() => OrganizationNodeStatussResponse<OrganizationNodeStatus>)
  async organizationnodestatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => OrganizationNodeStatusValueInput }) value: OrganizationNodeStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationNodeStatussResponse<OrganizationNodeStatus>> {
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  @Query(() => OrganizationNodeStatussResponse<OrganizationNodeStatus>)
  async organizationnodestatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationNodeStatussResponse<OrganizationNodeStatus>> {
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  @Query(() => Number)
  async totalOrganizationNodeStatuss(): Promise<number> {
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  @Query(() => OrganizationNodeStatussResponse<OrganizationNodeStatus>)
  async searchOrganizationNodeStatuss(
    @Args("where", { type: () => OrganizationNodeStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationNodeStatussResponse<OrganizationNodeStatus>> {
    const organizationnodestatuss = await this.service.findAndCount(where);
    return organizationnodestatuss;
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  @Query(() => OrganizationNodeStatusResponse<OrganizationNodeStatus>, { nullable: true })
  async findOneOrganizationNodeStatus(
    @Args("where", { type: () => OrganizationNodeStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationNodeStatusResponse<OrganizationNodeStatus>> {
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
      .registerClient(OrganizationNodeStatusResolver.name)

      .get(OrganizationNodeStatusResolver.name),
    })
  @Query(() => OrganizationNodeStatusResponse<OrganizationNodeStatus>)
  async findOneOrganizationNodeStatusOrFail(
    @Args("where", { type: () => OrganizationNodeStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationNodeStatusResponse<OrganizationNodeStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

