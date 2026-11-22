# Index verification map

Drive the static Index demo the way a signed-in PM would. The harness is `.agents/skills/verify-index/scripts/drive.mjs`.

## Baseline preconditions

- Repo root is the site root. `index.html` is served as `/`.
- Chrome is installed. Playwright resolves from `PLAYWRIGHT_PATH` or the duna-realization-engine checkout.
- The script starts and kills its own localhost server. Do not point it at a server you were already using.
- A reload restores the sample. Each scenario in the script reloads before it mutates state.

## Driving conventions

- Prefer `getByRole` names from the feature files. Use `exact: true` for Ask, Confirm, Correct, and Not me, because other buttons contain those words.
- The ask field is `#q`. The correction field is `#correction`.
- Capture the action and the resulting sentence, not only the final screen.

## Proof and skip reporting

- A passing run prints `drive ok` and writes PNGs to `/tmp/index-verify/`.
- Horizontal overflow is measured at 390px. Overlapping text that does not widen the page still has to be looked at in `09-mobile-home.png`.

## Features

- [Sign in and confirm a card](./confirm-card.md)
- [Ask, send, and remember](./ask-and-remember.md)
- [Correct a card and update a file](./correct-and-update.md)
- [Sources, overlaps, and nearby work](./sources-and-overlaps.md)
- [Help, legal, and a narrow window](./help-and-mobile.md)
