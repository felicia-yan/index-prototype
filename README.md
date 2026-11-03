# Index prototype

A clickable prototype of Index, with mock data. Index keeps cross-team knowledge up to date so PMs can see what other teams are shipping and catch conflicts early.

It's a static site: `index.html` plus `icons/` and `people/`. There's no build step.

## Run locally

```bash
python3 -m http.server 8731
```

Then open http://localhost:8731.

## Deploy on Vercel

Import the repo in Vercel and pick the **Other** framework preset. Leave the build command empty and set the output directory to the repo root.

Fonts: DM Sans and DM Mono from Google Fonts. Portraits: Unsplash.
