# Index prototype

A clickable demo of Index. Index reads what teams already wrote. When that is not enough, one person gets a card with a draft. They confirm it, correct it, or pass it on. The next ask uses what they confirmed.

It is a static site: `index.html`, `icons/`, and `people/`. There is no build step and no server account. The company, people, and files are fictional. Reloading the page restores the sample.

## Questions the demo can answer

- What was the final decision on the permissions API? A card is already waiting on the home page.
- Is history sync on in incognito?
- What's the stopping rule for the onboarding checklist?
- What did we decide about the permissions architecture?
- When are background tabs discarded?

Anything else can still be sent as a card with no draft. The recipient has to write the answer before it can be confirmed.

## Run locally

```bash
python3 -m http.server 8731
```

Then open http://localhost:8731.

## Check

The scripted drive is `.agents/skills/verify-index/scripts/drive.mjs`. It needs Chrome and Playwright.

```bash
PLAYWRIGHT_PATH=/Users/Diego/duna-realization-engine/node_modules/playwright/index.js \
  node .agents/skills/verify-index/scripts/drive.mjs
```

## Deploy on Vercel

Import the repo and pick the **Other** framework preset. Leave the build command empty and set the output directory to the repo root.

Fonts: Figtree and Newsreader from Google Fonts. Portraits: Unsplash.
