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
import { NodeType } from "../entities/node-type.entity";

//Definición de comandos
import {
  CreateNodeTypeCommand,
  UpdateNodeTypeCommand,
  DeleteNodeTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { NodeTypeQueryService } from "../services/nodetypequery.service";


import { NodeTypeResponse, NodeTypesResponse } from "../types/nodetype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateNodeTypeDto, 
CreateOrUpdateNodeTypeDto, 
NodeTypeValueInput, 
NodeTypeDto, 
CreateNodeTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => NodeType)
export class NodeTypeResolver {

   //Constructor del resolver de NodeType
  constructor(
    private readonly service: NodeTypeQueryService,
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => NodeTypeResponse<NodeType>)
  async createNodeType(
    @Args("input", { type: () => CreateNodeTypeDto }) input: CreateNodeTypeDto
  ): Promise<NodeTypeResponse<NodeType>> {
    return this.commandBus.execute(new CreateNodeTypeCommand(input));
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  @Mutation(() => NodeTypeResponse<NodeType>)
  async updateNodeType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateNodeTypeDto
  ): Promise<NodeTypeResponse<NodeType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateNodeTypeCommand(payLoad, {
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  @Mutation(() => NodeTypeResponse<NodeType>)
  async createOrUpdateNodeType(
    @Args("data", { type: () => CreateOrUpdateNodeTypeDto })
    data: CreateOrUpdateNodeTypeDto
  ): Promise<NodeTypeResponse<NodeType>> {
    if (data.id) {
      const existingNodeType = await this.service.findById(data.id);
      if (existingNodeType) {
        return this.commandBus.execute(
          new UpdateNodeTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateNodeTypeDto | UpdateNodeTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateNodeTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateNodeTypeDto | UpdateNodeTypeDto).createdBy ||
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteNodeType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteNodeTypeCommand(id));
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  // Queries
  @Query(() => NodeTypesResponse<NodeType>)
  async nodetypes(
    options?: FindManyOptions<NodeType>,
    paginationArgs?: PaginationArgs
  ): Promise<NodeTypesResponse<NodeType>> {
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  @Query(() => NodeTypesResponse<NodeType>)
  async nodetype(
    @Args("id", { type: () => String }) id: string
  ): Promise<NodeTypeResponse<NodeType>> {
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  @Query(() => NodeTypesResponse<NodeType>)
  async nodetypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => NodeTypeValueInput }) value: NodeTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<NodeTypesResponse<NodeType>> {
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  @Query(() => NodeTypesResponse<NodeType>)
  async nodetypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<NodeTypesResponse<NodeType>> {
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  @Query(() => Number)
  async totalNodeTypes(): Promise<number> {
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  @Query(() => NodeTypesResponse<NodeType>)
  async searchNodeTypes(
    @Args("where", { type: () => NodeTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<NodeTypesResponse<NodeType>> {
    const nodetypes = await this.service.findAndCount(where);
    return nodetypes;
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  @Query(() => NodeTypeResponse<NodeType>, { nullable: true })
  async findOneNodeType(
    @Args("where", { type: () => NodeTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<NodeTypeResponse<NodeType>> {
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
      .registerClient(NodeTypeResolver.name)

      .get(NodeTypeResolver.name),
    })
  @Query(() => NodeTypeResponse<NodeType>)
  async findOneNodeTypeOrFail(
    @Args("where", { type: () => NodeTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<NodeTypeResponse<NodeType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

