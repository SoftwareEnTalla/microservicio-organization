-- ════════════════════════════════════════════════════════════════════
-- organization_capacity_history_base_entity
-- Snapshot histórico agregado de capacidad/cobertura organizacional.
-- Idempotente: se ejecuta en cada arranque del microservicio.
-- ════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS "organization_capacity_history_base_entity" (
  "id"                         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "creationDate"               timestamp NOT NULL DEFAULT NOW(),
  "modificationDate"           timestamp NOT NULL DEFAULT NOW(),
  "createdBy"                  varchar(100) NOT NULL DEFAULT 'organization-capacity-history',
  "isActive"                   boolean NOT NULL DEFAULT TRUE,
  "name"                       varchar(255) NOT NULL,
  "description"                varchar(500),
  "snapshotAt"                 timestamp NOT NULL DEFAULT NOW(),
  "source"                     varchar(80) NOT NULL DEFAULT 'AUTO_SUMMARY',
  "metricHash"                 varchar(64) NOT NULL,
  "nodesCount"                 integer NOT NULL DEFAULT 0,
  "rootNodeCount"              integer NOT NULL DEFAULT 0,
  "leafNodeCount"              integer NOT NULL DEFAULT 0,
  "maxDepth"                   integer NOT NULL DEFAULT 0,
  "targetHeadcount"            integer NOT NULL DEFAULT 0,
  "actualHeadcount"            integer NOT NULL DEFAULT 0,
  "nodesWithGapCount"          integer NOT NULL DEFAULT 0,
  "overAssignmentEnabledCount" integer NOT NULL DEFAULT 0,
  "plannedSeatRowsCount"       integer NOT NULL DEFAULT 0,
  "plannedSeatsCount"          integer NOT NULL DEFAULT 0,
  "filledSeatsCount"           integer NOT NULL DEFAULT 0,
  "criticalSeatsCount"         integer NOT NULL DEFAULT 0,
  "seatGap"                    integer NOT NULL DEFAULT 0,
  "seatCoveragePercent"        integer NOT NULL DEFAULT 0,
  "overrideCount"              integer NOT NULL DEFAULT 0,
  "metadata"                   jsonb
);
CREATE INDEX IF NOT EXISTS "idx_org_capacity_history_snapshot_at"
  ON "organization_capacity_history_base_entity" ("snapshotAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_org_capacity_history_metric_hash"
  ON "organization_capacity_history_base_entity" ("metricHash");