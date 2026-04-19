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


import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Logger,
  UseGuards,
} from "@nestjs/common";
import { OrganizationNodeAttributeQueryService } from "../services/organizationnodeattributequery.service";
import { FindManyOptions } from "typeorm";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { OrganizationNodeAttributeResponse, OrganizationNodeAttributesResponse } from "../types/organizationnodeattribute.types";
import { LoggerClient } from "src/common/logger/logger.client";
import { OrganizationNodeAttribute } from "../entities/organization-node-attribute.entity";
import { OrganizationNodeAttributeAuthGuard } from "../guards/organizationnodeattributeauthguard.guard";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { OrderBy, valueOfOrderBy } from "src/common/types/common.types";
import { Helper } from "src/common/helpers/helpers";
import { OrganizationNodeAttributeDto } from "../dtos/all-dto";

import { logger } from '@core/logs/logger';

@ApiTags("OrganizationNodeAttribute Query")
@UseGuards(OrganizationNodeAttributeAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticación requerida." })
@Controller("organizationnodeattributes/query")
export class OrganizationNodeAttributeQueryController {
  #logger = new Logger(OrganizationNodeAttributeQueryController.name);

  constructor(private readonly service: OrganizationNodeAttributeQueryService) {}

  @Get("list")
  @ApiOperation({ summary: "Get all organizationnodeattribute with optional pagination" })
  @ApiResponse({ status: 200, type: OrganizationNodeAttributesResponse })
  @ApiQuery({ name: "options", required: false, type: OrganizationNodeAttributeDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(OrganizationNodeAttributeQueryService.name)
      .get(OrganizationNodeAttributeQueryService.name),
  })
  async findAll(
    @Query("options") options?: FindManyOptions<OrganizationNodeAttribute>    
  ): Promise<OrganizationNodeAttributesResponse<OrganizationNodeAttribute>> {
    try {
     
      const organizationnodeattributes = await this.service.findAll(options);
      logger.info("Retrieving all organizationnodeattribute");
      return organizationnodeattributes;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get organizationnodeattribute by ID" })
  @ApiResponse({ status: 200, type: OrganizationNodeAttributeResponse<OrganizationNodeAttribute> })
  @ApiResponse({ status: 404, description: "OrganizationNodeAttribute not found" })
  @ApiParam({ name: 'id', required: true, description: 'ID of the organizationnodeattribute to retrieve', type: String })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(OrganizationNodeAttributeQueryService.name)
      .get(OrganizationNodeAttributeQueryService.name),
  })
  async findById(@Param("id") id: string): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute>> {
    try {
      const organizationnodeattribute = await this.service.findOne({ where: { id } });
      if (!organizationnodeattribute) {
        throw new NotFoundException(
          "OrganizationNodeAttribute no encontrado para el id solicitado"
        );
      }
      return organizationnodeattribute;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("field/:field") // Asegúrate de que el endpoint esté definido correctamente
  @ApiOperation({ summary: "Find organizationnodeattribute by specific field" })
  @ApiQuery({ name: "value", required: true, description: 'Value to search for', type: String }) // Documenta el parámetro de consulta
  @ApiParam({ name: 'field', required: true, description: 'Field to filter organizationnodeattribute', type: String }) // Documenta el parámetro de la ruta
  @ApiResponse({ status: 200, type: OrganizationNodeAttributesResponse })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(OrganizationNodeAttributeQueryService.name)
      .get(OrganizationNodeAttributeQueryService.name),
  })
  async findByField(
    @Param("field") field: string, // Obtiene el campo de la ruta
    @Query("value") value: string, // Obtiene el valor de la consulta
    @Query() paginationArgs?: PaginationArgs
  ): Promise<OrganizationNodeAttributesResponse<OrganizationNodeAttribute>> {
    try {
      const entities = await this.service.findAndCount({
        where: { [field]: value },
        skip:
          ((paginationArgs ? paginationArgs.page : 1) - 1) *
          (paginationArgs ? paginationArgs.size : 25),
        take: paginationArgs ? paginationArgs.size : 25,
      });

      if (!entities) {
        throw new NotFoundException(
          "OrganizationNodeAttribute no encontrados para la propiedad y valor especificado"
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }


  @Get("pagination")
  @ApiOperation({ summary: "Find organizationnodeattributes with pagination" })
  @ApiResponse({ status: 200, type: OrganizationNodeAttributesResponse<OrganizationNodeAttribute> })
  @ApiQuery({ name: "options", required: false, type: OrganizationNodeAttributeDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(OrganizationNodeAttributeQueryService.name)
      .get(OrganizationNodeAttributeQueryService.name),
  })
  async findWithPagination(
    @Query() options: FindManyOptions<OrganizationNodeAttribute>,
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<OrganizationNodeAttributesResponse<OrganizationNodeAttribute>> {
    try {
     const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        valueOfOrderBy(order || OrderBy.asc), // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findWithPagination(
        options,
        paginationArgs
      );
      if (!entities) {
        throw new NotFoundException("Entidades OrganizationNodeAttributes no encontradas.");
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("count")
  @ApiOperation({ summary: "Count all organizationnodeattributes" })
  @ApiResponse({ status: 200, type: Number })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(OrganizationNodeAttributeQueryService.name)
      .get(OrganizationNodeAttributeQueryService.name),
  })
  async count(): Promise<number> {
    return this.service.count();
  }

  @Get("search")
  @ApiOperation({ summary: "Find and count organizationnodeattributes with conditions" })
  @ApiResponse({ status: 200, type: OrganizationNodeAttributesResponse<OrganizationNodeAttribute> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(OrganizationNodeAttributeQueryService.name)
      .get(OrganizationNodeAttributeQueryService.name),
  })
  async findAndCount(
    @Query() where: Record<string, any>={},
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<OrganizationNodeAttributesResponse<OrganizationNodeAttribute>> {
    try {
      const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        valueOfOrderBy(order || OrderBy.asc), // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findAndCount({
        where: where,
        paginationArgs: paginationArgs,
      });

      if (!entities) {
        throw new NotFoundException(
          "Entidades OrganizationNodeAttributes no encontradas para el criterio especificado."
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one")
  @ApiOperation({ summary: "Find one organizationnodeattribute with conditions" })
  @ApiResponse({ status: 200, type: OrganizationNodeAttributeResponse<OrganizationNodeAttribute> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(OrganizationNodeAttributeQueryService.name)
      .get(OrganizationNodeAttributeQueryService.name),
  })
  async findOne(
    @Query() where: Record<string, any>={}
  ): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute>> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        throw new NotFoundException("Entidad OrganizationNodeAttribute no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one-or-fail")
  @ApiOperation({ summary: "Find one organizationnodeattribute or return error" })
  @ApiResponse({ status: 200, type: OrganizationNodeAttributeResponse<OrganizationNodeAttribute> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(OrganizationNodeAttributeQueryService.name)
      .get(OrganizationNodeAttributeQueryService.name),
  })
  async findOneOrFail(
    @Query() where: Record<string, any>={}
  ): Promise<OrganizationNodeAttributeResponse<OrganizationNodeAttribute> | Error> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        return new NotFoundException("Entidad OrganizationNodeAttribute no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }
}


