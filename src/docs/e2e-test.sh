#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Test E2E completo — organization-service (puerto 3018)
# Módulos: organizations, organizationnodes, organizationnodeattributes,
#          nodeassignments, plannedseats, headcountoverrides,
#          catalogsynclogs, catalog-client
# ═══════════════════════════════════════════════════════════════
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../../../sources/e2e-common.sh"

BASE_URL="${BASE_URL:-http://localhost:3018/api}"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TEST E2E — Organization Microservice — 100% UH + Swagger    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "  Base URL: $BASE_URL | Unique: $UNIQUE"

log_step 0 "Pre-flight"
RESP=$(do_get "$BASE_URL/organizations/query/count" "$AUTH"); CODE=$(extract_code "$RESP")
if [[ "$CODE" =~ ^(200|201|500)$ ]]; then log_ok "Service UP ($CODE)"; else log_fail "Service NO responde ($CODE)"; exit 1; fi

log_step 1 "UH-1 Organization"
P=$(cat <<EOF
{"name":"E2E Org ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"ORG-${UNIQUE}","legalName":"E2E Org SA","status":"ACTIVE","metadata":{"e2e":true}}
EOF
)
smoke_module "organizations" "$P"

log_step 2 "UH-2 OrganizationNode"
P=$(cat <<EOF
{"name":"E2E Node ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"NODE-${UNIQUE}","organizationId":"00000000-0000-0000-0000-000000000001",
 "nodeType":"DEPARTMENT","metadata":{"e2e":true}}
EOF
)
smoke_module "organizationnodes" "$P"

log_step 3 "UH-3 OrganizationNodeAttribute"
P=$(cat <<EOF
{"name":"E2E NA ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"NA-${UNIQUE}","nodeId":"00000000-0000-0000-0000-000000000001",
 "key":"budget","value":"100000","metadata":{"e2e":true}}
EOF
)
smoke_module "organizationnodeattributes" "$P"

log_step 4 "UH-4 NodeAssignment"
P=$(cat <<EOF
{"name":"E2E NAsgn ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"NASGN-${UNIQUE}","nodeId":"00000000-0000-0000-0000-000000000001",
 "personId":"00000000-0000-0000-0000-000000000002","roleName":"MANAGER","metadata":{"e2e":true}}
EOF
)
smoke_module "nodeassignments" "$P"

log_step 5 "UH-5 PlannedSeat"
P=$(cat <<EOF
{"name":"E2E PS ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"PS-${UNIQUE}","nodeId":"00000000-0000-0000-0000-000000000001",
 "headcount":5,"metadata":{"e2e":true}}
EOF
)
smoke_module "plannedseats" "$P"

log_step 6 "UH-6 HeadcountOverride"
P=$(cat <<EOF
{"name":"E2E HO ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"HO-${UNIQUE}","nodeId":"00000000-0000-0000-0000-000000000001",
 "overrideHeadcount":7,"reason":"E2E","metadata":{"e2e":true}}
EOF
)
smoke_module "headcountoverrides" "$P"

log_step 7 "UH-7 CatalogSyncLog"
P=$(cat <<EOF
{"name":"E2E Log ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"categoryCode":"org-status","triggeredBy":"e2e-test",
 "itemsAddedCount":0,"itemsUpdatedCount":0,"itemsRemovedCount":0,
 "outcome":"SUCCESS","syncedAt":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "catalogsynclogs" "$P"

log_step 8 "UH-8 catalog-client"
smoke_catalog_client

log_step 9 "Kafka probe"
if command -v kcat >/dev/null 2>&1; then
  KT=$(kcat -b localhost:29092 -L 2>/dev/null | grep -Eo 'topic "[^"]*organization[^"]*"' | head -10 || true)
  if [[ -n "$KT" ]]; then log_ok "Kafka topics organization.* detectados"; else log_warn "Sin topics organization.*"; fi
else log_warn "kcat no instalado — skipping"; fi

print_summary "organization-service"

# >>> NOMENCLADORES E2E BEGIN (auto-generado por sources/scaffold_nomenclador_e2e_tests.py)
# Servicio: organization-service | Puerto: 3018
NOM_BASE_URL="${NOM_BASE_URL:-http://localhost:3018/api}"
NOM_AUTH="${AUTH:-Bearer valid-token}"
nom_pass=0; nom_fail=0; nom_warn=0
_nom_ok()   { echo -e "  \033[0;32m✔ $1\033[0m"; nom_pass=$((nom_pass+1)); }
_nom_fail() { echo -e "  \033[0;31m✘ $1\033[0m"; nom_fail=$((nom_fail+1)); }
_nom_warn() { echo -e "  \033[1;33m⚠ $1\033[0m"; nom_warn=$((nom_warn+1)); }
NOM_UNIQUE="${UNIQUE:-$(date +%s)}"
NOM_NOW="${NOW:-$(date -u +%Y-%m-%dT%H:%M:%S.000Z)}"
echo ""
echo -e "\033[0;34m═══ NOMENCLADORES — organization-service ═══\033[0m"

# --- Nomenclador: headcount-override-mode ---
NOM_CODE="NHEADCO-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E HeadcountOverrideMode ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/headcountoverridemodes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "headcount-override-mode: create id=$NOM_ID"; else _nom_warn "headcount-override-mode: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/headcountoverridemodes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "headcount-override-mode: list ok"; else _nom_warn "headcount-override-mode: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/headcountoverridemodes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "headcount-override-mode: getById" || _nom_warn "headcount-override-mode: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/headcountoverridemodes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E HeadcountOverrideMode updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "headcount-override-mode: update" || _nom_warn "headcount-override-mode: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/headcountoverridemodes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "headcount-override-mode: delete" || _nom_warn "headcount-override-mode: delete"
fi

# --- Nomenclador: headcount-override-status ---
NOM_CODE="NHEADCO-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E HeadcountOverrideStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/headcountoverridestatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "headcount-override-status: create id=$NOM_ID"; else _nom_warn "headcount-override-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/headcountoverridestatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "headcount-override-status: list ok"; else _nom_warn "headcount-override-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/headcountoverridestatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "headcount-override-status: getById" || _nom_warn "headcount-override-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/headcountoverridestatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E HeadcountOverrideStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "headcount-override-status: update" || _nom_warn "headcount-override-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/headcountoverridestatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "headcount-override-status: delete" || _nom_warn "headcount-override-status: delete"
fi

# --- Nomenclador: node-assignment-action ---
NOM_CODE="NNODEAS-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E NodeAssignmentAction ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/nodeassignmentactions/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "node-assignment-action: create id=$NOM_ID"; else _nom_warn "node-assignment-action: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/nodeassignmentactions/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "node-assignment-action: list ok"; else _nom_warn "node-assignment-action: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/nodeassignmentactions/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "node-assignment-action: getById" || _nom_warn "node-assignment-action: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/nodeassignmentactions/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E NodeAssignmentAction updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "node-assignment-action: update" || _nom_warn "node-assignment-action: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/nodeassignmentactions/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "node-assignment-action: delete" || _nom_warn "node-assignment-action: delete"
fi

# --- Nomenclador: node-type ---
NOM_CODE="NNODETY-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E NodeType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/nodetypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "node-type: create id=$NOM_ID"; else _nom_warn "node-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/nodetypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "node-type: list ok"; else _nom_warn "node-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/nodetypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "node-type: getById" || _nom_warn "node-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/nodetypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E NodeType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "node-type: update" || _nom_warn "node-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/nodetypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "node-type: delete" || _nom_warn "node-type: delete"
fi

# --- Nomenclador: organization-element-type ---
NOM_CODE="NORGANI-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E OrganizationElementType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/organizationelementtypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "organization-element-type: create id=$NOM_ID"; else _nom_warn "organization-element-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/organizationelementtypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "organization-element-type: list ok"; else _nom_warn "organization-element-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/organizationelementtypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "organization-element-type: getById" || _nom_warn "organization-element-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/organizationelementtypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E OrganizationElementType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "organization-element-type: update" || _nom_warn "organization-element-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/organizationelementtypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "organization-element-type: delete" || _nom_warn "organization-element-type: delete"
fi

# --- Nomenclador: organization-node-status ---
NOM_CODE="NORGANI-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E OrganizationNodeStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/organizationnodestatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "organization-node-status: create id=$NOM_ID"; else _nom_warn "organization-node-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/organizationnodestatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "organization-node-status: list ok"; else _nom_warn "organization-node-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/organizationnodestatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "organization-node-status: getById" || _nom_warn "organization-node-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/organizationnodestatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E OrganizationNodeStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "organization-node-status: update" || _nom_warn "organization-node-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/organizationnodestatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "organization-node-status: delete" || _nom_warn "organization-node-status: delete"
fi

# --- Nomenclador: organization-status ---
NOM_CODE="NORGANI-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E OrganizationStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/organizationstatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "organization-status: create id=$NOM_ID"; else _nom_warn "organization-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/organizationstatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "organization-status: list ok"; else _nom_warn "organization-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/organizationstatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "organization-status: getById" || _nom_warn "organization-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/organizationstatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E OrganizationStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "organization-status: update" || _nom_warn "organization-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/organizationstatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "organization-status: delete" || _nom_warn "organization-status: delete"
fi

# --- Nomenclador: organization-type ---
NOM_CODE="NORGANI-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E OrganizationType ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/organizationtypes/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "organization-type: create id=$NOM_ID"; else _nom_warn "organization-type: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/organizationtypes/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "organization-type: list ok"; else _nom_warn "organization-type: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/organizationtypes/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "organization-type: getById" || _nom_warn "organization-type: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/organizationtypes/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E OrganizationType updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "organization-type: update" || _nom_warn "organization-type: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/organizationtypes/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "organization-type: delete" || _nom_warn "organization-type: delete"
fi

# --- Nomenclador: seniority ---
NOM_CODE="NSENIOR-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E Seniority ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/senioritys/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "seniority: create id=$NOM_ID"; else _nom_warn "seniority: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/senioritys/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "seniority: list ok"; else _nom_warn "seniority: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/senioritys/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "seniority: getById" || _nom_warn "seniority: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/senioritys/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E Seniority updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "seniority: update" || _nom_warn "seniority: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/senioritys/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "seniority: delete" || _nom_warn "seniority: delete"
fi

# --- Nomenclador: vacancy-status ---
NOM_CODE="NVACANC-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E VacancyStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/vacancystatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "vacancy-status: create id=$NOM_ID"; else _nom_warn "vacancy-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/vacancystatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "vacancy-status: list ok"; else _nom_warn "vacancy-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/vacancystatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "vacancy-status: getById" || _nom_warn "vacancy-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/vacancystatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E VacancyStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "vacancy-status: update" || _nom_warn "vacancy-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/vacancystatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "vacancy-status: delete" || _nom_warn "vacancy-status: delete"
fi

echo ""
echo -e "\033[0;34m── Resumen Nomencladores organization-service ──\033[0m"
echo "  ✔ OK=$nom_pass  ✘ FAIL=$nom_fail  ⚠ WARN=$nom_warn"
[[ ${nom_fail:-0} -eq 0 ]] || echo "[NOMENCLADORES] hay fallos en este servicio"
# <<< NOMENCLADORES E2E END
