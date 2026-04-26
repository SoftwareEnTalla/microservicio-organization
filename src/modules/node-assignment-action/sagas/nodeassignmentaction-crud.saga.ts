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
  NodeAssignmentActionCreatedEvent,
  NodeAssignmentActionUpdatedEvent,
  NodeAssignmentActionDeletedEvent,

} from '../events/exporting.event';
import {
  SagaNodeAssignmentActionFailedEvent
} from '../events/nodeassignmentaction-failed.event';
import {
  CreateNodeAssignmentActionCommand,
  UpdateNodeAssignmentActionCommand,
  DeleteNodeAssignmentActionCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class NodeAssignmentActionCrudSaga {
  private readonly logger = new Logger(NodeAssignmentActionCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onNodeAssignmentActionCreated = ($events: Observable<NodeAssignmentActionCreatedEvent>) => {
    return $events.pipe(
      ofType(NodeAssignmentActionCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de NodeAssignmentAction: ${event.aggregateId}`);
        void this.handleNodeAssignmentActionCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onNodeAssignmentActionUpdated = ($events: Observable<NodeAssignmentActionUpdatedEvent>) => {
    return $events.pipe(
      ofType(NodeAssignmentActionUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de NodeAssignmentAction: ${event.aggregateId}`);
        void this.handleNodeAssignmentActionUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onNodeAssignmentActionDeleted = ($events: Observable<NodeAssignmentActionDeletedEvent>) => {
    return $events.pipe(
      ofType(NodeAssignmentActionDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de NodeAssignmentAction: ${event.aggregateId}`);
        void this.handleNodeAssignmentActionDeleted(event);
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
      .registerClient(NodeAssignmentActionCrudSaga.name)
      .get(NodeAssignmentActionCrudSaga.name),
  })
  private async handleNodeAssignmentActionCreated(event: NodeAssignmentActionCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga NodeAssignmentAction Created completada: ${event.aggregateId}`);
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
      .registerClient(NodeAssignmentActionCrudSaga.name)
      .get(NodeAssignmentActionCrudSaga.name),
  })
  private async handleNodeAssignmentActionUpdated(event: NodeAssignmentActionUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga NodeAssignmentAction Updated completada: ${event.aggregateId}`);
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
      .registerClient(NodeAssignmentActionCrudSaga.name)
      .get(NodeAssignmentActionCrudSaga.name),
  })
  private async handleNodeAssignmentActionDeleted(event: NodeAssignmentActionDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga NodeAssignmentAction Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaNodeAssignmentActionFailedEvent( error,event));
  }
}
