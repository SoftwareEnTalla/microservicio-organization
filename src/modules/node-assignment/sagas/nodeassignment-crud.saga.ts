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
  NodeAssignmentCreatedEvent,
  NodeAssignmentUpdatedEvent,
  NodeAssignmentDeletedEvent,
  NodeAssignmentRecordedEvent,
} from '../events/exporting.event';
import {
  SagaNodeAssignmentFailedEvent
} from '../events/nodeassignment-failed.event';
import {
  CreateNodeAssignmentCommand,
  UpdateNodeAssignmentCommand,
  DeleteNodeAssignmentCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class NodeAssignmentCrudSaga {
  private readonly logger = new Logger(NodeAssignmentCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onNodeAssignmentCreated = ($events: Observable<NodeAssignmentCreatedEvent>) => {
    return $events.pipe(
      ofType(NodeAssignmentCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de NodeAssignment: ${event.aggregateId}`);
        void this.handleNodeAssignmentCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onNodeAssignmentUpdated = ($events: Observable<NodeAssignmentUpdatedEvent>) => {
    return $events.pipe(
      ofType(NodeAssignmentUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de NodeAssignment: ${event.aggregateId}`);
        void this.handleNodeAssignmentUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onNodeAssignmentDeleted = ($events: Observable<NodeAssignmentDeletedEvent>) => {
    return $events.pipe(
      ofType(NodeAssignmentDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de NodeAssignment: ${event.aggregateId}`);
        void this.handleNodeAssignmentDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onNodeAssignmentRecorded = ($events: Observable<NodeAssignmentRecordedEvent>) => {
    return $events.pipe(
      ofType(NodeAssignmentRecordedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio NodeAssignmentRecorded: ${event.aggregateId}`);
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
      .registerClient(NodeAssignmentCrudSaga.name)
      .get(NodeAssignmentCrudSaga.name),
  })
  private async handleNodeAssignmentCreated(event: NodeAssignmentCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga NodeAssignment Created completada: ${event.aggregateId}`);
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
      .registerClient(NodeAssignmentCrudSaga.name)
      .get(NodeAssignmentCrudSaga.name),
  })
  private async handleNodeAssignmentUpdated(event: NodeAssignmentUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga NodeAssignment Updated completada: ${event.aggregateId}`);
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
      .registerClient(NodeAssignmentCrudSaga.name)
      .get(NodeAssignmentCrudSaga.name),
  })
  private async handleNodeAssignmentDeleted(event: NodeAssignmentDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga NodeAssignment Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaNodeAssignmentFailedEvent( error,event));
  }
}
