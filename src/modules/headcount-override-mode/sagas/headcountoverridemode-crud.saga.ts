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
  HeadcountOverrideModeCreatedEvent,
  HeadcountOverrideModeUpdatedEvent,
  HeadcountOverrideModeDeletedEvent,

} from '../events/exporting.event';
import {
  SagaHeadcountOverrideModeFailedEvent
} from '../events/headcountoverridemode-failed.event';
import {
  CreateHeadcountOverrideModeCommand,
  UpdateHeadcountOverrideModeCommand,
  DeleteHeadcountOverrideModeCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class HeadcountOverrideModeCrudSaga {
  private readonly logger = new Logger(HeadcountOverrideModeCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onHeadcountOverrideModeCreated = ($events: Observable<HeadcountOverrideModeCreatedEvent>) => {
    return $events.pipe(
      ofType(HeadcountOverrideModeCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de HeadcountOverrideMode: ${event.aggregateId}`);
        void this.handleHeadcountOverrideModeCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onHeadcountOverrideModeUpdated = ($events: Observable<HeadcountOverrideModeUpdatedEvent>) => {
    return $events.pipe(
      ofType(HeadcountOverrideModeUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de HeadcountOverrideMode: ${event.aggregateId}`);
        void this.handleHeadcountOverrideModeUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onHeadcountOverrideModeDeleted = ($events: Observable<HeadcountOverrideModeDeletedEvent>) => {
    return $events.pipe(
      ofType(HeadcountOverrideModeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de HeadcountOverrideMode: ${event.aggregateId}`);
        void this.handleHeadcountOverrideModeDeleted(event);
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
      .registerClient(HeadcountOverrideModeCrudSaga.name)
      .get(HeadcountOverrideModeCrudSaga.name),
  })
  private async handleHeadcountOverrideModeCreated(event: HeadcountOverrideModeCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga HeadcountOverrideMode Created completada: ${event.aggregateId}`);
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
      .registerClient(HeadcountOverrideModeCrudSaga.name)
      .get(HeadcountOverrideModeCrudSaga.name),
  })
  private async handleHeadcountOverrideModeUpdated(event: HeadcountOverrideModeUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga HeadcountOverrideMode Updated completada: ${event.aggregateId}`);
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
      .registerClient(HeadcountOverrideModeCrudSaga.name)
      .get(HeadcountOverrideModeCrudSaga.name),
  })
  private async handleHeadcountOverrideModeDeleted(event: HeadcountOverrideModeDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga HeadcountOverrideMode Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaHeadcountOverrideModeFailedEvent( error,event));
  }
}
