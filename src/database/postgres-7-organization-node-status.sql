-- ====================================================================
-- organization_node_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "organization_node_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('ACTIVE', 'Active', '', '{}'::jsonb, 'system', TRUE, 'organizationnodestatus'),
  ('ARCHIVED', 'Archived', '', '{}'::jsonb, 'system', TRUE, 'organizationnodestatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
