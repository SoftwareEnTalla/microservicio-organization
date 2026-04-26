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
import { VacancyStatus } from "../entities/vacancy-status.entity";

//Definición de comandos
import {
  CreateVacancyStatusCommand,
  UpdateVacancyStatusCommand,
  DeleteVacancyStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { VacancyStatusQueryService } from "../services/vacancystatusquery.service";


import { VacancyStatusResponse, VacancyStatussResponse } from "../types/vacancystatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateVacancyStatusDto, 
CreateOrUpdateVacancyStatusDto, 
VacancyStatusValueInput, 
VacancyStatusDto, 
CreateVacancyStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => VacancyStatus)
export class VacancyStatusResolver {

   //Constructor del resolver de VacancyStatus
  constructor(
    private readonly service: VacancyStatusQueryService,
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => VacancyStatusResponse<VacancyStatus>)
  async createVacancyStatus(
    @Args("input", { type: () => CreateVacancyStatusDto }) input: CreateVacancyStatusDto
  ): Promise<VacancyStatusResponse<VacancyStatus>> {
    return this.commandBus.execute(new CreateVacancyStatusCommand(input));
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  @Mutation(() => VacancyStatusResponse<VacancyStatus>)
  async updateVacancyStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateVacancyStatusDto
  ): Promise<VacancyStatusResponse<VacancyStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateVacancyStatusCommand(payLoad, {
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  @Mutation(() => VacancyStatusResponse<VacancyStatus>)
  async createOrUpdateVacancyStatus(
    @Args("data", { type: () => CreateOrUpdateVacancyStatusDto })
    data: CreateOrUpdateVacancyStatusDto
  ): Promise<VacancyStatusResponse<VacancyStatus>> {
    if (data.id) {
      const existingVacancyStatus = await this.service.findById(data.id);
      if (existingVacancyStatus) {
        return this.commandBus.execute(
          new UpdateVacancyStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateVacancyStatusDto | UpdateVacancyStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateVacancyStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateVacancyStatusDto | UpdateVacancyStatusDto).createdBy ||
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteVacancyStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteVacancyStatusCommand(id));
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  // Queries
  @Query(() => VacancyStatussResponse<VacancyStatus>)
  async vacancystatuss(
    options?: FindManyOptions<VacancyStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<VacancyStatussResponse<VacancyStatus>> {
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  @Query(() => VacancyStatussResponse<VacancyStatus>)
  async vacancystatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<VacancyStatusResponse<VacancyStatus>> {
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  @Query(() => VacancyStatussResponse<VacancyStatus>)
  async vacancystatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => VacancyStatusValueInput }) value: VacancyStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<VacancyStatussResponse<VacancyStatus>> {
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  @Query(() => VacancyStatussResponse<VacancyStatus>)
  async vacancystatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<VacancyStatussResponse<VacancyStatus>> {
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  @Query(() => Number)
  async totalVacancyStatuss(): Promise<number> {
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  @Query(() => VacancyStatussResponse<VacancyStatus>)
  async searchVacancyStatuss(
    @Args("where", { type: () => VacancyStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<VacancyStatussResponse<VacancyStatus>> {
    const vacancystatuss = await this.service.findAndCount(where);
    return vacancystatuss;
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  @Query(() => VacancyStatusResponse<VacancyStatus>, { nullable: true })
  async findOneVacancyStatus(
    @Args("where", { type: () => VacancyStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<VacancyStatusResponse<VacancyStatus>> {
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
      .registerClient(VacancyStatusResolver.name)

      .get(VacancyStatusResolver.name),
    })
  @Query(() => VacancyStatusResponse<VacancyStatus>)
  async findOneVacancyStatusOrFail(
    @Args("where", { type: () => VacancyStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<VacancyStatusResponse<VacancyStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

