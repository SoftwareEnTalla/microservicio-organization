# Organization Microservice — Documentación Completa

> **Versión**: 0.0.1
> **Puerto**: 3018
> **Base URL**: `http://localhost:3018/api`
> **Swagger UI**: `http://localhost:3018/api-docs` (user: `admin`, pass: `admin123`)

---

## Tabla de Contenidos

1. [Historia de Usuario](#1-historia-de-usuario)
2. [Modelo DSL](#2-modelo-dsl)
3. [Arquitectura](#3-arquitectura)
4. [Módulos del Microservicio](#4-módulos-del-microservicio)
5. [Eventos Publicados](#5-eventos-publicados)
6. [Eventos Consumidos](#6-eventos-consumidos)
7. [API REST — Guía Completa Swagger](#7-api-rest--guía-completa-swagger)
8. [Guía para Desarrolladores](#8-guía-para-desarrolladores)
9. [Test E2E con curl](#9-test-e2e-con-curl)
10. [Análisis de Sagas y Eventos (E2E)](#10-análisis-de-sagas-y-eventos-e2e)

---

## 1. Historia de Usuario

### Bounded Context: Organization

El microservicio **organization** modela el **árbol organizacional** de la empresa (raíz, nodos jerárquicos), la **planeación de plazas** (`PlannedSeat`), overrides de headcount, asignaciones de personas a nodos y atributos dinámicos por nodo. Consume eventos de hrms-service para mantener el contador `actualHeadcount` y el inventario de asignaciones.

### Historias de Usuario Implementadas

| ID | Título | Módulo(s) |
|----|--------|-----------|
| UH-1 | Raíz organizacional y árbol jerárquico (crear/actualizar/eliminar/mover nodos) | organization, organization-node |
| UH-2 | Planeación de plazas (`PlannedSeat`) y targets | planned-seat |
| UH-3 | Overrides de headcount con vigencia | headcount-override |
| UH-4 | Asignación de empleados a nodos (ingestada desde hrms) | node-assignment |
| UH-5 | Atributos dinámicos de nodo | organization-node-attribute |
| UH-6 | Refresco agregado de nodo (recalcular contadores) | organization-node (aggregate-refreshed) |
| UH-7 | Trazabilidad sync catalog | catalog-sync-log |

---

## 2. Modelo DSL

Los modelos están en `models/organization/`.

| Modelo XML | Versión | AggregateRoot | ModuleType |
|------------|---------|:---:|---|
| `organization.xml` | 1.0.0 | ✓ | aggregate-root |
| `organization-node.xml` | 1.0.0 | ✗ | entity |
| `planned-seat.xml` | 1.0.0 | ✗ | entity |
| `headcount-override.xml` | 1.0.0 | ✗ | entity |
| `node-assignment.xml` | 1.0.0 | ✗ | projection |
| `organization-node-attribute.xml` | 1.0.0 | ✗ | entity |
| `catalog-sync-log.xml` | 1.0.0 | ✗ | entity |

---

## 3. Arquitectura

### 3.1 Patrones

| Patrón | Descripción |
|--------|-------------|
| **CQRS** | Command/query separados. |
| **Event Sourcing** | Eventos + EventStore + Kafka. |
| **Event-Driven** | Consume eventos `hrms.employee-*` para mantener proyección `node-assignment` + contadores. |
| **Saga Pattern** | Sagas CRUD + sagas de sync (org-sync) por evento cross-context. |
| **DDD** | Aggregate *Organization* / *OrganizationNode*; proyecciones. |

### 3.2 Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│            ORGANIZATION MICROSERVICE  (3018)               │
├────────────────────────────────────────────────────────────┤
│  REST Command / REST Query / GraphQL                       │
│   CommandBus / QueryBus / Resolvers                        │
│   Service ↔ Repository → PostgreSQL (organization-service) │
│  KafkaEventPublisher ─ EventStore ─ KafkaEventSubscriber   │
│   CatalogClient (breaker + cache)                          │
│                                                            │
│  Projection Sync:                                          │
│   ← hrms.employee-hired/assigned/removed/transferred/term  │
└────────────────────────────────────────────────────────────┘
```

### 3.3 Estructura de carpetas por módulo

```
src/modules/<module>/
├── commands/ controllers/ decorators/ dtos/ entities/
├── events/ graphql/ guards/ interceptors/ modules/
├── queries/ repositories/ sagas/ services/ shared/ types/
```

---

## 4. Módulos del Microservicio

| Módulo | Entidad | Campos clave |
|--------|---------|--------------|
| organization | `Organization` | code, name, rootNodeId, status |
| organization-node | `OrganizationNode` | organizationId, parentId, path, code, name, nodeType, targetHeadcount, actualHeadcount |
| planned-seat | `PlannedSeat` | nodeId, seatCode, role, status, plannedStart/End |
| headcount-override | `HeadcountOverride` | nodeId, delta, reason, validFrom/To, status |
| node-assignment | `NodeAssignment` | employeeId, nodeId, assignedAt, status (ACTIVE/ENDED) |
| organization-node-attribute | `OrganizationNodeAttribute` | nodeId, code, valueType, value |
| catalog-sync-log | `CatalogSyncLog` | categoryCode, triggeredBy, outcome |

---

## 5. Eventos Publicados

### 5.1 Eventos de dominio

| Módulo | Evento | Tópico Kafka | Replayable |
|--------|--------|--------------|:---:|
| organization | `OrganizationRootCreatedEvent` | `organization.organization-root-created` | ✓ |
| organization-node | `OrganizationNodeCreatedEvent` | `organization.organization-node-created` | ✓ |
| organization-node | `OrganizationNodeUpdatedEvent` | `organization.organization-node-updated` | ✓ |
| organization-node | `OrganizationNodeDeletedEvent` | `organization.organization-node-deleted` | ✓ |
| organization-node | `OrganizationNodeMovedEvent` | `organization.organization-node-moved` | ✓ |
| organization-node | `OrganizationNodeAggregateRefreshedEvent` | `organization.aggregate-refreshed` | ✓ |
| organization-node | `TargetHeadcountUpdatedEvent` | `organization.target-headcount-updated` | ✓ |
| organization-node | `ActualHeadcountUpdatedEvent` | `organization.actual-headcount-updated` | ✓ |
| headcount-override | `HeadcountOverrideAppliedEvent` | `organization.override-applied` | ✓ |
| headcount-override | `HeadcountOverrideReleasedEvent` | `organization.override-released` | ✓ |
| headcount-override | `HeadcountOverrideSupersededEvent` | `organization.override-superseded` | ✓ |
| headcount-override | `HeadcountOverrideExpiredEvent` | `organization.override-expired` | ✓ |
| planned-seat | `PlannedSeatCreatedEvent` | `organization.planned-seat-created` | ✓ |
| planned-seat | `PlannedSeatUpdatedEvent` | `organization.planned-seat-updated` | ✓ |
| planned-seat | `PlannedSeatDeletedEvent` | `organization.planned-seat-deleted` | ✓ |
| planned-seat | `SeatVacancyFilledEvent` | `organization.seat-vacancy-filled` | ✓ |
| planned-seat | `SeatVacancyOpenedEvent` | `organization.seat-vacancy-opened` | ✓ |
| planned-seat | `SeatOverassignedEvent` | `organization.seat-overassigned` | ✓ |
| node-assignment | `NodeAssignmentRecordedEvent` | `organization.node-assignment-recorded` | ✓ |
| organization-node-attribute | `NodeAttributeUpsertedEvent` | `organization.node-attribute-upserted` | ✓ |
| organization-node-attribute | `NodeAttributeDeletedEvent` | `organization.node-attribute-deleted` | ✓ |
| catalog-sync-log | `CatalogSyncCompletedEvent` | `organization.catalog-sync-completed` | ✗ |
| catalog-sync-log | `CatalogSyncFailedEvent` | `organization.catalog-sync-failed` | ✗ |

Eventos CRUD adicionales por módulo siguen convención `organization.<entidad>-created|updated|deleted`.

### Estructura de un evento publicado

```json
{
  "aggregateId": "uuid",
  "timestamp": "2026-04-21T10:00:00.000Z",
  "payload": {
    "instance": { /* entidad */ },
    "metadata": {
      "initiatedBy":"user-id","correlationId":"uuid",
      "eventName":"OrganizationNodeCreatedEvent","eventVersion":"1.0.0",
      "sourceService":"organization-service","retryCount":0,
      "idempotencyKey":"uuid"
    }
  }
}
```

---

## 6. Eventos Consumidos

| Módulo | Evento | Origen | Acción |
|--------|--------|--------|--------|
| node-assignment (saga) | `EmployeeHiredEvent` (`hrms.employee-hired`) | hrms-service | Registra assignment inicial + incrementa `actualHeadcount` |
| node-assignment (saga) | `EmployeeAssignedToOrgNodeEvent` (`hrms.employee-assigned-to-org-node`) | hrms-service | Alta de assignment en nodo destino |
| node-assignment (saga) | `EmployeeRemovedFromOrgNodeEvent` (`hrms.employee-removed-from-org-node`) | hrms-service | Baja de assignment |
| node-assignment (saga) | `EmployeeTransferredOrgNodeEvent` (`hrms.employee-transferred-org-node`) | hrms-service | Baja origen + alta destino + recompute |
| node-assignment (saga) | `EmployeeTerminatedEvent` (`hrms.employee-terminated`) | hrms-service | Baja + decremento headcount |
| catalog-client | `catalog.catalog-item-upserted` | catalog-service | Invalida caché + syncCategory |
| catalog-client | `catalog.catalog-item-deprecated` | catalog-service | Invalida caché + syncCategory |

`KAFKA_TRUSTED_PRODUCERS` filtra productores confiables; `EventIdempotencyService` deduplica.

---

## 7. API REST — Guía Completa Swagger

### 7.1 Command CRUD

| Método | Ruta | Body |
|--------|------|------|
| POST | `/api/<entities>/command` | `CreateXxxDto` |
| POST | `/api/<entities>/command/bulk` | `CreateXxxDto[]` |
| PUT | `/api/<entities>/command/:id` | `UpdateXxxDto` |
| PUT | `/api/<entities>/command/bulk` | `UpdateXxxDto[]` |
| DELETE | `/api/<entities>/command/:id` | — |
| DELETE | `/api/<entities>/command/bulk` | — |

### 7.2 Query CRUD

Mismo set canónico (list, :id, field/:field, pagination, count, search, find-one, find-one-or-fail).

### 7.3 Prefijos por módulo

| Módulo | Command | Query |
|--------|---------|-------|
| organization | `/api/organizations/command` | `/api/organizations/query` |
| organization-node | `/api/organizationnodes/command` | `/api/organizationnodes/query` |
| planned-seat | `/api/plannedseats/command` | `/api/plannedseats/query` |
| headcount-override | `/api/headcountoverrides/command` | `/api/headcountoverrides/query` |
| node-assignment | `/api/nodeassignments/command` | `/api/nodeassignments/query` |
| organization-node-attribute | `/api/organizationnodeattributes/command` | `/api/organizationnodeattributes/query` |
| catalog-sync-log | `/api/catalogsynclogs/command` | `/api/catalogsynclogs/query` |
| catalog-client | `/api/catalog-sync` | — |

### 7.4 DTOs principales

```json
// CreateOrganizationDto
{ "code":"ORG-001","name":"Acme Corp","status":"ACTIVE" }

// CreateOrganizationNodeDto
{ "organizationId":"UUID","parentId":"UUID","code":"DEPT-ENG",
  "name":"Engineering","nodeType":"DEPARTMENT","targetHeadcount":50 }

// CreatePlannedSeatDto
{ "nodeId":"UUID","seatCode":"SEAT-001","role":"SENIOR_ENG",
  "status":"OPEN","plannedStart":"2026-03-01" }
```

---

## 8. Guía para Desarrolladores

Mismo patrón canónico: dual publish + registro en `event-registry.ts` + saga `@Saga()` con `ofType`.

### 8.1 Saga de sync cross-context

```typescript
@Injectable()
export class NodeAssignmentFromHrmsSaga {
  @Saga()
  onEmployeeAssigned = ($e: Observable<EmployeeAssignedToOrgNodeEvent>) => $e.pipe(
    ofType(EmployeeAssignedToOrgNodeEvent),
    mergeMap(e => from(this.service.recordAssignment(e.payload.instance))),
    map(() => null),
  );
}
```

---

## 9. Test E2E con curl

```bash
cd organization-service && env LOG_API_AUTH_TOKEN=valid-token node dist/main.js
bash organization-service/src/docs/e2e-test.sh
```

| Paso | Descripción | Cobertura |
|------|-------------|-----------|
| 0 | Pre-flight health | Infra |
| 1 | Crear organization → `organization-root-created` | `organization` |
| 2 | Crear organization-node raíz + hijos → `organization-node-created` | `organization-node` |
| 3 | Update target-headcount → `target-headcount-updated` | Kafka produce |
| 4 | Move node → `organization-node-moved` | Kafka produce |
| 5 | Aggregate refresh → `aggregate-refreshed` | Kafka produce |
| 6 | Crear planned-seat → `planned-seat-created` + `seat-vacancy-opened` | `planned-seat` |
| 7 | Apply headcount-override → `override-applied` | `headcount-override` |
| 8 | Release override → `override-released` | Kafka produce |
| 9 | Upsert node-attribute → `node-attribute-upserted` | `organization-node-attribute` |
| 10 | Record node-assignment (caso directo) → `node-assignment-recorded` | `node-assignment` |
| 11 | `kcat -C` consume topic `hrms.employee-hired` (si hrms ↑: WARN si no) | Kafka subscribe cross-ms |
| 12 | Delete planned-seat + node | Kafka produce |
| 13 | Catalog-sync health + status + run → `catalog-sync-completed` | `catalog-client` |
| 14 | `kcat -L` verifica topics `organization.*` | Kafka probe |
| 15 | Limpieza | Todos |

---

## 10. Análisis de Sagas y Eventos (E2E)

### 10.1 Inventario de sagas

- `OrganizationCrudSaga`, `OrganizationNodeCrudSaga`, `PlannedSeatCrudSaga`, `HeadcountOverrideCrudSaga`, `NodeAssignmentCrudSaga`, `OrganizationNodeAttributeCrudSaga`, `CatalogSyncLogCrudSaga`.
- Sagas cross-context: `NodeAssignmentFromHrmsSaga` (5 handlers: hired, assigned, removed, transferred, terminated).

### 10.2 Totales

- **Eventos registrados**: ≈30 (dominio + CRUD + sync).
- **Topics Kafka**: main + retry + DLQ por cada evento.

### 10.3 Dual publish

Obligatorio para activar sagas `@Saga()` in-process.

---

## 11. Variables de Entorno

| Variable | Uso |
|----------|-----|
| `APP_NAME` / `STAGE` / `PORT` | 3018 |
| `DB_HOST/PORT/USERNAME/PASSWORD/NAME` | PostgreSQL (organization-service) |
| `JWT_SECRET` / `API_KEY` / `SA_EMAIL` / `SA_PWD` | Auth |
| `KAFKA_ENABLED` / `KAFKA_BROKERS` / `KAFKA_CLIENT_ID` / `KAFKA_GROUP_ID` | Kafka |
| `KAFKA_TRUSTED_PRODUCERS` | Filtrado productores (incluir `hrms-service`) |
| `EVENT_SOURCING_ENABLED` / `EVENT_STORE_ENABLED` | Event sourcing |
| `REDIS_HOST/PORT/TTL` | Redis cache |
| `CATALOG_BASE_URL` / `CATALOG_SYNC_INTERVAL_MS` | CatalogClient |
| `CATALOG_BREAKER_ERROR_THRESHOLD` / `CATALOG_BREAKER_RESET_MS` | Breaker |
| `SWAGGER_USER` / `SWAGGER_PWD` | Swagger basic auth |
| `LOG_API_BASE_URL` / `LOG_KAFKA_TOPIC` / `LOG_EXECUTION_TIME` | Codetrace |

---

## 12. Build & Run

```bash
cd organization-service
npm install && npm run build
node dist/main.js
# o docker-compose up organization-service
```

---

## 13. Integración con catalog-service

Documentación canónica de `CatalogClientModule`: [docs/README-catalog-integration.md](../../../docs/README-catalog-integration.md).
# organization-service

Microservicio NestJS que gestiona la **estructura organizativa** (empresas, PYMES, entidades, organizaciones y su árbol jerárquico interno) con capacidad planificada ("lleva") y real ("tiene"). Se integra con `hrms-service` vía Kafka para mantener sincronizada la plantilla real.

- **Puerto**: `3018`
- **Bounded context**: `organization`
- **Arquitectura**: NestJS 11 + CQRS + Event Sourcing + Kafka + Postgres + GraphQL
- **Generado desde**: `models/organization/*.xml` + `user-histories/organization/*.txt`

## Módulos de dominio

| Módulo | Agregado | Descripción |
|--------|----------|-------------|
| `organization` | Organization (root) | Organización raíz: empresa, SME, entity, NGO, public_body |
| `organization-node` | OrganizationNode (root) | Nodo del árbol organizativo (división, área, departamento, unidad, equipo, centro de costo) |
| `planned-seat` | PlannedSeat | Plazas planificadas por rol/jobTitle de un nodo |
| `headcount-override` | HeadcountOverride | Auditoría de sobrescrituras manuales de actualHeadcount |
| `node-assignment` | NodeAssignment | Log idempotente de asignaciones reportadas por HRMS |
| `organization-node-attribute` | OrganizationNodeAttribute | EAV para atributos extendidos del nodo |

## Roles de usuario

- `ORG_ADMINISTRATOR` – control total, aplica overrides manuales
- `ORG_PLANNER` – crea nodos y define `targetHeadcount`
- `ORG_VIEWER` – consulta árbol y agregados
- `HR_MANAGER` – consume capacidad vía endpoint HU8
- `EXTERNAL_AUDITOR` – lectura auditable

## Eventos publicados (Kafka)

- `organization.organization-root-created`
- `organization.organization-node-created|updated|moved|deleted`
- `organization.target-headcount-updated`
- `organization.actual-headcount-updated`
- `organization.override-applied|released|superseded|expired`
- `organization.planned-seat-created|updated|deleted`
- `organization.seat-vacancy-filled|seat-vacancy-opened|seat-overassigned`
- `organization.headcount-overflow-detected`
- `organization.aggregate-refreshed`
- `organization.node-assignment-recorded`

## Eventos consumidos (desde hrms-service)

- `hrms.employee-assigned-to-org-node` → incrementa `actualHeadcount`
- `hrms.employee-removed-from-org-node` → decrementa
- `hrms.employee-transferred-org-node` → saga origen/destino
- `hrms.employee-terminated` → decrementa
- `hrms.employee-hired` → incrementa si trae `organizationUnitCode`

## Endpoints REST clave

- `GET /api/organization-node/:nodeCode/capacity` – **HU8**. Expone `targetHeadcount`, `actualHeadcount`, `availableSlots`, `allowOverAssignment`. Cacheable con ETag 60s. Consumido por hrms-service antes de asignar empleados.
- `GET /api/organization/:id/tree?depth=N` – **HU6**. Árbol completo con `delta` y `coveragePct` por nodo.
- `GET /api/organization-node/:nodeCode/aggregate` – **HU10**. Agregados de subárbol (`subtreeTarget`, `subtreeActual`, `subtreeCoveragePct`, `nodesCount`, `leafNodesCount`).
- `POST /api/organization-node/:nodeCode/aggregate/refresh` – fuerza recálculo CQRS.
- `POST /api/organization-node/:nodeCode/move` – **HU9**. Mueve nodo a otro padre validando anti-ciclo.
- `POST /api/organization-node/:nodeCode/override` – **HU7**. Override manual auditado.

## Sagas de integración con HRMS

1. **Asignar empleado** – HRMS pregunta capacidad (HU8) → asigna → publica `employee-assigned-to-org-node` → Organization incrementa.
2. **Mover nodo** – Organization mueve → publica `organization-node-moved` → HRMS actualiza `employee.organizationUnitCode` de descendientes.
3. **Eliminar nodo con cascade** – Organization marca `ARCHIVED` → publica `organization-node-deleted` por cada descendiente → HRMS desasigna.
4. **Terminación** – HRMS publica `employee-terminated` → Organization decrementa.

## Consistencia e idempotencia
- `node-assignment.sourceEventId` es único para garantizar idempotencia ante reintentos Kafka.
- Proyecciones CQRS de árbol y agregados se pueden reconstruir con `POST /api/projections/replay`.
- `overrideMode` controla la convivencia entre overrides manuales y eventos HRMS (`MANUAL_WINS|HRMS_WINS|LATEST_WRITE`).

## E2E tests

Script de referencia en `src/docs/e2e-test.sh`. Ejecuta el flujo completo:

```bash
./src/docs/e2e-test.sh http://localhost:3018
```
