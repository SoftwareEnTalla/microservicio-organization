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
import { PlannedSeat } from "../entities/planned-seat.entity";

//Definición de comandos
import {
  CreatePlannedSeatCommand,
  UpdatePlannedSeatCommand,
  DeletePlannedSeatCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PlannedSeatQueryService } from "../services/plannedseatquery.service";


import { PlannedSeatResponse, PlannedSeatsResponse } from "../types/plannedseat.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePlannedSeatDto, 
CreateOrUpdatePlannedSeatDto, 
PlannedSeatValueInput, 
PlannedSeatDto, 
CreatePlannedSeatDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PlannedSeat)
export class PlannedSeatResolver {

   //Constructor del resolver de PlannedSeat
  constructor(
    private readonly service: PlannedSeatQueryService,
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  // Mutaciones
  @Mutation(() => PlannedSeatResponse<PlannedSeat>)
  async createPlannedSeat(
    @Args("input", { type: () => CreatePlannedSeatDto }) input: CreatePlannedSeatDto
  ): Promise<PlannedSeatResponse<PlannedSeat>> {
    return this.commandBus.execute(new CreatePlannedSeatCommand(input));
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  @Mutation(() => PlannedSeatResponse<PlannedSeat>)
  async updatePlannedSeat(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePlannedSeatDto
  ): Promise<PlannedSeatResponse<PlannedSeat>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePlannedSeatCommand(payLoad, {
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  @Mutation(() => PlannedSeatResponse<PlannedSeat>)
  async createOrUpdatePlannedSeat(
    @Args("data", { type: () => CreateOrUpdatePlannedSeatDto })
    data: CreateOrUpdatePlannedSeatDto
  ): Promise<PlannedSeatResponse<PlannedSeat>> {
    if (data.id) {
      const existingPlannedSeat = await this.service.findById(data.id);
      if (existingPlannedSeat) {
        return this.commandBus.execute(
          new UpdatePlannedSeatCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePlannedSeatDto | UpdatePlannedSeatDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePlannedSeatCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePlannedSeatDto | UpdatePlannedSeatDto).createdBy ||
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePlannedSeat(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePlannedSeatCommand(id));
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  // Queries
  @Query(() => PlannedSeatsResponse<PlannedSeat>)
  async plannedseats(
    options?: FindManyOptions<PlannedSeat>,
    paginationArgs?: PaginationArgs
  ): Promise<PlannedSeatsResponse<PlannedSeat>> {
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  @Query(() => PlannedSeatsResponse<PlannedSeat>)
  async plannedseat(
    @Args("id", { type: () => String }) id: string
  ): Promise<PlannedSeatResponse<PlannedSeat>> {
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  @Query(() => PlannedSeatsResponse<PlannedSeat>)
  async plannedseatsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PlannedSeatValueInput }) value: PlannedSeatValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PlannedSeatsResponse<PlannedSeat>> {
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  @Query(() => PlannedSeatsResponse<PlannedSeat>)
  async plannedseatsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PlannedSeatsResponse<PlannedSeat>> {
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  @Query(() => Number)
  async totalPlannedSeats(): Promise<number> {
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  @Query(() => PlannedSeatsResponse<PlannedSeat>)
  async searchPlannedSeats(
    @Args("where", { type: () => PlannedSeatDto, nullable: false })
    where: Record<string, any>
  ): Promise<PlannedSeatsResponse<PlannedSeat>> {
    const plannedseats = await this.service.findAndCount(where);
    return plannedseats;
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  @Query(() => PlannedSeatResponse<PlannedSeat>, { nullable: true })
  async findOnePlannedSeat(
    @Args("where", { type: () => PlannedSeatDto, nullable: false })
    where: Record<string, any>
  ): Promise<PlannedSeatResponse<PlannedSeat>> {
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
      .registerClient(PlannedSeatResolver.name)

      .get(PlannedSeatResolver.name),
    })
  @Query(() => PlannedSeatResponse<PlannedSeat>)
  async findOnePlannedSeatOrFail(
    @Args("where", { type: () => PlannedSeatDto, nullable: false })
    where: Record<string, any>
  ): Promise<PlannedSeatResponse<PlannedSeat> | Error> {
    return this.service.findOneOrFail(where);
  }
}

