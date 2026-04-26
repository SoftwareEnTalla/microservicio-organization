-- ====================================================================
-- vacancy_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "vacancy_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('OPEN', 'Open', '', '{}'::jsonb, 'system', TRUE, 'vacancystatus'),
  ('PARTIALLY_FILLED', 'Partially Filled', '', '{}'::jsonb, 'system', TRUE, 'vacancystatus'),
  ('FILLED', 'Filled', '', '{}'::jsonb, 'system', TRUE, 'vacancystatus'),
  ('OVER_ASSIGNED', 'Over Assigned', '', '{}'::jsonb, 'system', TRUE, 'vacancystatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
