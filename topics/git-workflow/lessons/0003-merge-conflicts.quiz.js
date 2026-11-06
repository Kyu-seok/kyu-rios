window.QUIZ = [
  {
    id: "git-workflow/3/q1",
    stem: "When does Git stop a merge and ask you to resolve a conflict?",
    options: ["Two branches touched the same repo","Two branches added different files","Both sides changed the same lines","Your branch is behind its upstream"],
    answer: 2,
    why: "Pro Git: when you “changed the same part of the same file differently.” Changes to different files or different parts of a file merge automatically."
  },
  {
    id: "git-workflow/3/q2",
    stem: "You’re on <code>fix-login</code> and run <code>git merge origin/main</code>. In a conflict block, what’s <em>above</em> the <code>=======</code>?",
    options: ["Your side, from fix-login","Their side, from origin/main","The version before both edits","Git’s suggested merged result"],
    answer: 0,
    why: "The top part is HEAD’s side, which is the branch you’re on. The bottom part comes from the branch you named, labelled after <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>."
  },
  {
    id: "git-workflow/3/q3",
    stem: "Partway through resolving, you realise you merged the wrong branch. What gets you back to before the merge?",
    options: ["git reset to the first commit","git push --force to GitHub","Delete the folder and re-clone","git merge --abort to back out"],
    answer: 3,
    why: "<code>--abort</code> tries to “reconstruct the pre-merge state.” Commit your work before merging so there’s nothing for it to lose."
  },
  {
    id: "git-workflow/3/q4",
    stem: "You’ve edited the file and removed every marker. What tells Git this file is resolved?",
    options: ["Saving the file in your editor","Running git add on that file","Running git status twice over","Pushing the branch to GitHub"],
    answer: 1,
    why: "Pro Git: “Staging the file marks it as resolved in Git.” Then <code>git commit</code> creates the merge commit."
  },
  {
    id: "git-workflow/3/q5",
    stem: "A PR on GitHub shows “This branch has conflicts that must be resolved”. Can you merge it now?",
    options: ["No, the merge button stays disabled","Yes, GitHub picks the newest side","Yes, but only with admin rights","Yes, conflicts are fixed after merge"],
    answer: 0,
    why: "GitHub: “You must resolve all merge conflicts before you can merge a pull request.” You resolve them on GitHub or locally, then push."
  },
  {
    id: "git-workflow/3/q6",
    stem: "Two agents edited the same function. Agent A’s PR is merged, and Agent B’s PR now conflicts. Best next step?",
    options: ["Revert A’s change to let B merge","Keep B’s side in every conflict","Merge main into B, resolve, review","Close B and redo the task by hand"],
    answer: 2,
    why: "Bring <code>main</code> into B’s branch, resolve so both changes survive, and review the result. An agent can do the resolving, but you check it."
  }
];
