# Help, legal, and a narrow window

Help, Privacy, Terms, and Security are real pages. At a phone width the home page does not scroll sideways, and overlap actions sit under the title rather than on top of it.

## Sub-features

- slash: The / key focuses the ask field when you are not typing in another field.
- help: Help topics switch the article.
- legal: Privacy says the people are fictional. Terms and Security say what the demo does not do.
- mobile: At 390px the document is no wider than the window.

## How to get to it (user POV)

- The footer on every signed-in page: Help, Privacy, Terms, Security.
- Resize the window, or use the drive script's 390 by 844 step.

## Driving it with Playwright

Preconditions: signed in, on the home page.

- Press `/`. The focused element is `#q`.
- Open Help. The article mentions typing a question. Open Cards. The article says `A card is one question`. Open Evidence. The article says it is not a folder.
- Open Privacy, Terms, and Security. Privacy contains `fictional`. Terms contains `clickable demo`. Security contains `no file is uploaded`.
- The word ping is not on the page.
- Set the viewport to 390 by 844, reload, and sign in. `scrollWidth` is not greater than `clientWidth`. Confirm the waiting card. The confirmed card also fits.

## Gotchas

- `/` does nothing while a text field is focused. Press it from the page body.
- Look at `09-mobile-home.png` for overlap text sitting under the buttons. A width check does not catch that.
