-- ====================================================================
-- organization_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "organization_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('ACTIVE', 'Active', '', '{}'::jsonb, 'system', TRUE, 'organizationstatus'),
  ('SUSPENDED', 'Suspended', '', '{}'::jsonb, 'system', TRUE, 'organizationstatus'),
  ('ARCHIVED', 'Archived', '', '{}'::jsonb, 'system', TRUE, 'organizationstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
