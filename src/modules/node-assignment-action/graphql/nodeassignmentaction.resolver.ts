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
import { NodeAssignmentAction } from "../entities/node-assignment-action.entity";

//Definición de comandos
import {
  CreateNodeAssignmentActionCommand,
  UpdateNodeAssignmentActionCommand,
  DeleteNodeAssignmentActionCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { NodeAssignmentActionQueryService } from "../services/nodeassignmentactionquery.service";


import { NodeAssignmentActionResponse, NodeAssignmentActionsResponse } from "../types/nodeassignmentaction.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateNodeAssignmentActionDto, 
CreateOrUpdateNodeAssignmentActionDto, 
NodeAssignmentActionValueInput, 
NodeAssignmentActionDto, 
CreateNodeAssignmentActionDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => NodeAssignmentAction)
export class NodeAssignmentActionResolver {

   //Constructor del resolver de NodeAssignmentAction
  constructor(
    private readonly service: NodeAssignmentActionQueryService,
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  // Mutaciones
  @Mutation(() => NodeAssignmentActionResponse<NodeAssignmentAction>)
  async createNodeAssignmentAction(
    @Args("input", { type: () => CreateNodeAssignmentActionDto }) input: CreateNodeAssignmentActionDto
  ): Promise<NodeAssignmentActionResponse<NodeAssignmentAction>> {
    return this.commandBus.execute(new CreateNodeAssignmentActionCommand(input));
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  @Mutation(() => NodeAssignmentActionResponse<NodeAssignmentAction>)
  async updateNodeAssignmentAction(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateNodeAssignmentActionDto
  ): Promise<NodeAssignmentActionResponse<NodeAssignmentAction>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateNodeAssignmentActionCommand(payLoad, {
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  @Mutation(() => NodeAssignmentActionResponse<NodeAssignmentAction>)
  async createOrUpdateNodeAssignmentAction(
    @Args("data", { type: () => CreateOrUpdateNodeAssignmentActionDto })
    data: CreateOrUpdateNodeAssignmentActionDto
  ): Promise<NodeAssignmentActionResponse<NodeAssignmentAction>> {
    if (data.id) {
      const existingNodeAssignmentAction = await this.service.findById(data.id);
      if (existingNodeAssignmentAction) {
        return this.commandBus.execute(
          new UpdateNodeAssignmentActionCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateNodeAssignmentActionDto | UpdateNodeAssignmentActionDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateNodeAssignmentActionCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateNodeAssignmentActionDto | UpdateNodeAssignmentActionDto).createdBy ||
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteNodeAssignmentAction(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteNodeAssignmentActionCommand(id));
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  // Queries
  @Query(() => NodeAssignmentActionsResponse<NodeAssignmentAction>)
  async nodeassignmentactions(
    options?: FindManyOptions<NodeAssignmentAction>,
    paginationArgs?: PaginationArgs
  ): Promise<NodeAssignmentActionsResponse<NodeAssignmentAction>> {
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  @Query(() => NodeAssignmentActionsResponse<NodeAssignmentAction>)
  async nodeassignmentaction(
    @Args("id", { type: () => String }) id: string
  ): Promise<NodeAssignmentActionResponse<NodeAssignmentAction>> {
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  @Query(() => NodeAssignmentActionsResponse<NodeAssignmentAction>)
  async nodeassignmentactionsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => NodeAssignmentActionValueInput }) value: NodeAssignmentActionValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<NodeAssignmentActionsResponse<NodeAssignmentAction>> {
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  @Query(() => NodeAssignmentActionsResponse<NodeAssignmentAction>)
  async nodeassignmentactionsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<NodeAssignmentActionsResponse<NodeAssignmentAction>> {
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  @Query(() => Number)
  async totalNodeAssignmentActions(): Promise<number> {
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  @Query(() => NodeAssignmentActionsResponse<NodeAssignmentAction>)
  async searchNodeAssignmentActions(
    @Args("where", { type: () => NodeAssignmentActionDto, nullable: false })
    where: Record<string, any>
  ): Promise<NodeAssignmentActionsResponse<NodeAssignmentAction>> {
    const nodeassignmentactions = await this.service.findAndCount(where);
    return nodeassignmentactions;
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  @Query(() => NodeAssignmentActionResponse<NodeAssignmentAction>, { nullable: true })
  async findOneNodeAssignmentAction(
    @Args("where", { type: () => NodeAssignmentActionDto, nullable: false })
    where: Record<string, any>
  ): Promise<NodeAssignmentActionResponse<NodeAssignmentAction>> {
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
      .registerClient(NodeAssignmentActionResolver.name)

      .get(NodeAssignmentActionResolver.name),
    })
  @Query(() => NodeAssignmentActionResponse<NodeAssignmentAction>)
  async findOneNodeAssignmentActionOrFail(
    @Args("where", { type: () => NodeAssignmentActionDto, nullable: false })
    where: Record<string, any>
  ): Promise<NodeAssignmentActionResponse<NodeAssignmentAction> | Error> {
    return this.service.findOneOrFail(where);
  }
}

