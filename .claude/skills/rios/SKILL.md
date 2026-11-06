---
name: rios
description: Which kyu-rios skill to run for the task at hand.
disable-model-invocation: true
---

# kyu-rios skills

One Topic goes through these in order. Each is run by typing its name; none fires on its own.

| When                                                   | Run                      |
| ------------------------------------------------------ | ------------------------ |
| Starting to learn a new subject                        | `/new-topic <subject>`   |
| Learning (from inside `topics/<slug>/`)                | `/teach`                 |
| A Topic is ready for readers, or its exclusions change | `/publish-topic <slug>`  |
| A `/teach` session on a Published Topic just ended     | `/ship`                  |
| New Lessons should connect to the rest of the Graph    | `/propose-relationships` |
| Now and then, and before a laptop change               | `/backup-teach-notes`    |

Everything else about the site lives in `README.md` (commands), `CLAUDE.md` (the Quiz convention) and `docs/agents/shipping.md` (how a change reaches the live site).

Answer the user's question with the row that fits, then stop; the named skill does the work when they run it.
