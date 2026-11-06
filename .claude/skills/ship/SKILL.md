---
name: ship
description: After a /teach session, validate, commit, push and watch the deploy of the new or changed Lessons.
disable-model-invocation: true
---

# Ship

The routine end of a `/teach` session on a Published Topic: the new Lessons, Reference sheets and quiz files go live.

1. **Find the session's work.** `git status --short topics/` lists it. Group it by Topic. Done when you can say, per Topic, which Lessons and Reference sheets are new or changed and whether each Lesson has its `.quiz.js`.
2. **Quiz ids.** For each changed `.quiz.js`, compare against the committed version (`git diff`): ids are permanent, so an id that changed meaning, was renumbered, or was reused for a different question is a mistake to fix before shipping (`CLAUDE.md`, rule 2). New questions take the next free number. Done when every id in the diff is either untouched or brand new.
3. **Ship** by following `docs/agents/shipping.md` to the end.
4. **Offer the Graph step** in one line: `/propose-relationships` for the Lessons just shipped. Not part of shipping; the user decides.

If a changed Topic is not Published, say so and stop at step 1: shipping it changes nothing on the site, and `/publish-topic` is the way to publish it.
