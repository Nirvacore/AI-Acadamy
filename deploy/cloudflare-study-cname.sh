#!/usr/bin/env bash
# Upsert CNAME study.nirva.one -> nirvacore.github.io (DNS only / not proxied).
# Needs CLOUDFLARE_API_TOKEN with Zone.DNS Edit on nirva.one.
set -euo pipefail

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN (Zone DNS Edit on nirva.one)}"

ZONE_NAME="${ZONE_NAME:-nirva.one}"
RECORD_NAME="${RECORD_NAME:-study}"
TARGET="${TARGET:-nirvacore.github.io}"
FQDN="${RECORD_NAME}.${ZONE_NAME}"

python3 - "$ZONE_NAME" "$RECORD_NAME" "$TARGET" "$FQDN" <<'PY'
import json, os, sys, urllib.error, urllib.parse, urllib.request

zone_name, record_name, target, fqdn = sys.argv[1:]
token = os.environ["CLOUDFLARE_API_TOKEN"]

def api(method, path, body=None):
    req = urllib.request.Request(
        f"https://api.cloudflare.com/client/v4{path}",
        data=None if body is None else json.dumps(body).encode(),
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as res:
            payload = json.load(res)
    except urllib.error.HTTPError as err:
        detail = err.read().decode("utf-8", "replace")
        raise SystemExit(f"Cloudflare API {err.code}: {detail[:500]}") from None
    if not payload.get("success"):
        raise SystemExit(json.dumps(payload.get("errors", payload), ensure_ascii=False))
    return payload

zones = api("GET", f"/zones?name={urllib.parse.quote(zone_name)}&status=active")["result"]
if not zones:
    raise SystemExit(f"zone not found: {zone_name}")
zone_id = zones[0]["id"]

query = urllib.parse.urlencode({"type": "CNAME", "name": fqdn})
existing = api("GET", f"/zones/{zone_id}/dns_records?{query}")["result"]
body = {
    "type": "CNAME",
    "name": record_name,
    "content": target,
    "proxied": False,
    "ttl": 1,
    "comment": "AI-Acadamy GitHub Pages",
}
if existing:
    rec = existing[0]
    api("PUT", f"/zones/{zone_id}/dns_records/{rec['id']}", body)
    action = "updated"
else:
    api("POST", f"/zones/{zone_id}/dns_records", body)
    action = "created"

print(f"{action} {fqdn} CNAME {target} proxied=false")
PY
