# Sources, overlaps, and nearby work

Downloads starts blocked. An overlap is settled by sending its card. A nearby workstream can be watched and then put back.

## Sub-features

- blocked: Preview of the legacy scope export hides the passage.
- allow: Checking Downloads shows the 142 scopes, and unchecking hides them again.
- bell: Turning card alerts off keeps the home card and changes the bell.
- dismiss: Dismiss and undo restore the checklist overlap.
- settle: Confirming David's checklist card marks the overlap settled.
- watch: Watch Enterprise SSO moves it into your workstreams. Stop watching puts it back under Nearby.
- create: A workstream with no name is refused. A named one opens empty.

## How to get to it (user POV)

- Settings from the header.
- Home, under Overlaps, Nearby, and Your workstreams.

## Driving it with Playwright

Preconditions: signed in, sample data.

- Settings, Preview Legacy scope export. The dialog says `Index can't open this`.
- Check Downloads, preview again. The passage says `142 existing scopes`. Uncheck. The passage is hidden again.
- Uncheck `Show cards that need you on the bell`, open Cards. The panel says `Card alerts are off.` The home card is still under Needs you.
- Dismiss the checklist overlap, then Undo the checklist overlap.
- Ask David about the checklist, send, confirm, return home. The overlap line says `Settled.`
- Watch Enterprise SSO. Nearby no longer contains that name. Open it, Stop watching, and it is under Nearby again.
- New workstream, Create workstream with an empty name. The page says `Name the workstream first.` Name it `Snack budget` and create it. The page says `Nothing is filed here yet.`

## Gotchas

- Dismiss buttons share the visible word Dismiss. The accessible names are `Dismiss the checklist overlap` and `Dismiss the private tabs overlap`.
- Watching a workstream you are already working on is not offered. Leave is not a control.
