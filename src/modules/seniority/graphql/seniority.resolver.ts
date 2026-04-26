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
import { Seniority } from "../entities/seniority.entity";

//Definición de comandos
import {
  CreateSeniorityCommand,
  UpdateSeniorityCommand,
  DeleteSeniorityCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { SeniorityQueryService } from "../services/seniorityquery.service";


import { SeniorityResponse, SenioritysResponse } from "../types/seniority.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateSeniorityDto, 
CreateOrUpdateSeniorityDto, 
SeniorityValueInput, 
SeniorityDto, 
CreateSeniorityDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Seniority)
export class SeniorityResolver {

   //Constructor del resolver de Seniority
  constructor(
    private readonly service: SeniorityQueryService,
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  // Mutaciones
  @Mutation(() => SeniorityResponse<Seniority>)
  async createSeniority(
    @Args("input", { type: () => CreateSeniorityDto }) input: CreateSeniorityDto
  ): Promise<SeniorityResponse<Seniority>> {
    return this.commandBus.execute(new CreateSeniorityCommand(input));
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  @Mutation(() => SeniorityResponse<Seniority>)
  async updateSeniority(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateSeniorityDto
  ): Promise<SeniorityResponse<Seniority>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateSeniorityCommand(payLoad, {
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  @Mutation(() => SeniorityResponse<Seniority>)
  async createOrUpdateSeniority(
    @Args("data", { type: () => CreateOrUpdateSeniorityDto })
    data: CreateOrUpdateSeniorityDto
  ): Promise<SeniorityResponse<Seniority>> {
    if (data.id) {
      const existingSeniority = await this.service.findById(data.id);
      if (existingSeniority) {
        return this.commandBus.execute(
          new UpdateSeniorityCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateSeniorityDto | UpdateSeniorityDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateSeniorityCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateSeniorityDto | UpdateSeniorityDto).createdBy ||
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteSeniority(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteSeniorityCommand(id));
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  // Queries
  @Query(() => SenioritysResponse<Seniority>)
  async senioritys(
    options?: FindManyOptions<Seniority>,
    paginationArgs?: PaginationArgs
  ): Promise<SenioritysResponse<Seniority>> {
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  @Query(() => SenioritysResponse<Seniority>)
  async seniority(
    @Args("id", { type: () => String }) id: string
  ): Promise<SeniorityResponse<Seniority>> {
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  @Query(() => SenioritysResponse<Seniority>)
  async senioritysByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => SeniorityValueInput }) value: SeniorityValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SenioritysResponse<Seniority>> {
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  @Query(() => SenioritysResponse<Seniority>)
  async senioritysWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SenioritysResponse<Seniority>> {
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  @Query(() => Number)
  async totalSenioritys(): Promise<number> {
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  @Query(() => SenioritysResponse<Seniority>)
  async searchSenioritys(
    @Args("where", { type: () => SeniorityDto, nullable: false })
    where: Record<string, any>
  ): Promise<SenioritysResponse<Seniority>> {
    const senioritys = await this.service.findAndCount(where);
    return senioritys;
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  @Query(() => SeniorityResponse<Seniority>, { nullable: true })
  async findOneSeniority(
    @Args("where", { type: () => SeniorityDto, nullable: false })
    where: Record<string, any>
  ): Promise<SeniorityResponse<Seniority>> {
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
      .registerClient(SeniorityResolver.name)

      .get(SeniorityResolver.name),
    })
  @Query(() => SeniorityResponse<Seniority>)
  async findOneSeniorityOrFail(
    @Args("where", { type: () => SeniorityDto, nullable: false })
    where: Record<string, any>
  ): Promise<SeniorityResponse<Seniority> | Error> {
    return this.service.findOneOrFail(where);
  }
}

