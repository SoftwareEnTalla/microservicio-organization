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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  MoreThanOrEqual,
  Repository,
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { HeadcountOverrideMode } from '../entities/headcount-override-mode.entity';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {HeadcountOverrideModeRepository} from './headcountoverridemode.repository'

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

  @Injectable()
  export class HeadcountOverrideModeQueryRepository {

    //Constructor del repositorio de datos: HeadcountOverrideModeQueryRepository
    constructor(
      @InjectRepository(HeadcountOverrideMode)
      private readonly repository: Repository<HeadcountOverrideMode>
    ) {
      this.validate();
    }

    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(HeadcountOverrideModeRepository.name)
      .get(HeadcountOverrideModeRepository.name),
  })
    private validate(): void {
      const entityInstance = Object.create(HeadcountOverrideMode.prototype);

      if (!(entityInstance instanceof BaseEntity)) {
        throw new Error(
          `El tipo ${HeadcountOverrideMode.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
        );
      }
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(HeadcountOverrideModeRepository.name)
      .get(HeadcountOverrideModeRepository.name),
  })
    async findAll(options?: FindManyOptions<HeadcountOverrideMode>): Promise<HeadcountOverrideMode[]> {
      logger.info('Ready to findAll HeadcountOverrideMode on repository:', options);
      return this.repository.find(options);
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(HeadcountOverrideModeRepository.name)
      .get(HeadcountOverrideModeRepository.name),
  })
    async findById(id: string): Promise<HeadcountOverrideMode | null> {
      const tmp: FindOptionsWhere<HeadcountOverrideMode> = { id } as FindOptionsWhere<HeadcountOverrideMode>;
      logger.info('Ready to findById HeadcountOverrideMode on repository:', tmp);
      return this.repository.findOneBy(tmp);
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(HeadcountOverrideModeRepository.name)
      .get(HeadcountOverrideModeRepository.name),
  })
    async findByField(
      field: string,
      value: any,
      page: number,
      limit: number
    ): Promise<HeadcountOverrideMode[]> {
      let options={
        where: { [field]: value },
        skip: (page - 1) * limit,
        take: limit,
      };
      logger.info('Ready to findByField HeadcountOverrideMode on repository:', options);
      const [entities] = await this.repository.findAndCount(options);
      return entities;
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(HeadcountOverrideModeRepository.name)
      .get(HeadcountOverrideModeRepository.name),
  })
    async findWithPagination(
      options: FindManyOptions<HeadcountOverrideMode>,
      page: number,
      limit: number
    ): Promise<HeadcountOverrideMode[]> {
      const skip = (page - 1) * limit;
      options={ ...options, skip, take: limit };
      logger.info('Ready to findWithPagination HeadcountOverrideMode on repository:', options);
      return this.repository.find(options);
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(HeadcountOverrideModeRepository.name)
      .get(HeadcountOverrideModeRepository.name),
  })
    async count(): Promise<number> {
      logger.info('Ready to count HeadcountOverrideMode on repository...');
      let result= this.repository.count();
      logger.info('Was counted  instances of HeadcountOverrideMode on repository:');
      return result;
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(HeadcountOverrideModeRepository.name)
      .get(HeadcountOverrideModeRepository.name),
  })
    async findAndCount(where?: Record<string, any>): Promise<[HeadcountOverrideMode[], number]> {
      logger.info('Ready to findAndCount HeadcountOverrideMode on repository:',where);
      let result= this.repository.findAndCount({
        where: where,
      });
      logger.info('Was counted  instances of HeadcountOverrideMode on repository:',result);
      return result;
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(HeadcountOverrideModeRepository.name)
      .get(HeadcountOverrideModeRepository.name),
  })
    async findOne(options?: Record<string, any>): Promise<HeadcountOverrideMode | null> {
      if (!options || Object.keys(options).length === 0) {
        logger.warn('No conditions provided for finding HeadcountOverrideMode.');
        return null;
      }
      // Soporta tanto 'where plano' como FindOneOptions ({ where, relations, order, select })
      const isFindOneOptions = 'where' in options || 'relations' in options || 'order' in options || 'select' in options;
      if (isFindOneOptions) {
        logger.info('Ready to findOne (FindOneOptions) HeadcountOverrideMode:', options);
        return this.repository.findOne(options as any);
      }
      const tmp: FindOptionsWhere<HeadcountOverrideMode> = options as FindOptionsWhere<HeadcountOverrideMode>;
      logger.info('Ready to findOneBy HeadcountOverrideMode on repository:', tmp);
      return this.repository.findOneBy(tmp);
    }


@LogExecutionTime({
    layer: 'repository',
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
      .registerClient(HeadcountOverrideModeRepository.name)
      .get(HeadcountOverrideModeRepository.name),
  })
    async findOneOrFail(where?: Record<string, any>): Promise<HeadcountOverrideMode> {
      logger.info('Ready to findOneOrFail HeadcountOverrideMode on repository:',where);
      const entity = await this.repository.findOne({
        where: where,
      });
      if (!entity) {
        throw new Error('Entity not found');
      }
      return entity;
    }
}
