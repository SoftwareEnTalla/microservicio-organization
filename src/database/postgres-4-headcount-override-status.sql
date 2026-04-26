-- ====================================================================
-- headcount_override_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "headcount_override_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('ACTIVE', 'Active', '', '{}'::jsonb, 'system', TRUE, 'headcountoverridestatus'),
  ('RELEASED', 'Released', '', '{}'::jsonb, 'system', TRUE, 'headcountoverridestatus'),
  ('SUPERSEDED', 'Superseded', '', '{}'::jsonb, 'system', TRUE, 'headcountoverridestatus'),
  ('EXPIRED', 'Expired', '', '{}'::jsonb, 'system', TRUE, 'headcountoverridestatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
