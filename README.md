# 🦀 Crab Trap Funnel

Cloudflare Worker serving 21 domain landing pages with AI bot detection and trapping.

## Architecture

```
crab-trap-funnel/
├── pages/                  # HTML landing pages (data)
│   ├── deckboss.net.html
│   ├── cocapn.ai.html
│   ├── trap.html           # AI bot trap page
│   └── ... (20 domains + trap)
├── src/
│   ├── index.js            # Worker logic (~70 lines)
│   └── pages.js            # Auto-generated: imports all HTML (gitignored)
├── scripts/
│   ├── build.mjs           # Generates src/pages.js from pages/*.html
│   └── deploy.sh           # One-command deploy
├── .github/workflows/
│   └── deploy.yml          # CI/CD: auto-deploys on push to main
├── wrangler.toml            # Cloudflare Workers config
├── package.json
└── README.md
```

## How It Works

- **20 domains** route to this single Worker via CF dashboard routes (`<domain>/*`)
- On each request, the Worker inspects the `Host` header and serves the matching page
- **AI bot detection**: if `User-Agent` matches any known AI crawler, the bot trap page (`pages/trap.html`) is served instead
- `/trap` path explicitly triggers the trap page
- Fallback domain is `cocapn.ai`

### AI Bots Trapped

GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, Google-Extended, Bytespider, CCBot, PerplexityBot, YouBot, KimiBot, DeepSeek, Meta-ExternalAgent, cohere-ai, AI2Bot, OmgiliBot, SemrushBot, AhrefsBot, DotBot

## Development

```bash
npm install          # Install deps
npm run build        # Build src/pages.js from pages/*.html
npm run dev          # Local dev with wrangler
npm run deploy       # Build + deploy to Cloudflare
```

## Deploy

### Manual
```bash
npm run deploy
```

### CI/CD (GitHub Actions)
Push to `main` → auto-deploys via `cloudflare/wrangler-action`.
Requires `CLOUDFLARE_API_TOKEN` in repo secrets.

## Routes

All domain routes (`<domain>/*`) are configured in the Cloudflare dashboard:

| Domain | Route |
|--------|-------|
| deckboss.net | `deckboss.net/*` |
| deckboss.ai | `deckboss.ai/*` |
| lucineer.com | `lucineer.com/*` |
| capitaine.ai | `capitaine.ai/*` |
| capitaineai.com | `capitaineai.com/*` |
| dmlog.ai | `dmlog.ai/*` |
| studylog.ai | `studylog.ai/*` |
| playerlog.ai | `playerlog.ai/*` |
| purplepincher.org | `purplepincher.org/*` |
| personallog.ai | `personallog.ai/*` |
| activelog.ai | `activelog.ai/*` |
| cocapn.ai | `cocapn.ai/*` |
| makerlog.ai | `makerlog.ai/*` |
| api.cocapn.ai | `api.cocapn.ai/*` |
| superinstance.ai | `superinstance.ai/*` |
| luciddreamer.ai | `luciddreamer.ai/*` |
| fishinglog.ai | `fishinglog.ai/*` |
| activeledger.ai | `activeledger.ai/*` |
| cocapn.com | `cocapn.com/*` |
| reallog.ai | `reallog.ai/*` |
| businesslog.ai | `businesslog.ai/*` |

## Status

✅ Deployed and live at `crab-trap-funnel.casey-digennaro.workers.dev`
✅ GitHub repo: [SuperInstance/crab-trap-funnel](https://github.com/SuperInstance/crab-trap-funnel)
✅ CI/CD auto-deploys on push to `main` via GitHub Actions (requires `CLOUDFLARE_API_TOKEN` secret)

## Verification

```bash
# Normal page
curl -s https://superinstance.ai/ | head -5

# Bot trap
curl -s -A "GPTBot" https://superinstance.ai/ | head -5

# Explicit trap path
curl -s https://superinstance.ai/trap | head -3

# All domains should return their respective pages
curl -s https://deckboss.net/ | head -5
curl -s https://cocapn.ai/ | head -5
```
