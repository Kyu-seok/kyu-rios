---
name: kyu-rious-backup-teach-notes
description: Copy the gitignored teacher-facing files (MISSION.md, NOTES.md, RESOURCES.md, learning-records/) of every Topic to a backup folder.
disable-model-invocation: true
argument-hint: "[backup directory, default ~/Backups/kyu-rious-teach-notes]"
---

# Back up the teacher's notes

`topics/*/MISSION.md`, `topics/*/NOTES.md`, `topics/*/RESOURCES.md` and `topics/*/learning-records/` are gitignored because the repo is public, so they exist only on this laptop. They are the teacher's memory of the learner; losing them means `/teach` starts every Topic from scratch.

1. **Pick the destination.** The argument, else `~/Backups/kyu-rious-teach-notes`. Create it if needed. Done when the directory exists and is outside the repo.
2. **Copy.** From the repo root:

   ```bash
   rsync -a --delete --prune-empty-dirs \
     --include='*/' --include='MISSION.md' --include='NOTES.md' --include='RESOURCES.md' --include='learning-records/**' --exclude='*' \
     topics/ "<dest>/topics/"
   ```

   `--delete` keeps the backup a mirror, so a Topic deleted on purpose disappears from the backup too. Done when the command exits 0.
3. **Verify.** Count the files on both sides and show the numbers:

   ```bash
   find topics -path '*/learning-records/*' -o -name MISSION.md -o -name NOTES.md -o -name RESOURCES.md | grep -v node_modules | wc -l
   find "<dest>/topics" -type f | wc -l
   ```

   Done when the two counts match. Report the destination and the count in one line.

**Restore** is the same `rsync` with source and destination swapped and without `--delete`, run only on the user's say-so.
