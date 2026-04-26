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
import { HeadcountOverrideStatus } from "../entities/headcount-override-status.entity";

//Definición de comandos
import {
  CreateHeadcountOverrideStatusCommand,
  UpdateHeadcountOverrideStatusCommand,
  DeleteHeadcountOverrideStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { HeadcountOverrideStatusQueryService } from "../services/headcountoverridestatusquery.service";


import { HeadcountOverrideStatusResponse, HeadcountOverrideStatussResponse } from "../types/headcountoverridestatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateHeadcountOverrideStatusDto, 
CreateOrUpdateHeadcountOverrideStatusDto, 
HeadcountOverrideStatusValueInput, 
HeadcountOverrideStatusDto, 
CreateHeadcountOverrideStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => HeadcountOverrideStatus)
export class HeadcountOverrideStatusResolver {

   //Constructor del resolver de HeadcountOverrideStatus
  constructor(
    private readonly service: HeadcountOverrideStatusQueryService,
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => HeadcountOverrideStatusResponse<HeadcountOverrideStatus>)
  async createHeadcountOverrideStatus(
    @Args("input", { type: () => CreateHeadcountOverrideStatusDto }) input: CreateHeadcountOverrideStatusDto
  ): Promise<HeadcountOverrideStatusResponse<HeadcountOverrideStatus>> {
    return this.commandBus.execute(new CreateHeadcountOverrideStatusCommand(input));
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  @Mutation(() => HeadcountOverrideStatusResponse<HeadcountOverrideStatus>)
  async updateHeadcountOverrideStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateHeadcountOverrideStatusDto
  ): Promise<HeadcountOverrideStatusResponse<HeadcountOverrideStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateHeadcountOverrideStatusCommand(payLoad, {
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  @Mutation(() => HeadcountOverrideStatusResponse<HeadcountOverrideStatus>)
  async createOrUpdateHeadcountOverrideStatus(
    @Args("data", { type: () => CreateOrUpdateHeadcountOverrideStatusDto })
    data: CreateOrUpdateHeadcountOverrideStatusDto
  ): Promise<HeadcountOverrideStatusResponse<HeadcountOverrideStatus>> {
    if (data.id) {
      const existingHeadcountOverrideStatus = await this.service.findById(data.id);
      if (existingHeadcountOverrideStatus) {
        return this.commandBus.execute(
          new UpdateHeadcountOverrideStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateHeadcountOverrideStatusDto | UpdateHeadcountOverrideStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateHeadcountOverrideStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateHeadcountOverrideStatusDto | UpdateHeadcountOverrideStatusDto).createdBy ||
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteHeadcountOverrideStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteHeadcountOverrideStatusCommand(id));
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  // Queries
  @Query(() => HeadcountOverrideStatussResponse<HeadcountOverrideStatus>)
  async headcountoverridestatuss(
    options?: FindManyOptions<HeadcountOverrideStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<HeadcountOverrideStatussResponse<HeadcountOverrideStatus>> {
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  @Query(() => HeadcountOverrideStatussResponse<HeadcountOverrideStatus>)
  async headcountoverridestatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<HeadcountOverrideStatusResponse<HeadcountOverrideStatus>> {
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  @Query(() => HeadcountOverrideStatussResponse<HeadcountOverrideStatus>)
  async headcountoverridestatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => HeadcountOverrideStatusValueInput }) value: HeadcountOverrideStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HeadcountOverrideStatussResponse<HeadcountOverrideStatus>> {
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  @Query(() => HeadcountOverrideStatussResponse<HeadcountOverrideStatus>)
  async headcountoverridestatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HeadcountOverrideStatussResponse<HeadcountOverrideStatus>> {
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  @Query(() => Number)
  async totalHeadcountOverrideStatuss(): Promise<number> {
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  @Query(() => HeadcountOverrideStatussResponse<HeadcountOverrideStatus>)
  async searchHeadcountOverrideStatuss(
    @Args("where", { type: () => HeadcountOverrideStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<HeadcountOverrideStatussResponse<HeadcountOverrideStatus>> {
    const headcountoverridestatuss = await this.service.findAndCount(where);
    return headcountoverridestatuss;
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  @Query(() => HeadcountOverrideStatusResponse<HeadcountOverrideStatus>, { nullable: true })
  async findOneHeadcountOverrideStatus(
    @Args("where", { type: () => HeadcountOverrideStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<HeadcountOverrideStatusResponse<HeadcountOverrideStatus>> {
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
      .registerClient(HeadcountOverrideStatusResolver.name)

      .get(HeadcountOverrideStatusResolver.name),
    })
  @Query(() => HeadcountOverrideStatusResponse<HeadcountOverrideStatus>)
  async findOneHeadcountOverrideStatusOrFail(
    @Args("where", { type: () => HeadcountOverrideStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<HeadcountOverrideStatusResponse<HeadcountOverrideStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

