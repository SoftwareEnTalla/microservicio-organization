-- ════════════════════════════════════════════════════════════════════
-- organization_element_type_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "organization_element_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('DIVISION', 'División', 'Nivel divisional', jsonb_build_object('description','Nivel divisional'), 'system', TRUE, 'organizationelementtype'),
  ('AREA', 'Área', 'Área funcional', jsonb_build_object('description','Área funcional'), 'system', TRUE, 'organizationelementtype'),
  ('DEPARTMENT', 'Departamento', 'Departamento', jsonb_build_object('description','Departamento'), 'system', TRUE, 'organizationelementtype'),
  ('UNIT', 'Unidad', 'Unidad operativa', jsonb_build_object('description','Unidad operativa'), 'system', TRUE, 'organizationelementtype'),
  ('TEAM', 'Equipo', 'Equipo de trabajo', jsonb_build_object('description','Equipo de trabajo'), 'system', TRUE, 'organizationelementtype'),
  ('COST_CENTER', 'Centro de coste', 'Centro de coste contable', jsonb_build_object('description','Centro de coste contable'), 'system', TRUE, 'organizationelementtype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
