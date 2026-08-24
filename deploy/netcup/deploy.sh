#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "Deploying AI-Acadamy to study.nirva.one on this host"
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
curl -fsS -o /dev/null -w "local http %{http_code}\n" http://127.0.0.1:80 || true
echo "When DNS for study.nirva.one points here, HTTPS is issued by Caddy automatically."
