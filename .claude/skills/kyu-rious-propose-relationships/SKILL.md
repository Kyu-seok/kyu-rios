---
name: kyu-rious-propose-relationships
description: Propose typed Relationships (requires, extends, contrasts-with, applies) between Topics only, never between Lessons or Reference sheets; ask the author to accept or reject each, and append accepted ones to the Topic's topic.yaml. Use when the user says "propose relationships", "connect the topics", or has just published a Topic in this repo.
---

# Propose Relationships

The Graph on the site has two kinds of edge: `mentions`, which the build derives from links inside Lessons, and the four typed Relationships the author records by hand in `topic.yaml`. Typed Relationships connect **Topic Nodes to Topic Nodes** and nothing else: a Lesson-level link makes the Graph too dense to read. This skill does the proposing so the author only has to judge. It never writes without approval.

Vocabulary follows `GLOSSARY.md`: Topic, Lesson, Reference sheet, Node, Relationship, Relationship type.

## Inputs

1. **Which Topics to work on.** Default: every Published Topic that has no typed Relationship yet, plus any Topic the user names. If every Topic is already connected, say so and stop.
2. **The existing Graph.** Build the site and read the Graph data file it emits:

   ```bash
   cd site && npm run build >/dev/null && cat dist/graph.json
   ```

   Only the Nodes with `kind: topic` matter here. A Topic that is not yet `published: true` has no Node; include it only if the author says they are about to publish it.
3. **Each Topic's `topic.yaml`**, to avoid proposing what is already there.

## Node ids

A Topic's id is its slug, the directory name under `topics/`: `kafka`, `agent-orchestration`. Both `from` and `to` are Topic slugs. Never a `<slug>/<stem>` id.

## Relationship types (closed set)

| type             | from → to means                                                        |
| ---------------- | ---------------------------------------------------------------------- |
| `requires`       | understanding *from* needs *to* first                                  |
| `extends`        | *from* builds on or deepens *to*                                       |
| `contrasts-with` | *from* and *to* are easily confused or take opposite positions         |
| `applies`        | *from* puts the idea in *to* to use                                    |

`mentions` is never authored; the build derives it.

## Procedure

1. Read each target Topic's `MISSION.md`, its `topic.yaml` summary, and the titles and summaries of its Lessons and Reference sheets. Read a Lesson's body only when it names another Topic or its ideas.
2. Draft candidates. For each pair of Topics with a real connection, write one line: `from → to  (type): reason in ten words or fewer`. One type per pair at most, and only the strong ones: a Topic that borrows a framework from another, assumes it, or is easily confused with it. Skip a pair that is already in either `topic.yaml` and anything that is only a passing reference.
3. Ask the author to accept or reject **each candidate individually** with `AskUserQuestion` (multi-select, the candidates as options, at most four per question; ask several questions when there are more). Include the reason in each option's description.
4. Append the accepted Relationships to the `relationships:` list of the **from** Topic's `topic.yaml`, keeping the existing YAML style (`- { from: "<slug>", to: "<slug>", type: ... }`). Add a `relationships: []` key first if the manifest has none.
5. Verify: run `cd site && npm test`. A dangling endpoint or an unknown type fails the build with a message naming the manifest; fix it before finishing.
6. Report what was added, in the `from → to (type)` form, and what the author rejected. Then offer `/kyu-rious-ship` in one line; the Relationships reach the live Graph only when pushed.

## Rules

- Never write a Relationship the author has not explicitly accepted in this session.
- Never propose a Relationship whose endpoint is a Lesson or Reference sheet. If a Lesson-level link seems strong, propose it at Topic level or drop it.
- Never edit Lessons, Reference sheets, `MISSION.md` or any other workspace file; only `topic.yaml`.
- Never propose `mentions` or a Relationship from a Topic to itself.
- If `topic.yaml` is missing, offer to create it with `published: false` and the standard keys, and continue.
