-- ====================================================================
-- node_assignment_action_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "node_assignment_action_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('ASSIGNED', 'Assigned', '', '{}'::jsonb, 'system', TRUE, 'nodeassignmentaction'),
  ('TRANSFERRED_IN', 'Transferred In', '', '{}'::jsonb, 'system', TRUE, 'nodeassignmentaction'),
  ('TRANSFERRED_OUT', 'Transferred Out', '', '{}'::jsonb, 'system', TRUE, 'nodeassignmentaction'),
  ('REMOVED', 'Removed', '', '{}'::jsonb, 'system', TRUE, 'nodeassignmentaction'),
  ('TERMINATED', 'Terminated', '', '{}'::jsonb, 'system', TRUE, 'nodeassignmentaction')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
