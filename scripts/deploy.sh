#!/usr/bin/env bash
# Deploy the Crab Trap Funnel Worker to Cloudflare
# Usage: ./scripts/deploy.sh [--dry-run]
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Crab Trap Funnel Deploy ==="
echo ""

# 1. Build pages bundle
echo "→ Building pages bundle..."
node scripts/build.mjs
echo ""

# 2. Check wrangler is available
if ! command -v wrangler &>/dev/null; then
  echo "✗ wrangler not found. Install it: npm install"
  exit 1
fi

# 3. Deploy
if [ "${1:-}" = "--dry-run" ]; then
  echo "→ Dry run — skipping deploy"
  echo "  To deploy: ./scripts/deploy.sh"
  exit 0
fi

echo "→ Deploying to Cloudflare..."
wrangler deploy

echo ""
echo "✓ Deploy complete!"
