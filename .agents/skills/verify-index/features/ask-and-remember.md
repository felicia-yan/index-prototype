# Ask, send, and remember

Asking about incognito history sync drafts a card for Alice. After she confirms, the same question is answered from that sentence, and the stale PRD is updated.

## Sub-features

- gap: The ask explains that the PRD and the thread disagree.
- evidence: Incognito PRD opens, and while it is stale the passage says history sync is on by default.
- send: Send card to Alice shows her Confirm, Correct, and Not me.
- remember: Asking again does not offer another card.
- blank: An unknown question can be sent with no draft, and Confirm stays off.
- silent: Don't ask people removes the send button.

## How to get to it (user POV)

- Type the question in the ask field and press Ask.
- The questions the sample knows are listed in the README.

## Driving it with Playwright

Preconditions: signed in, sample data, asking people is on.

- Ask `Is history sync on in incognito?` The page says `Nobody wrote down who decided.`
- Open `Incognito PRD (out of date)`. The passage says `on by default`. Close evidence.
- Press Send card to Alice, then Confirm. The page says `Alice confirmed this.`
- Open `Incognito PRD`. The passage says `never contact sync servers`.
- Ask the same question again. The page says `Index didn't ask again` and there is no Send card to Alice.
- Ask `Who owns the snack budget?`, choose Sam Ito, press Ask them, then Send card to Sam. Confirm is disabled.
- In Settings, choose Don't ask people, and ask the incognito question again. The page says `Asking people is off.`

## Gotchas

- The button name for the stale PRD includes `(out of date)`. After confirm, that suffix is gone.
- Ask matches Ask them and Ask David. Use exact for the header Ask button.
