/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 *
 * NomencladorListenersModule — registra los listeners on<Nomenclador>Change
 * para todos los nomencladores referenciados por las entidades de este
 * microservicio. Se importa una sola vez desde app.module.ts.
 *
 * Generado por sources/scaffold_nomenclador_listeners.py — NO editar a mano.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { OnHeadcountOverrideModeChangeListener } from './on-headcount-override-mode-change.listener';
import { OnHeadcountOverrideStatusChangeListener } from './on-headcount-override-status-change.listener';
import { OnNodeAssignmentActionChangeListener } from './on-node-assignment-action-change.listener';
import { OnNodeTypeChangeListener } from './on-node-type-change.listener';
import { OnOrganizationNodeStatusChangeListener } from './on-organization-node-status-change.listener';
import { OnOrganizationStatusChangeListener } from './on-organization-status-change.listener';
import { OnOrganizationTypeChangeListener } from './on-organization-type-change.listener';
import { OnSeniorityChangeListener } from './on-seniority-change.listener';
import { OnVacancyStatusChangeListener } from './on-vacancy-status-change.listener';

@Module({
  imports: [ConfigModule, CqrsModule],
  providers: [
    OnHeadcountOverrideModeChangeListener,
    OnHeadcountOverrideStatusChangeListener,
    OnNodeAssignmentActionChangeListener,
    OnNodeTypeChangeListener,
    OnOrganizationNodeStatusChangeListener,
    OnOrganizationStatusChangeListener,
    OnOrganizationTypeChangeListener,
    OnSeniorityChangeListener,
    OnVacancyStatusChangeListener,
  ],
  exports: [
    OnHeadcountOverrideModeChangeListener,
    OnHeadcountOverrideStatusChangeListener,
    OnNodeAssignmentActionChangeListener,
    OnNodeTypeChangeListener,
    OnOrganizationNodeStatusChangeListener,
    OnOrganizationStatusChangeListener,
    OnOrganizationTypeChangeListener,
    OnSeniorityChangeListener,
    OnVacancyStatusChangeListener,
  ],
})
export class NomencladorListenersModule {}
