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
  import { OrganizationNodeAttribute } from '../entities/organization-node-attribute.entity';
  import { Cacheable } from '../decorators/cache.decorator';
  import { generateCacheKey } from 'src/utils/functions';

  //Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

  @Injectable()
  export class OrganizationNodeAttributeRepository {
    constructor(
      @InjectRepository(OrganizationNodeAttribute)
      private readonly repository: Repository<OrganizationNodeAttribute>
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
  })
    private validate(): void {
      const entityInstance = Object.create(OrganizationNodeAttribute.prototype);

      if (!(entityInstance instanceof BaseEntity)) {
        throw new Error(
          `El tipo ${OrganizationNodeAttribute.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
        );
      }
    }

    
    //Funciones de Query-Repositories
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    async findAll(options?: FindManyOptions<OrganizationNodeAttribute>): Promise<OrganizationNodeAttribute[]> {
      logger.info('Ready to findAll OrganizationNodeAttribute on repository:',options);
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    async findById(id: string): Promise<OrganizationNodeAttribute | null> {
      const tmp: FindOptionsWhere<OrganizationNodeAttribute> = { id } as FindOptionsWhere<OrganizationNodeAttribute>;
      logger.info('Ready to findById OrganizationNodeAttribute on repository:',tmp);
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    async findByField(
      field: string,
      value: any,
      page: number,
      limit: number
    ): Promise<OrganizationNodeAttribute[]> {
      let options={
        where: { [field]: value },
        skip: (page - 1) * limit,
        take: limit,
      };
      logger.info('Ready to findByField OrganizationNodeAttribute on repository:',options);
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    async findWithPagination(
      options: FindManyOptions<OrganizationNodeAttribute>,
      page: number,
      limit: number
    ): Promise<OrganizationNodeAttribute[]> {
      const skip = (page - 1) * limit;
      options={ ...options, skip, take: limit };
      logger.info('Ready to findByField OrganizationNodeAttribute on repository:',options);
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    async count(): Promise<number> {
      logger.info('Ready to count OrganizationNodeAttribute on repository...');
      let result= this.repository.count();
      logger.info('Was counted  instances of OrganizationNodeAttribute on repository:');
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    async findAndCount(where?: Record<string, any>): Promise<[OrganizationNodeAttribute[], number]> {
      logger.info('Ready to findByField OrganizationNodeAttribute on repository:',where);
      let result = await this.repository.findAndCount(where);
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    async findOne(where?: Record<string, any>): Promise<OrganizationNodeAttribute | null> {
      const tmp: FindOptionsWhere<OrganizationNodeAttribute> = where as FindOptionsWhere<OrganizationNodeAttribute>;
      logger.info('Ready to findOneBy OrganizationNodeAttribute on repository with conditions:', tmp);
      // Si 'where' es undefined o null, puedes manejarlo según tu lógica
      if (!where) {
        logger.warn('No conditions provided for finding OrganizationNodeAttribute.');
        return null; // O maneja el caso como prefieras
      }
      logger.info('Ready to findOneBy OrganizationNodeAttribute on repository:',tmp);
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    async findOneOrFail(where?: Record<string, any>): Promise<OrganizationNodeAttribute> {
      logger.info('Ready to findOneOrFail OrganizationNodeAttribute on repository:',where);
      const entity = await this.repository.findOne({
        where: where,
      });
      if (!entity) {
        throw new Error('Entity not found');
      }
      return entity;
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    //Funciones de Command-Repositories
    @Cacheable({ key: (args) => generateCacheKey<OrganizationNodeAttribute>('createOrganizationNodeAttribute',args[0], args[1]), ttl: 60 })
    async create(entity: OrganizationNodeAttribute): Promise<OrganizationNodeAttribute> {
        logger.info('Ready to create OrganizationNodeAttribute on repository:', entity);
        const result = await this.repository.save(entity);
        logger.info('New instance of OrganizationNodeAttribute was created with id:'+ result.id+' on repository:', result);         
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    @Cacheable({ key: (args) => generateCacheKey<OrganizationNodeAttribute[]>('createOrganizationNodeAttributes',args[0], args[1]), ttl: 60 })
    async bulkCreate(entities: OrganizationNodeAttribute[]): Promise<OrganizationNodeAttribute[]> {
      logger.info('Ready to create OrganizationNodeAttribute on repository:', entities);
      const result = await this.repository.save(entities);
      logger.info('New '+entities.length+' instances of OrganizationNodeAttribute was created on repository:', result);      
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    @Cacheable({ key: (args) => generateCacheKey<OrganizationNodeAttribute>('updateOrganizationNodeAttribute',args[0], args[1]), ttl: 60 })
    async update(
        id: string,
        partialEntity: Partial<OrganizationNodeAttribute>
      ): Promise<OrganizationNodeAttribute | null> {
        logger.info('Ready to update OrganizationNodeAttribute on repository:', partialEntity);
        let result = await this.repository.update(id, partialEntity);
        logger.info('update OrganizationNodeAttribute on repository was successfully :', partialEntity);
        let instance=await this.repository.findOneBy({ id: id });
        logger.info('Updated instance of OrganizationNodeAttribute with id:  was finded on repository:', instance);
        return this.repository.findOneBy({ id: id });
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    @Cacheable({ key: (args) => generateCacheKey<OrganizationNodeAttribute[]>('updateOrganizationNodeAttributes',args[0], args[1]), ttl: 60 })
    async bulkUpdate(entities: Partial<OrganizationNodeAttribute>[]): Promise<OrganizationNodeAttribute[]> {
        const updatedEntities: OrganizationNodeAttribute[] = [];
        logger.info('Ready to update '+entities.length+' entities on repository:', entities);
        for (const entity of entities) {
          if (entity.id) {
            const updatedEntity = await this.update(entity.id, entity);
            if (updatedEntity) {
              updatedEntities.push(updatedEntity);
            }
          }
        }
        logger.info('Already updated '+updatedEntities.length+' entities on repository:', updatedEntities);
        return updatedEntities;
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    @Cacheable({ key: (args) => generateCacheKey<string>('deleteOrganizationNodeAttribute',args[0]), ttl: 60 })
    async delete(id: string): Promise<DeleteResult> {
        logger.info('Ready to delete  entity with id:  on repository:', id);
        const result = await this.repository.delete({ id });
        logger.info('Entity deleted with id:  on repository:', result);
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
      .registerClient(OrganizationNodeAttributeRepository.name)
      .get(OrganizationNodeAttributeRepository.name),
    })
    @Cacheable({ key: (args) => generateCacheKey<string[]>('deleteOrganizationNodeAttributes',args[0]), ttl: 60 })
    async bulkDelete(ids: string[]): Promise<DeleteResult> {
        logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
        const result = await this.repository.delete(ids);
        logger.info('Already deleted '+ids.length+' entities on repository:', result);
        return result;
    }
  }
  
