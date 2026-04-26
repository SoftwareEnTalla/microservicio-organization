-- ====================================================================
-- node_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "node_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('ROOT_ORG', 'Root Org', '', '{}'::jsonb, 'system', TRUE, 'nodetype'),
  ('DIVISION', 'Division', '', '{}'::jsonb, 'system', TRUE, 'nodetype'),
  ('AREA', 'Area', '', '{}'::jsonb, 'system', TRUE, 'nodetype'),
  ('DEPARTMENT', 'Department', '', '{}'::jsonb, 'system', TRUE, 'nodetype'),
  ('UNIT', 'Unit', '', '{}'::jsonb, 'system', TRUE, 'nodetype'),
  ('TEAM', 'Team', '', '{}'::jsonb, 'system', TRUE, 'nodetype'),
  ('COST_CENTER', 'Cost Center', '', '{}'::jsonb, 'system', TRUE, 'nodetype'),
  ('EXTERNAL', 'External', '', '{}'::jsonb, 'system', TRUE, 'nodetype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
