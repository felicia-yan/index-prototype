---
name: verify-index
description: Drive the Index prototype in Chrome. Use after any change to the static demo, to prove sign-in, cards, asks, evidence, sources, and the mobile layout.
---

# Verify Index

Index is one static page, `index.html`, plus `icons/` and `people/`. There is no build and no account server. Reloading restores the sample company.

## Launch

The drive script starts its own server on a free localhost port and tears it down. Do not reuse a server you did not start.

```bash
PLAYWRIGHT_PATH=/Users/Diego/duna-realization-engine/node_modules/playwright/index.js \
  node .agents/skills/verify-index/scripts/drive.mjs
```

Chrome must be installed at `/Applications/Google Chrome.app`. The script exits 0 only when every assertion passed. Screenshots land in `/tmp/index-verify/` (override with `VERIFY_OUT`).

## Doctor

- `node --check` the extracted `<script>` from `index.html` if the page throws before render.
- A port left in use is not this script's server. The script picks a free port. Kill only a python `http.server` you started yourself.

## Drive

`scripts/drive.mjs` is the harness. It uses Playwright role names, not coordinates. Feature files in `features/` name the same buttons.

One run covers sign-in, confirming a card, passing a card on, the incognito ask (send, confirm, remember, and the PRD updating), a correction, a file answer, a blank card, blocked Downloads, overlaps, nearby workstreams, help, legal pages, and a 390px layout with no horizontal overflow.

## Evidence

Each run writes full-page PNGs under `/tmp/index-verify/`. The script's stdout is the pass line `drive ok`. A failure prints the missing text and exits 1. Leave that directory in place after cleanup. Cleanup only stops the server the script spawned.

## Cleanup

The script kills the server it started in a `finally` block. Do not `killall` Python or Chrome. Proof screenshots stay in `VERIFY_OUT`.

## Helpers

- `.agents/skills/verify-index/scripts/drive.mjs`
