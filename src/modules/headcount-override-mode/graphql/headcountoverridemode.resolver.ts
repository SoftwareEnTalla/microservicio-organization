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
import { HeadcountOverrideMode } from "../entities/headcount-override-mode.entity";

//Definición de comandos
import {
  CreateHeadcountOverrideModeCommand,
  UpdateHeadcountOverrideModeCommand,
  DeleteHeadcountOverrideModeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { HeadcountOverrideModeQueryService } from "../services/headcountoverridemodequery.service";


import { HeadcountOverrideModeResponse, HeadcountOverrideModesResponse } from "../types/headcountoverridemode.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateHeadcountOverrideModeDto, 
CreateOrUpdateHeadcountOverrideModeDto, 
HeadcountOverrideModeValueInput, 
HeadcountOverrideModeDto, 
CreateHeadcountOverrideModeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => HeadcountOverrideMode)
export class HeadcountOverrideModeResolver {

   //Constructor del resolver de HeadcountOverrideMode
  constructor(
    private readonly service: HeadcountOverrideModeQueryService,
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  // Mutaciones
  @Mutation(() => HeadcountOverrideModeResponse<HeadcountOverrideMode>)
  async createHeadcountOverrideMode(
    @Args("input", { type: () => CreateHeadcountOverrideModeDto }) input: CreateHeadcountOverrideModeDto
  ): Promise<HeadcountOverrideModeResponse<HeadcountOverrideMode>> {
    return this.commandBus.execute(new CreateHeadcountOverrideModeCommand(input));
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  @Mutation(() => HeadcountOverrideModeResponse<HeadcountOverrideMode>)
  async updateHeadcountOverrideMode(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateHeadcountOverrideModeDto
  ): Promise<HeadcountOverrideModeResponse<HeadcountOverrideMode>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateHeadcountOverrideModeCommand(payLoad, {
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  @Mutation(() => HeadcountOverrideModeResponse<HeadcountOverrideMode>)
  async createOrUpdateHeadcountOverrideMode(
    @Args("data", { type: () => CreateOrUpdateHeadcountOverrideModeDto })
    data: CreateOrUpdateHeadcountOverrideModeDto
  ): Promise<HeadcountOverrideModeResponse<HeadcountOverrideMode>> {
    if (data.id) {
      const existingHeadcountOverrideMode = await this.service.findById(data.id);
      if (existingHeadcountOverrideMode) {
        return this.commandBus.execute(
          new UpdateHeadcountOverrideModeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateHeadcountOverrideModeDto | UpdateHeadcountOverrideModeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateHeadcountOverrideModeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateHeadcountOverrideModeDto | UpdateHeadcountOverrideModeDto).createdBy ||
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteHeadcountOverrideMode(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteHeadcountOverrideModeCommand(id));
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  // Queries
  @Query(() => HeadcountOverrideModesResponse<HeadcountOverrideMode>)
  async headcountoverridemodes(
    options?: FindManyOptions<HeadcountOverrideMode>,
    paginationArgs?: PaginationArgs
  ): Promise<HeadcountOverrideModesResponse<HeadcountOverrideMode>> {
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  @Query(() => HeadcountOverrideModesResponse<HeadcountOverrideMode>)
  async headcountoverridemode(
    @Args("id", { type: () => String }) id: string
  ): Promise<HeadcountOverrideModeResponse<HeadcountOverrideMode>> {
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  @Query(() => HeadcountOverrideModesResponse<HeadcountOverrideMode>)
  async headcountoverridemodesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => HeadcountOverrideModeValueInput }) value: HeadcountOverrideModeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HeadcountOverrideModesResponse<HeadcountOverrideMode>> {
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  @Query(() => HeadcountOverrideModesResponse<HeadcountOverrideMode>)
  async headcountoverridemodesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HeadcountOverrideModesResponse<HeadcountOverrideMode>> {
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  @Query(() => Number)
  async totalHeadcountOverrideModes(): Promise<number> {
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  @Query(() => HeadcountOverrideModesResponse<HeadcountOverrideMode>)
  async searchHeadcountOverrideModes(
    @Args("where", { type: () => HeadcountOverrideModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<HeadcountOverrideModesResponse<HeadcountOverrideMode>> {
    const headcountoverridemodes = await this.service.findAndCount(where);
    return headcountoverridemodes;
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  @Query(() => HeadcountOverrideModeResponse<HeadcountOverrideMode>, { nullable: true })
  async findOneHeadcountOverrideMode(
    @Args("where", { type: () => HeadcountOverrideModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<HeadcountOverrideModeResponse<HeadcountOverrideMode>> {
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
      .registerClient(HeadcountOverrideModeResolver.name)

      .get(HeadcountOverrideModeResolver.name),
    })
  @Query(() => HeadcountOverrideModeResponse<HeadcountOverrideMode>)
  async findOneHeadcountOverrideModeOrFail(
    @Args("where", { type: () => HeadcountOverrideModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<HeadcountOverrideModeResponse<HeadcountOverrideMode> | Error> {
    return this.service.findOneOrFail(where);
  }
}

