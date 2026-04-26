-- ====================================================================
-- organization_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "organization_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('COMPANY', 'Company', '', '{}'::jsonb, 'system', TRUE, 'organizationtype'),
  ('SME', 'Sme', '', '{}'::jsonb, 'system', TRUE, 'organizationtype'),
  ('ENTITY', 'Entity', '', '{}'::jsonb, 'system', TRUE, 'organizationtype'),
  ('NGO', 'Ngo', '', '{}'::jsonb, 'system', TRUE, 'organizationtype'),
  ('PUBLIC_BODY', 'Public Body', '', '{}'::jsonb, 'system', TRUE, 'organizationtype'),
  ('HOLDING', 'Holding', '', '{}'::jsonb, 'system', TRUE, 'organizationtype'),
  ('OTHER', 'Other', '', '{}'::jsonb, 'system', TRUE, 'organizationtype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
