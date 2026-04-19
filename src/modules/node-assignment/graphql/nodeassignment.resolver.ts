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
import { NodeAssignment } from "../entities/node-assignment.entity";

//Definición de comandos
import {
  CreateNodeAssignmentCommand,
  UpdateNodeAssignmentCommand,
  DeleteNodeAssignmentCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { NodeAssignmentQueryService } from "../services/nodeassignmentquery.service";


import { NodeAssignmentResponse, NodeAssignmentsResponse } from "../types/nodeassignment.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateNodeAssignmentDto, 
CreateOrUpdateNodeAssignmentDto, 
NodeAssignmentValueInput, 
NodeAssignmentDto, 
CreateNodeAssignmentDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => NodeAssignment)
export class NodeAssignmentResolver {

   //Constructor del resolver de NodeAssignment
  constructor(
    private readonly service: NodeAssignmentQueryService,
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  // Mutaciones
  @Mutation(() => NodeAssignmentResponse<NodeAssignment>)
  async createNodeAssignment(
    @Args("input", { type: () => CreateNodeAssignmentDto }) input: CreateNodeAssignmentDto
  ): Promise<NodeAssignmentResponse<NodeAssignment>> {
    return this.commandBus.execute(new CreateNodeAssignmentCommand(input));
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  @Mutation(() => NodeAssignmentResponse<NodeAssignment>)
  async updateNodeAssignment(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateNodeAssignmentDto
  ): Promise<NodeAssignmentResponse<NodeAssignment>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateNodeAssignmentCommand(payLoad, {
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  @Mutation(() => NodeAssignmentResponse<NodeAssignment>)
  async createOrUpdateNodeAssignment(
    @Args("data", { type: () => CreateOrUpdateNodeAssignmentDto })
    data: CreateOrUpdateNodeAssignmentDto
  ): Promise<NodeAssignmentResponse<NodeAssignment>> {
    if (data.id) {
      const existingNodeAssignment = await this.service.findById(data.id);
      if (existingNodeAssignment) {
        return this.commandBus.execute(
          new UpdateNodeAssignmentCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateNodeAssignmentDto | UpdateNodeAssignmentDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateNodeAssignmentCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateNodeAssignmentDto | UpdateNodeAssignmentDto).createdBy ||
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteNodeAssignment(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteNodeAssignmentCommand(id));
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  // Queries
  @Query(() => NodeAssignmentsResponse<NodeAssignment>)
  async nodeassignments(
    options?: FindManyOptions<NodeAssignment>,
    paginationArgs?: PaginationArgs
  ): Promise<NodeAssignmentsResponse<NodeAssignment>> {
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  @Query(() => NodeAssignmentsResponse<NodeAssignment>)
  async nodeassignment(
    @Args("id", { type: () => String }) id: string
  ): Promise<NodeAssignmentResponse<NodeAssignment>> {
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  @Query(() => NodeAssignmentsResponse<NodeAssignment>)
  async nodeassignmentsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => NodeAssignmentValueInput }) value: NodeAssignmentValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<NodeAssignmentsResponse<NodeAssignment>> {
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  @Query(() => NodeAssignmentsResponse<NodeAssignment>)
  async nodeassignmentsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<NodeAssignmentsResponse<NodeAssignment>> {
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  @Query(() => Number)
  async totalNodeAssignments(): Promise<number> {
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  @Query(() => NodeAssignmentsResponse<NodeAssignment>)
  async searchNodeAssignments(
    @Args("where", { type: () => NodeAssignmentDto, nullable: false })
    where: Record<string, any>
  ): Promise<NodeAssignmentsResponse<NodeAssignment>> {
    const nodeassignments = await this.service.findAndCount(where);
    return nodeassignments;
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  @Query(() => NodeAssignmentResponse<NodeAssignment>, { nullable: true })
  async findOneNodeAssignment(
    @Args("where", { type: () => NodeAssignmentDto, nullable: false })
    where: Record<string, any>
  ): Promise<NodeAssignmentResponse<NodeAssignment>> {
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
      .registerClient(NodeAssignmentResolver.name)

      .get(NodeAssignmentResolver.name),
    })
  @Query(() => NodeAssignmentResponse<NodeAssignment>)
  async findOneNodeAssignmentOrFail(
    @Args("where", { type: () => NodeAssignmentDto, nullable: false })
    where: Record<string, any>
  ): Promise<NodeAssignmentResponse<NodeAssignment> | Error> {
    return this.service.findOneOrFail(where);
  }
}

