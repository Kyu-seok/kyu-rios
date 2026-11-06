## Agent skills

### Issue tracker

Issues are tracked in this repo's GitHub Issues via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Repository layout

- `topics/<slug>/` is one `/teach` workspace per Topic. Run `/teach` inside it as usual; the site reads these files and never writes to them.
- `site/` is the Astro generator for https://kyu-seok.github.io/kyu-rios/. `npm test` there runs the build-seam tests, `npm run test:browser` the Playwright tests, `npm run check` the typecheck.
- `topics/<slug>/topic.yaml` is the Topic manifest: `title`, `summary`, `published`, `exclude`, `relationships`, `review.exclude`. Nothing is Published until `published: true`. Within a Published Topic only `ABOUT.md` (the reader-facing description, optional), `lessons/*.html` with their `.quiz.js`, `reference/*.html` and `assets/*` are Published; `MISSION.md`, `NOTES.md`, `RESOURCES.md`, `learning-records/`, the `index.html` course index and anything else (such as an epub) never are. `MISSION.md`, `NOTES.md`, `RESOURCES.md` and `learning-records/` are gitignored because they are about the learner and the repo is public.

## Instructions for `/teach` in this repo

When writing or editing a Lesson under `topics/<slug>/lessons/`:

1. **Put the Quiz in `lessons/<lesson-stem>.quiz.js`**, next to the Lesson. The whole file is one statement:

   ```js
   window.QUIZ = [
     { id: "<topic-slug>/<lesson-number>/q1", stem: "Question?", options: ["A", "B", "C"], answer: 1, why: "Why B is right." },
   ];
   ```

   `section` is optional and names the mount point when a Lesson has more than one quiz block (for example `"warmup"`).
   The Lesson loads it with `<script src="<lesson-stem>.quiz.js"></script>` **before** the script that mounts the quiz, and mounts from `window.QUIZ` (or `window.QUIZ.filter((q) => q.section === "warmup")`). Never inline the question array in the Lesson. The `/teach` preview from `file://` keeps working because this is a script, not a fetch.

2. **Every question has a permanent `id`** of the form `<topic-slug>/<lesson-number>/q<n>`, where `<lesson-number>` is the Lesson's number without leading zeros (`topics/kafka/lessons/0003-…` is `kafka/3/q1`). Readers' Review Progress is keyed by this id.
   - Never renumber or reuse ids. A new question gets the next free number, even if an earlier question was deleted.
   - Editing a question's wording keeps its id. Replacing a question with a different one gets a new id.

3. **Keep question fields as they are**: `stem` (HTML allowed), `options` (list of strings, HTML allowed), `answer` (0-based index), `why` (HTML allowed, shown after answering). The Topic's `assets/quiz.js` already reads these.

4. **Relationships** are authored between Topics only, in `topic.yaml` under `relationships` as `{ from, to, type }` where `from` and `to` are Topic slugs and `type` is one of `requires`, `extends`, `contrasts-with`, `applies`. The build accepts Lesson and Reference sheet ids too (`<topic-slug>/<lesson-stem>`, `<topic-slug>/reference/<stem>`), but they make the Graph too dense, so leave them unused. Links inside Lessons become `mentions` automatically. Run `/kyu-rios-propose-relationships` after publishing a Topic to connect it to the others.
