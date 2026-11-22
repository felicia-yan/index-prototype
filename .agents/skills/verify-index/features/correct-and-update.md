# Correct a card and update a file

An empty draft cannot be confirmed. A correction becomes the known answer. A stale file changes only when its owner confirms the edit card.

## Sub-features

- empty-correction: Saving a blank correction is refused.
- save: Jen's correction is the sentence Index keeps.
- file-answer: The permissions question is answered from the files and names the stale RFC.
- edit-card: David confirming the edit rewrites RFC-041.

## How to get to it (user POV)

- Ask `What's the stopping rule for the onboarding checklist?`
- Ask `What did we decide about the permissions architecture?`
- Ask `When are background tabs discarded?`

## Driving it with Playwright

Preconditions: signed in, sample data.

- Ask the stopping-rule question, press Send card to Jen. Confirm is disabled.
- Press Correct, submit spaces only. The page says `Write the correction first.`
- Write a stopping rule and press Save correction. The page says `Jen confirmed this.` and quotes the rule.
- Ask the permissions architecture question. The page says `still says the decision is pending` and offers `Ask David to update RFC-041`.
- Send that card and press Confirm. Ask the architecture question again. The page says `RFC-041 matches that decision` and the RFC passage starts `Status: Accepted on Oct 23`.
- Ask when background tabs are discarded. The page says `48 open tabs` and offers `Ask Tom to update the readme`.

## Gotchas

- Save correction and Save draft are different. An unsent card saves a draft and does not file the answer yet.
- The tabs readme stays stale until Tom's card is confirmed. The drive checks that the offer is there.
