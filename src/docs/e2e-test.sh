#!/usr/bin/env bash
# E2E tests para organization-service (puerto 3018 por defecto).
# Valida HU1-HU10 + integración Kafka con hrms-service.
#
# Uso:
#   ./e2e-test.sh                       # default http://localhost:3018
#   ./e2e-test.sh http://host:puerto
#   BEARER_TOKEN=xyz ./e2e-test.sh
#   HRMS_BASE=http://localhost:3017 ./e2e-test.sh

set -euo pipefail

BASE="${1:-${ORGANIZATION_BASE:-http://localhost:3018}}"
HRMS_BASE="${HRMS_BASE:-http://localhost:3017}"
AUTH_HEADER=()
if [[ -n "${BEARER_TOKEN:-}" ]]; then
  AUTH_HEADER=(-H "Authorization: Bearer ${BEARER_TOKEN}")
fi

PASS=0
FAIL=0
CURRENT=""

pass() { PASS=$((PASS+1)); echo "  ✓ $1"; }
fail() { FAIL=$((FAIL+1)); echo "  ✗ $1"; }
step() { CURRENT="$1"; echo ""; echo "━━━ ${CURRENT} ━━━"; }

req() {
  local method="$1"; local path="$2"; local body="${3:-}"
  local args=(-sS -X "$method" "${AUTH_HEADER[@]}" -H "Content-Type: application/json" -o /tmp/org_resp.json -w "%{http_code}")
  if [[ -n "$body" ]]; then
    echo "$body" | curl "${args[@]}" --data @- "${BASE}${path}"
  else
    curl "${args[@]}" "${BASE}${path}"
  fi
}

expect_status() {
  local want="$1"; local got="$2"; local label="$3"
  if [[ "$got" == "$want" ]]; then pass "$label (HTTP $got)"; else fail "$label (esperado $want, got $got)"; cat /tmp/org_resp.json; fi
}

summary() {
  echo ""
  echo "═════════════════════════════════════════"
  echo " Resumen E2E organization-service"
  echo "   Pass: ${PASS}"
  echo "   Fail: ${FAIL}"
  echo "═════════════════════════════════════════"
  [[ "$FAIL" -eq 0 ]] || exit 1
}

# ─────────────────────────────────────────────────────────────
step "PASO 1 — Health"
code=$(req GET /health)
expect_status 200 "$code" "GET /health"

# ─────────────────────────────────────────────────────────────
step "PASO 2 — HU1 Crear organización raíz"
ORG_CODE="ACME-$(date +%s)"
body=$(cat <<JSON
{"organizationCode":"${ORG_CODE}","name":"Acme Corp","organizationType":"COMPANY","country":"ES","status":"ACTIVE"}
JSON
)
code=$(req POST /api/organization "$body")
expect_status 201 "$code" "POST /api/organization"
ORG_ID=$(jq -r '.data.id // .id' /tmp/org_resp.json 2>/dev/null || echo "")
[[ -n "$ORG_ID" && "$ORG_ID" != "null" ]] && pass "organization.id=$ORG_ID" || fail "no se obtuvo organization.id"

# ─────────────────────────────────────────────────────────────
step "PASO 3 — HU2 Crear nodo raíz COMPANY"
ROOT_CODE="${ORG_CODE}-ROOT"
body=$(cat <<JSON
{"organizationId":"${ORG_ID}","nodeCode":"${ROOT_CODE}","name":"Acme Corp (root)","nodeType":"ROOT_ORG","path":"${ROOT_CODE}","depth":0,"targetHeadcount":100,"actualHeadcount":0}
JSON
)
code=$(req POST /api/organization-node "$body")
expect_status 201 "$code" "POST /api/organization-node (root)"
ROOT_ID=$(jq -r '.data.id // .id' /tmp/org_resp.json)

# ─────────────────────────────────────────────────────────────
step "PASO 4 — HU2 Agregar división y departamento"
DIV_CODE="${ORG_CODE}-ENG"
body=$(cat <<JSON
{"organizationId":"${ORG_ID}","nodeCode":"${DIV_CODE}","parentId":"${ROOT_ID}","name":"Engineering","nodeType":"DIVISION","path":"${ROOT_CODE}.${DIV_CODE}","depth":1,"targetHeadcount":40,"actualHeadcount":0}
JSON
)
code=$(req POST /api/organization-node "$body")
expect_status 201 "$code" "POST /api/organization-node (DIVISION)"
DIV_ID=$(jq -r '.data.id // .id' /tmp/org_resp.json)

DEP_CODE="${ORG_CODE}-ENG-FE"
body=$(cat <<JSON
{"organizationId":"${ORG_ID}","nodeCode":"${DEP_CODE}","parentId":"${DIV_ID}","name":"Frontend","nodeType":"DEPARTMENT","path":"${ROOT_CODE}.${DIV_CODE}.${DEP_CODE}","depth":2,"targetHeadcount":10,"actualHeadcount":0}
JSON
)
code=$(req POST /api/organization-node "$body")
expect_status 201 "$code" "POST /api/organization-node (DEPARTMENT)"
DEP_ID=$(jq -r '.data.id // .id' /tmp/org_resp.json)

# ─────────────────────────────────────────────────────────────
step "PASO 5 — HU3 Editar nodo"
body='{"description":"Frontend squad","targetHeadcount":12}'
code=$(req PATCH "/api/organization-node/${DEP_ID}" "$body")
[[ "$code" =~ ^(200|204)$ ]] && pass "PATCH /api/organization-node/:id" || fail "PATCH devolvió $code"

# ─────────────────────────────────────────────────────────────
step "PASO 6 — HU4 Definir target y planned-seats"
body="{\"targetHeadcount\":12}"
code=$(req PUT "/api/organization-node/${DEP_ID}/target-headcount" "$body")
[[ "$code" =~ ^(200|204)$ ]] && pass "PUT target-headcount" || fail "target-headcount devolvió $code"

body=$(cat <<JSON
{"nodeId":"${DEP_ID}","jobTitleCode":"FE_DEV","roleCode":"DEVELOPER","count":8,"seniority":"MID","isCritical":true}
JSON
)
code=$(req POST /api/planned-seat "$body")
expect_status 201 "$code" "POST /api/planned-seat"

# ─────────────────────────────────────────────────────────────
step "PASO 7 — HU5 Simular evento HRMS (employee-assigned-to-org-node)"
EMP_ID="$(uuidgen | tr '[:upper:]' '[:lower:]')"
body=$(cat <<JSON
{"nodeId":"${DEP_ID}","employeeId":"${EMP_ID}","employeeNumber":"E-0001","action":"ASSIGNED","jobTitleCode":"FE_DEV","roleCode":"DEVELOPER","occurredAt":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","sourceEventId":"hrms-evt-$(date +%s)-1","sourceTopic":"hrms.employee-assigned-to-org-node"}
JSON
)
code=$(req POST /api/node-assignment "$body")
expect_status 201 "$code" "POST /api/node-assignment (simula consumer Kafka)"

# ─────────────────────────────────────────────────────────────
step "PASO 8 — HU6 Consultar árbol completo"
code=$(req GET "/api/organization/${ORG_ID}/tree?depth=5")
expect_status 200 "$code" "GET /api/organization/:id/tree"
jq '.data // .' /tmp/org_resp.json | head -30

# ─────────────────────────────────────────────────────────────
step "PASO 9 — HU7 Override manual actualHeadcount"
body=$(cat <<JSON
{"nodeId":"${DEP_ID}","previousValue":1,"newValue":5,"mode":"MANUAL_WINS","reason":"Carga inicial offline desde RRHH histórico","appliedBy":"${EMP_ID}","appliedAt":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","status":"ACTIVE"}
JSON
)
code=$(req POST /api/headcount-override "$body")
expect_status 201 "$code" "POST /api/headcount-override"

# ─────────────────────────────────────────────────────────────
step "PASO 10 — HU8 Endpoint capacity (consumido por HRMS)"
code=$(req GET "/api/organization-node/${DEP_CODE}/capacity")
expect_status 200 "$code" "GET /api/organization-node/:nodeCode/capacity"
jq '.' /tmp/org_resp.json

# ─────────────────────────────────────────────────────────────
step "PASO 11 — HU9 Mover nodo"
NEW_DIV_CODE="${ORG_CODE}-PROD"
body=$(cat <<JSON
{"organizationId":"${ORG_ID}","nodeCode":"${NEW_DIV_CODE}","parentId":"${ROOT_ID}","name":"Product","nodeType":"DIVISION","path":"${ROOT_CODE}.${NEW_DIV_CODE}","depth":1,"targetHeadcount":20,"actualHeadcount":0}
JSON
)
code=$(req POST /api/organization-node "$body")
expect_status 201 "$code" "POST /api/organization-node (nuevo padre)"
NEW_DIV_ID=$(jq -r '.data.id // .id' /tmp/org_resp.json)

body="{\"newParentId\":\"${NEW_DIV_ID}\"}"
code=$(req POST "/api/organization-node/${DEP_CODE}/move" "$body")
[[ "$code" =~ ^(200|204)$ ]] && pass "POST move nodo a nuevo padre" || fail "move devolvió $code"

# ─────────────────────────────────────────────────────────────
step "PASO 12 — HU10 Agregados subárbol"
code=$(req GET "/api/organization-node/${ROOT_CODE}/aggregate")
expect_status 200 "$code" "GET /api/organization-node/:nodeCode/aggregate"
jq '.' /tmp/org_resp.json

# ─────────────────────────────────────────────────────────────
step "PASO 13 — HU3 Eliminar con reparent"
body="{\"cascadeMode\":\"REPARENT\",\"reparentTargetId\":\"${ROOT_ID}\"}"
code=$(req DELETE "/api/organization-node/${DEP_CODE}" "$body")
[[ "$code" =~ ^(200|204)$ ]] && pass "DELETE con REPARENT" || fail "DELETE devolvió $code"

# ─────────────────────────────────────────────────────────────
step "PASO 14 — Integración con hrms-service (opcional)"
if curl -sS -o /dev/null -w "%{http_code}" "${HRMS_BASE}/health" | grep -q 200; then
  echo "  HRMS disponible en ${HRMS_BASE}"
  code=$(curl -sS -o /tmp/org_resp.json -w "%{http_code}" "${AUTH_HEADER[@]}" "${HRMS_BASE}/api/employee?organizationUnitCode=${DEP_CODE}")
  [[ "$code" =~ ^(200|404)$ ]] && pass "Query HRMS por organizationUnitCode" || fail "HRMS devolvió $code"
else
  echo "  (HRMS no disponible — paso de integración cross-service omitido)"
fi

summary
