window.QUIZ = [
  {
    id: "git-workflow/5/q1",
    stem: "You merged a PR on GitHub’s website. Before you run anything, where is your local <code>main</code>?",
    options: ["At the new merge commit","Where it was before the merge","Deleted along with the branch","Moved onto the feature branch"],
    answer: 1,
    why: "Nothing on your laptop moves until you talk to GitHub. <code>git switch main &amp;&amp; git pull</code> brings the merge down.",
    section: "warmup"
  },
  {
    id: "git-workflow/5/q2",
    stem: "GitHub deleted the PR branch. What does <code>git fetch --prune</code> remove on your laptop?",
    options: ["The local branch you worked on","Every branch other than main","Its stale origin/… bookmark","The merge commit from history"],
    answer: 2,
    why: "Prune deletes remote-tracking branches whose GitHub branch is gone. Your local branch stays until you delete it with <code>git branch -d</code>.",
    section: "warmup"
  },
  {
    id: "git-workflow/5/q3",
    stem: "An agent asks a question in the PR that isn’t part of the task. Before you merge, you should:",
    options: ["Ignore it; it isn’t the task","Answer it or file an issue","Make the agent fix it in this PR","Block the merge until it’s fixed"],
    answer: 1,
    why: "Every question gets an answer: a fix, an issue, or “won’t do”. Filing it as an issue keeps the PR on task and keeps a record of the question.",
    section: "warmup"
  },
  {
    id: "git-workflow/5/q4",
    stem: "Where must a GitHub Actions workflow file live for GitHub to run it?",
    options: ["In the repo root as ci.yml","Under .github/workflows/","In your GitHub settings page","Under .git/hooks on your laptop"],
    answer: 1,
    why: "“You must save the workflow files in a directory called <code>.github/workflows</code>.”",
    section: "main"
  },
  {
    id: "git-workflow/5/q5",
    stem: "Your workflow has <code>jobs: test:</code>. What do you enter as the ruleset’s required check?",
    options: ["tests.yml","Tests","pytest -q","test"],
    answer: 3,
    why: "Each job shows up as a check named after the job. The workflow’s <code>name:</code> (“Tests”) groups the jobs but isn’t the check name.",
    section: "main"
  },
  {
    id: "git-workflow/5/q6",
    stem: "Working solo, why require zero approvals instead of one?",
    options: ["Approvals cost extra minutes","You can’t approve your own PRs","Rulesets can’t count approvals","Zero is safer for public repos"],
    answer: 1,
    why: "“Pull request authors cannot approve their own pull requests.” Requiring one approval would stop every PR, including yours.",
    section: "main"
  },
  {
    id: "git-workflow/5/q7",
    stem: "You add yourself to the bypass list “just in case”. What else gets bypass?",
    options: ["Any agent using your login","Only the GitHub Actions bot","Nothing else; it’s just you","All public forks of the repo"],
    answer: 0,
    why: "GitHub can’t tell you apart from an agent holding your credentials. Leave the list empty.",
    section: "main"
  },
  {
    id: "git-workflow/5/q8",
    stem: "An agent’s PR edits <code>.github/workflows/tests.yml</code>. What should you assume?",
    options: ["Nothing; CI files are harmless","The check result can’t be trusted","GitHub rejects such edits","The ruleset reverts the file"],
    answer: 1,
    why: "The PR supplies the workflow file and the tests that are checked. Changes there can make a broken PR look green, so review them closely.",
    section: "main"
  },
  {
    id: "git-workflow/5/q9",
    stem: "A push to <code>main</code> was rejected. Your commit is still on local <code>main</code>. Cleanest fix?",
    options: ["Force-push it so it goes up","Delete the repo and clone it","New branch here, move main back","Add yourself to the bypass list"],
    answer: 2,
    why: "<code>git switch -c topic</code> keeps the commit on a new label. Then <code>git branch -f main origin/main</code> moves <code>main</code> back. Branches are pointers.",
    section: "main"
  }
];
