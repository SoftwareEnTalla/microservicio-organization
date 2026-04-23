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
