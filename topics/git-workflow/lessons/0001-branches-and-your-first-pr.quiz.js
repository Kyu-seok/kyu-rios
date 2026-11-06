window.QUIZ = [
  {
    id: "git-workflow/1/q1",
    stem: "You run <code>git switch -c fix-typo</code> and make one commit. Where does <code>main</code> point now?",
    options: ["At the new commit too","Still at its old commit","Nowhere until you push it","At a copy of files"],
    answer: 1,
    why: "A commit moves only the branch HEAD points to, which is <code>fix-typo</code>. <code>main</code> stays where it was."
  },
  {
    id: "git-workflow/1/q2",
    stem: "Which description of a Git branch is accurate?",
    options: ["A full copy of project files","A folder stored on GitHub only","A list of every changed file","A movable pointer to one commit"],
    answer: 3,
    why: "Pro Git: “a lightweight movable pointer to one of these commits.” It’s a tiny file holding a commit ID."
  },
  {
    id: "git-workflow/1/q3",
    stem: "What does <code>HEAD</code> tell you?",
    options: ["Which branch you currently have checked out","Which commit was pushed to GitHub last","Which file you most recently edited here","Which branch GitHub treats as the default"],
    answer: 0,
    why: "HEAD is “a pointer to the local branch you’re currently on.” <code>git branch</code> marks it with <code>*</code>."
  },
  {
    id: "git-workflow/1/q4",
    stem: "An AI agent finishes a task. In GitHub flow, how should its work reach <code>main</code>?",
    options: ["Agent pushes its commits straight to main","Agent emails a zip of the files","Through a reviewed pull request you merge","Agent copies files into the main folder"],
    answer: 2,
    why: "The agent works on its own branch and opens a PR. <code>main</code> moves only when a reviewer merges, and the reviewer is you."
  },
  {
    id: "git-workflow/1/q5",
    stem: "Why does GitHub flow recommend one branch per set of unrelated changes?",
    options: ["Reviews stay focused and delays stay isolated","Git cannot store more than one change","GitHub charges money for every branch commit","Branches get deleted automatically after a week"],
    answer: 0,
    why: "Small, separate branches are easier to review, and one delayed change doesn’t block the others."
  },
  {
    id: "git-workflow/1/q6",
    stem: "You merged a PR on GitHub. Your local <code>main</code> doesn’t have the change yet. What brings it in?",
    options: ["Run git push on your main branch","Delete the local repo and start over","Nothing, local main updates itself over time","Run git pull on your main branch"],
    answer: 3,
    why: "The merge happened on the remote, so you <code>git pull</code> to bring it down. Push goes the other way. Lesson 2 opens up what <code>pull</code> actually does."
  }
];
