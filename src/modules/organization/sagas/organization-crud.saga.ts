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
  OrganizationCreatedEvent,
  OrganizationUpdatedEvent,
  OrganizationDeletedEvent,
  OrganizationRootCreatedEvent,
  OrganizationArchivedEvent,
} from '../events/exporting.event';
import {
  SagaOrganizationFailedEvent
} from '../events/organization-failed.event';
import {
  CreateOrganizationCommand,
  UpdateOrganizationCommand,
  DeleteOrganizationCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class OrganizationCrudSaga {
  private readonly logger = new Logger(OrganizationCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onOrganizationCreated = ($events: Observable<OrganizationCreatedEvent>) => {
    return $events.pipe(
      ofType(OrganizationCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Organization: ${event.aggregateId}`);
        void this.handleOrganizationCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onOrganizationUpdated = ($events: Observable<OrganizationUpdatedEvent>) => {
    return $events.pipe(
      ofType(OrganizationUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Organization: ${event.aggregateId}`);
        void this.handleOrganizationUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onOrganizationDeleted = ($events: Observable<OrganizationDeletedEvent>) => {
    return $events.pipe(
      ofType(OrganizationDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Organization: ${event.aggregateId}`);
        void this.handleOrganizationDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onOrganizationRootCreated = ($events: Observable<OrganizationRootCreatedEvent>) => {
    return $events.pipe(
      ofType(OrganizationRootCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio OrganizationRootCreated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onOrganizationArchived = ($events: Observable<OrganizationArchivedEvent>) => {
    return $events.pipe(
      ofType(OrganizationArchivedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio OrganizationArchived: ${event.aggregateId}`);
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
      .registerClient(OrganizationCrudSaga.name)
      .get(OrganizationCrudSaga.name),
  })
  private async handleOrganizationCreated(event: OrganizationCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Organization Created completada: ${event.aggregateId}`);
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
      .registerClient(OrganizationCrudSaga.name)
      .get(OrganizationCrudSaga.name),
  })
  private async handleOrganizationUpdated(event: OrganizationUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Organization Updated completada: ${event.aggregateId}`);
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
      .registerClient(OrganizationCrudSaga.name)
      .get(OrganizationCrudSaga.name),
  })
  private async handleOrganizationDeleted(event: OrganizationDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Organization Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaOrganizationFailedEvent( error,event));
  }
}
