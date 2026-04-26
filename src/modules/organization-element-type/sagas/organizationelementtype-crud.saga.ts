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


import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  OrganizationElementTypeCreatedEvent,
  OrganizationElementTypeUpdatedEvent,
  OrganizationElementTypeDeletedEvent,

} from '../events/exporting.event';
import {
  SagaOrganizationElementTypeFailedEvent
} from '../events/organizationelementtype-failed.event';
import {
  CreateOrganizationElementTypeCommand,
  UpdateOrganizationElementTypeCommand,
  DeleteOrganizationElementTypeCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class OrganizationElementTypeCrudSaga {
  private readonly logger = new Logger(OrganizationElementTypeCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onOrganizationElementTypeCreated = ($events: Observable<OrganizationElementTypeCreatedEvent>) => {
    return $events.pipe(
      ofType(OrganizationElementTypeCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de OrganizationElementType: ${event.aggregateId}`);
        void this.handleOrganizationElementTypeCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onOrganizationElementTypeUpdated = ($events: Observable<OrganizationElementTypeUpdatedEvent>) => {
    return $events.pipe(
      ofType(OrganizationElementTypeUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de OrganizationElementType: ${event.aggregateId}`);
        void this.handleOrganizationElementTypeUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onOrganizationElementTypeDeleted = ($events: Observable<OrganizationElementTypeDeletedEvent>) => {
    return $events.pipe(
      ofType(OrganizationElementTypeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de OrganizationElementType: ${event.aggregateId}`);
        void this.handleOrganizationElementTypeDeleted(event);
      }),
      map(() => null)
    );
  };


  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(OrganizationElementTypeCrudSaga.name)
      .get(OrganizationElementTypeCrudSaga.name),
  })
  private async handleOrganizationElementTypeCreated(event: OrganizationElementTypeCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga OrganizationElementType Created completada: ${event.aggregateId}`);
      // Lógica post-creación (ej: enviar notificación, ejecutar comandos adicionales)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(OrganizationElementTypeCrudSaga.name)
      .get(OrganizationElementTypeCrudSaga.name),
  })
  private async handleOrganizationElementTypeUpdated(event: OrganizationElementTypeUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga OrganizationElementType Updated completada: ${event.aggregateId}`);
      // Lógica post-actualización (ej: actualizar caché)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(OrganizationElementTypeCrudSaga.name)
      .get(OrganizationElementTypeCrudSaga.name),
  })
  private async handleOrganizationElementTypeDeleted(event: OrganizationElementTypeDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga OrganizationElementType Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaOrganizationElementTypeFailedEvent( error,event));
  }
}
