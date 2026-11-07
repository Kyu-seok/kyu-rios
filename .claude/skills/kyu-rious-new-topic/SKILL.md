---
name: kyu-rious-new-topic
description: Scaffold a new Topic directory and manifest, then hand off to /teach.
disable-model-invocation: true
argument-hint: "What do you want to learn? e.g. 'the Node.js event loop'"
---

# New Topic

Vocabulary follows `GLOSSARY.md`. A Topic is one subject learned as a whole; its directory under `topics/` is the `/teach` workspace for it.

1. **Agree the slug and title.** Propose a slug (lower-case, hyphens, no `learn-` prefix, matching the existing five such as `kafka` and `git-workflow`) and a title. Confirm both with the user in one question. Done when the user has accepted a slug that no `topics/<slug>/` already uses.
2. **Scaffold.** Create `topics/<slug>/` with `lessons/`, `reference/`, `assets/` and this `topic.yaml`:

   ```yaml
   title: <Title>
   summary: ""   # one line for the home page and Graph tooltips; written at publish time
   published: false
   exclude: []
   relationships: []
   review:
     exclude: []
   ```

   Done when `cd site && npm test` still passes (an unpublished Topic contributes nothing, so the Site is unchanged).
3. **Hand off.** `/teach` treats the directory it runs in as its workspace, so the session that teaches must start there. Tell the user, in one line, to run:

   ```bash
   cd ~/Work/kyu-rious/topics/<slug> && claude
   ```

   and then `/teach <what they want to learn>`. The repo's `CLAUDE.md` is loaded from the parent directory, so the Quiz convention applies without further instruction.

Done when the directory and manifest exist and the user has the hand-off command. Publishing comes later, with `/kyu-rious-publish-topic`.
