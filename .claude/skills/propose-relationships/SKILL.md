---
name: propose-relationships
description: After a /teach session, propose typed Relationships (requires, extends, contrasts-with, applies) from the new or changed Lessons to Nodes in the same and other Topics, ask the author to accept or reject each, and append accepted ones to the Topic's topic.yaml. Use when the user says "propose relationships", "link this lesson", or has just finished a /teach session in this repo.
---

# Propose Relationships

The Graph on the site grows from two sources: `mentions` Relationships, which the build derives from links inside Lessons, and the four typed Relationships the author records by hand in `topic.yaml`. This skill does the proposing so the author only has to judge. It never writes without approval.

Vocabulary follows `GLOSSARY.md`: Topic, Lesson, Reference sheet, Node, Relationship, Relationship type.

## Inputs

1. **Which Lessons to work on.** Default: Lessons and Reference sheets changed or added since the last commit (`git status --short topics/`, plus `git diff --name-only HEAD -- topics/`). If the user names a Lesson or Topic, use that instead.
2. **The existing Graph.** Build the site and read the Graph data file it emits:

   ```bash
   cd site && npm run build >/dev/null && cat dist/graph.json
   ```

   If the Topic is not yet `published: true`, its Nodes are not in the Graph; read its `lessons/` and `reference/` directories directly and use the id scheme below.
3. **The Topic's `topic.yaml`**, to avoid proposing what is already there.

## Node ids

- Topic: `<topic-slug>`
- Lesson: `<topic-slug>/<lesson-stem>` (for example `kafka/0001-where-does-an-event-land`)
- Reference sheet: `<topic-slug>/reference/<stem>`

Inside a Topic's own `topic.yaml`, a bare `<lesson-stem>` or `reference/<stem>` means "in this Topic". Use full ids for the other Topic.

## Relationship types (closed set)

| type             | from → to means                                                        |
| ---------------- | ---------------------------------------------------------------------- |
| `requires`       | understanding *from* needs *to* first                                  |
| `extends`        | *from* builds on or deepens *to*                                       |
| `contrasts-with` | *from* and *to* are easily confused or take opposite positions         |
| `applies`        | *from* puts the idea in *to* to use                                    |

`mentions` is never authored; the build derives it.

## Procedure

1. Read each target Lesson in full (the `<main>` text and its quiz stems), and the titles and summaries of every Node in the Graph. Read the body of any Node that looks related.
2. Draft candidates. For each, write one line: `from → to  (type): reason in ten words or fewer`. Aim for the few strong ones, not coverage: typically two to six per Lesson, and at least one to another Topic when a real connection exists. Skip anything already in `topic.yaml` (same from, to and type) and anything that is only a `mentions`-grade passing reference.
3. Ask the author to accept or reject **each candidate individually** with `AskUserQuestion` (multi-select, the candidates as options, at most four per question; ask several questions when there are more). Include the reason in each option's description.
4. Append the accepted Relationships to the `relationships:` list of the **from** Node's Topic `topic.yaml`, keeping the existing YAML style (`- { from: "...", to: "...", type: ... }`). Add a `relationships: []` key first if the manifest has none.
5. Verify: run `cd site && npm test`. A dangling endpoint or an unknown type fails the build with a message naming the manifest; fix it before finishing.
6. Report what was added, in the `from → to (type)` form, and what the author rejected.

## Rules

- Never write a Relationship the author has not explicitly accepted in this session.
- Never edit Lessons, Reference sheets, `MISSION.md` or any other workspace file; only `topic.yaml`.
- Never propose `mentions`, a Relationship from a Node to itself, or an endpoint that is not a Published Node (unless the author is about to publish it and says so).
- If `topic.yaml` is missing, offer to create it with `published: false` and the standard keys, and continue.
