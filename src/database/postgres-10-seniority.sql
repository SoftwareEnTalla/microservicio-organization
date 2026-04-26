-- ====================================================================
-- seniority_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "seniority_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('JUNIOR', 'Junior', '', '{}'::jsonb, 'system', TRUE, 'seniority'),
  ('MID', 'Mid', '', '{}'::jsonb, 'system', TRUE, 'seniority'),
  ('SENIOR', 'Senior', '', '{}'::jsonb, 'system', TRUE, 'seniority'),
  ('LEAD', 'Lead', '', '{}'::jsonb, 'system', TRUE, 'seniority'),
  ('PRINCIPAL', 'Principal', '', '{}'::jsonb, 'system', TRUE, 'seniority')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
