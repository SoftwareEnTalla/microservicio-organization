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
  OrganizationNodeAttributeCreatedEvent,
  OrganizationNodeAttributeUpdatedEvent,
  OrganizationNodeAttributeDeletedEvent,
  NodeAttributeUpsertedEvent,
  NodeAttributeDeletedEvent,
} from '../events/exporting.event';
import {
  SagaOrganizationNodeAttributeFailedEvent
} from '../events/organizationnodeattribute-failed.event';
import {
  CreateOrganizationNodeAttributeCommand,
  UpdateOrganizationNodeAttributeCommand,
  DeleteOrganizationNodeAttributeCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class OrganizationNodeAttributeCrudSaga {
  private readonly logger = new Logger(OrganizationNodeAttributeCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onOrganizationNodeAttributeCreated = ($events: Observable<OrganizationNodeAttributeCreatedEvent>) => {
    return $events.pipe(
      ofType(OrganizationNodeAttributeCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de OrganizationNodeAttribute: ${event.aggregateId}`);
        void this.handleOrganizationNodeAttributeCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onOrganizationNodeAttributeUpdated = ($events: Observable<OrganizationNodeAttributeUpdatedEvent>) => {
    return $events.pipe(
      ofType(OrganizationNodeAttributeUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de OrganizationNodeAttribute: ${event.aggregateId}`);
        void this.handleOrganizationNodeAttributeUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onOrganizationNodeAttributeDeleted = ($events: Observable<OrganizationNodeAttributeDeletedEvent>) => {
    return $events.pipe(
      ofType(OrganizationNodeAttributeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de OrganizationNodeAttribute: ${event.aggregateId}`);
        void this.handleOrganizationNodeAttributeDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onNodeAttributeUpserted = ($events: Observable<NodeAttributeUpsertedEvent>) => {
    return $events.pipe(
      ofType(NodeAttributeUpsertedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio NodeAttributeUpserted: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onNodeAttributeDeleted = ($events: Observable<NodeAttributeDeletedEvent>) => {
    return $events.pipe(
      ofType(NodeAttributeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio NodeAttributeDeleted: ${event.aggregateId}`);
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
      .registerClient(OrganizationNodeAttributeCrudSaga.name)
      .get(OrganizationNodeAttributeCrudSaga.name),
  })
  private async handleOrganizationNodeAttributeCreated(event: OrganizationNodeAttributeCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga OrganizationNodeAttribute Created completada: ${event.aggregateId}`);
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
      .registerClient(OrganizationNodeAttributeCrudSaga.name)
      .get(OrganizationNodeAttributeCrudSaga.name),
  })
  private async handleOrganizationNodeAttributeUpdated(event: OrganizationNodeAttributeUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga OrganizationNodeAttribute Updated completada: ${event.aggregateId}`);
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
      .registerClient(OrganizationNodeAttributeCrudSaga.name)
      .get(OrganizationNodeAttributeCrudSaga.name),
  })
  private async handleOrganizationNodeAttributeDeleted(event: OrganizationNodeAttributeDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga OrganizationNodeAttribute Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaOrganizationNodeAttributeFailedEvent( error,event));
  }
}
