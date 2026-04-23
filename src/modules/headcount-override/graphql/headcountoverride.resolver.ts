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
import { HeadcountOverride } from "../entities/headcount-override.entity";

//Definición de comandos
import {
  CreateHeadcountOverrideCommand,
  UpdateHeadcountOverrideCommand,
  DeleteHeadcountOverrideCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { HeadcountOverrideQueryService } from "../services/headcountoverridequery.service";


import { HeadcountOverrideResponse, HeadcountOverridesResponse } from "../types/headcountoverride.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateHeadcountOverrideDto, 
CreateOrUpdateHeadcountOverrideDto, 
HeadcountOverrideValueInput, 
HeadcountOverrideDto, 
CreateHeadcountOverrideDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => HeadcountOverride)
export class HeadcountOverrideResolver {

   //Constructor del resolver de HeadcountOverride
  constructor(
    private readonly service: HeadcountOverrideQueryService,
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  // Mutaciones
  @Mutation(() => HeadcountOverrideResponse<HeadcountOverride>)
  async createHeadcountOverride(
    @Args("input", { type: () => CreateHeadcountOverrideDto }) input: CreateHeadcountOverrideDto
  ): Promise<HeadcountOverrideResponse<HeadcountOverride>> {
    return this.commandBus.execute(new CreateHeadcountOverrideCommand(input));
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  @Mutation(() => HeadcountOverrideResponse<HeadcountOverride>)
  async updateHeadcountOverride(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateHeadcountOverrideDto
  ): Promise<HeadcountOverrideResponse<HeadcountOverride>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateHeadcountOverrideCommand(payLoad, {
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  @Mutation(() => HeadcountOverrideResponse<HeadcountOverride>)
  async createOrUpdateHeadcountOverride(
    @Args("data", { type: () => CreateOrUpdateHeadcountOverrideDto })
    data: CreateOrUpdateHeadcountOverrideDto
  ): Promise<HeadcountOverrideResponse<HeadcountOverride>> {
    if (data.id) {
      const existingHeadcountOverride = await this.service.findById(data.id);
      if (existingHeadcountOverride) {
        return this.commandBus.execute(
          new UpdateHeadcountOverrideCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateHeadcountOverrideDto | UpdateHeadcountOverrideDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateHeadcountOverrideCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateHeadcountOverrideDto | UpdateHeadcountOverrideDto).createdBy ||
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteHeadcountOverride(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteHeadcountOverrideCommand(id));
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  // Queries
  @Query(() => HeadcountOverridesResponse<HeadcountOverride>)
  async headcountoverrides(
    options?: FindManyOptions<HeadcountOverride>,
    paginationArgs?: PaginationArgs
  ): Promise<HeadcountOverridesResponse<HeadcountOverride>> {
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  @Query(() => HeadcountOverridesResponse<HeadcountOverride>)
  async headcountoverride(
    @Args("id", { type: () => String }) id: string
  ): Promise<HeadcountOverrideResponse<HeadcountOverride>> {
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  @Query(() => HeadcountOverridesResponse<HeadcountOverride>)
  async headcountoverridesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => HeadcountOverrideValueInput }) value: HeadcountOverrideValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HeadcountOverridesResponse<HeadcountOverride>> {
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  @Query(() => HeadcountOverridesResponse<HeadcountOverride>)
  async headcountoverridesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HeadcountOverridesResponse<HeadcountOverride>> {
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  @Query(() => Number)
  async totalHeadcountOverrides(): Promise<number> {
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  @Query(() => HeadcountOverridesResponse<HeadcountOverride>)
  async searchHeadcountOverrides(
    @Args("where", { type: () => HeadcountOverrideDto, nullable: false })
    where: Record<string, any>
  ): Promise<HeadcountOverridesResponse<HeadcountOverride>> {
    const headcountoverrides = await this.service.findAndCount(where);
    return headcountoverrides;
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  @Query(() => HeadcountOverrideResponse<HeadcountOverride>, { nullable: true })
  async findOneHeadcountOverride(
    @Args("where", { type: () => HeadcountOverrideDto, nullable: false })
    where: Record<string, any>
  ): Promise<HeadcountOverrideResponse<HeadcountOverride>> {
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
      .registerClient(HeadcountOverrideResolver.name)

      .get(HeadcountOverrideResolver.name),
    })
  @Query(() => HeadcountOverrideResponse<HeadcountOverride>)
  async findOneHeadcountOverrideOrFail(
    @Args("where", { type: () => HeadcountOverrideDto, nullable: false })
    where: Record<string, any>
  ): Promise<HeadcountOverrideResponse<HeadcountOverride> | Error> {
    return this.service.findOneOrFail(where);
  }
}

