# Shipping a change to the site

The one procedure that takes work in `topics/` or `site/` from this laptop to https://kyu-seok.github.io/kyu-rios/. Skills point here instead of restating it.

1. **Validate.** In `site/`, run `npm test`. It builds the Site from `topics/` against the build seam: manifests, Relationships, quiz ids, exclusions. Done when it passes. A failure names the file and the mistake; fix the file, never the test.
2. **Look at what will ship.** `git status --short` and `git diff --stat`. Done when every changed file is one you meant to change and none of the teacher-facing files (`NOTES.md`, `RESOURCES.md`, `learning-records/`) or an epub appears; they are gitignored, so if one shows up, the ignore rule broke and the push waits.
3. **Commit on `main`** with a message that names the Topic and the Lessons or Reference sheets added or changed. Done when `git status` is clean.
4. **Push and watch.** `git push`, then `gh run watch --exit-status` on the Deploy run (`gh run list --workflow deploy.yml --limit 1` gives its id). Done when the run reports success. The Test workflow runs in parallel; a failure there is a real failure even if Deploy is green.
5. **Open the live page** that changed (a new Lesson's URL is `topics/<slug>/lessons/<stem>.html` under the site). Done when it loads and its Quiz renders.
