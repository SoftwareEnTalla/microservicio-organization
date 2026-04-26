-- ====================================================================
-- headcount_override_mode_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "headcount_override_mode_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('MANUAL_WINS', 'Manual Wins', '', '{}'::jsonb, 'system', TRUE, 'headcountoverridemode'),
  ('HRMS_WINS', 'Hrms Wins', '', '{}'::jsonb, 'system', TRUE, 'headcountoverridemode'),
  ('LATEST_WRITE', 'Latest Write', '', '{}'::jsonb, 'system', TRUE, 'headcountoverridemode')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
