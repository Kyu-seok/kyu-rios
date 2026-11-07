---
status: accepted
---

# MISSION.md stays private; ABOUT.md is what readers see

`/teach` writes `MISSION.md` for the teacher: why the learner wants this, by when, under what constraints, with their name and local paths. The first version of the site rendered it on the Topic page as the "why", and that put personal detail on a public site. The Mission now joins `NOTES.md`, `RESOURCES.md` and `learning-records/` as gitignored, teacher-facing material, and the build never reads it. A Topic that wants a "why read this" section gets an optional `ABOUT.md`, written for readers and free of anything about the learner; `/kyu-rious-publish-topic` drafts it from the Mission and writes it only on approval.

## Considered options

- **Keep rendering `MISSION.md`, edit out the personal parts**: rejected because `/teach` keeps rewriting it for the teacher, so the edits would not last.
- **A multi-line `about` field in `topic.yaml`**: rejected because prose in YAML is awkward to write and diff.
- **No description at all**: viable, and what a Topic without `ABOUT.md` shows. Rejected as the default because the Graph and Review make a short "what you can do afterwards" worth having.

## Consequences

- A build-seam test asserts that nothing from `MISSION.md`, `NOTES.md`, `RESOURCES.md` or `learning-records/` appears in the built Site.
- The five Missions committed before this decision were removed from the repository's history, so clones made before that point are stale.
- `/kyu-rious-backup-teach-notes` backs up `MISSION.md` too, since it now exists only on the author's machine.
