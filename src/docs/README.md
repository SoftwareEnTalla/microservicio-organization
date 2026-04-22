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
