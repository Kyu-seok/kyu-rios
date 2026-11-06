---
name: publish-topic
description: Make a Topic Published for the first time, or change what of it is Published, then ship it.
disable-model-invocation: true
argument-hint: "<topic-slug>"
---

# Publish a Topic

Nothing is Published unless the author marks it (`GLOSSARY.md`: Published). This skill is where that mark is made, so every step ends with the user's explicit decision.

1. **Inventory.** Read `topics/<slug>/topic.yaml`, list `lessons/*.html` with their titles (the `<title>` element) and whether each has a `.quiz.js`, and list `reference/*.html`. Show the table. Done when the user has seen it.
2. **Fill the manifest.** Ask for anything missing, one question at a time:
   - `summary`: one line, written for a stranger reading the home page.
   - `exclude`: Lesson stems or `reference/<stem>` to hold back (default none). A Lesson without a `.quiz.js` still publishes; it just adds no Review cards. Say so if it happens.
   - `review.exclude`: Lesson stems or question ids to keep out of Review (default none).
   Then set `published: true`. Done when the user has confirmed the manifest as written.
3. **Check the Topic page's "why".** `MISSION.md` renders on the Topic page. Open it and confirm with the user that it is fit for readers (it was written for the teacher). Done when they say yes or have edited it.
4. **Ship** by following `docs/agents/shipping.md` to the end.
5. **Suggest the next step** in one line: `/propose-relationships` connects the new Nodes to the rest of the Graph; until then they sit in their own cluster.
