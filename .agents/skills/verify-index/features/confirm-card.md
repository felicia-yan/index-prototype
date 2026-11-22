# Sign in and confirm a card

A person signs in, sees the card waiting on them, and either confirms the draft or hands it to someone else.

## Sub-features

- bad-email: A work email without an @ is refused.
- email-in: A normal work email opens the home page.
- confirm: Confirm files the draft and takes the card out of Needs you.
- pass-on: Not me hands the same card to David, who can confirm it.

## How to get to it (user POV)

- Open the site. The sign-in form is on the first screen.
- Continue with email, Continue with Google, or Continue with SSO. All three open the same sample home.
- The card is the first thing under Needs you. Cards in the header opens the same card.

## Driving it with Playwright

Preconditions: a fresh load. The script reloads before this scenario.

- Type `not-an-email` and press Continue with email. The page says `Enter a work email.`
- Type `you@company.com` and press Continue with email. A heading `Needs you` is visible, with Confirm, Correct, and Not me.
- Press Confirm. The page says `You confirmed this.` and `60-second cache`. Index home no longer lists that question under Needs you.
- Reload, press Not me, then Confirm. The page says `David's card` and then `David confirmed this.`

## Gotchas

- Confirm matches more than one button if a second card is open. Use exact.
- Google and SSO do not ask for a password. They are the same local sign-in.
