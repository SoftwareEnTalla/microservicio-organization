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
import { OrganizationNode } from "../entities/organization-node.entity";

//Definición de comandos
import {
  CreateOrganizationNodeCommand,
  UpdateOrganizationNodeCommand,
  DeleteOrganizationNodeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { OrganizationNodeQueryService } from "../services/organizationnodequery.service";


import { OrganizationNodeResponse, OrganizationNodesResponse } from "../types/organizationnode.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateOrganizationNodeDto, 
CreateOrUpdateOrganizationNodeDto, 
OrganizationNodeValueInput, 
OrganizationNodeDto, 
CreateOrganizationNodeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => OrganizationNode)
export class OrganizationNodeResolver {

   //Constructor del resolver de OrganizationNode
  constructor(
    private readonly service: OrganizationNodeQueryService,
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  // Mutaciones
  @Mutation(() => OrganizationNodeResponse<OrganizationNode>)
  async createOrganizationNode(
    @Args("input", { type: () => CreateOrganizationNodeDto }) input: CreateOrganizationNodeDto
  ): Promise<OrganizationNodeResponse<OrganizationNode>> {
    return this.commandBus.execute(new CreateOrganizationNodeCommand(input));
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  @Mutation(() => OrganizationNodeResponse<OrganizationNode>)
  async updateOrganizationNode(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateOrganizationNodeDto
  ): Promise<OrganizationNodeResponse<OrganizationNode>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateOrganizationNodeCommand(payLoad, {
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  @Mutation(() => OrganizationNodeResponse<OrganizationNode>)
  async createOrUpdateOrganizationNode(
    @Args("data", { type: () => CreateOrUpdateOrganizationNodeDto })
    data: CreateOrUpdateOrganizationNodeDto
  ): Promise<OrganizationNodeResponse<OrganizationNode>> {
    if (data.id) {
      const existingOrganizationNode = await this.service.findById(data.id);
      if (existingOrganizationNode) {
        return this.commandBus.execute(
          new UpdateOrganizationNodeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateOrganizationNodeDto | UpdateOrganizationNodeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateOrganizationNodeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateOrganizationNodeDto | UpdateOrganizationNodeDto).createdBy ||
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteOrganizationNode(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteOrganizationNodeCommand(id));
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  // Queries
  @Query(() => OrganizationNodesResponse<OrganizationNode>)
  async organizationnodes(
    options?: FindManyOptions<OrganizationNode>,
    paginationArgs?: PaginationArgs
  ): Promise<OrganizationNodesResponse<OrganizationNode>> {
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  @Query(() => OrganizationNodesResponse<OrganizationNode>)
  async organizationnode(
    @Args("id", { type: () => String }) id: string
  ): Promise<OrganizationNodeResponse<OrganizationNode>> {
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  @Query(() => OrganizationNodesResponse<OrganizationNode>)
  async organizationnodesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => OrganizationNodeValueInput }) value: OrganizationNodeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationNodesResponse<OrganizationNode>> {
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  @Query(() => OrganizationNodesResponse<OrganizationNode>)
  async organizationnodesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OrganizationNodesResponse<OrganizationNode>> {
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  @Query(() => Number)
  async totalOrganizationNodes(): Promise<number> {
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  @Query(() => OrganizationNodesResponse<OrganizationNode>)
  async searchOrganizationNodes(
    @Args("where", { type: () => OrganizationNodeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationNodesResponse<OrganizationNode>> {
    const organizationnodes = await this.service.findAndCount(where);
    return organizationnodes;
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  @Query(() => OrganizationNodeResponse<OrganizationNode>, { nullable: true })
  async findOneOrganizationNode(
    @Args("where", { type: () => OrganizationNodeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationNodeResponse<OrganizationNode>> {
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
      .registerClient(OrganizationNodeResolver.name)

      .get(OrganizationNodeResolver.name),
    })
  @Query(() => OrganizationNodeResponse<OrganizationNode>)
  async findOneOrganizationNodeOrFail(
    @Args("where", { type: () => OrganizationNodeDto, nullable: false })
    where: Record<string, any>
  ): Promise<OrganizationNodeResponse<OrganizationNode> | Error> {
    return this.service.findOneOrFail(where);
  }
}

