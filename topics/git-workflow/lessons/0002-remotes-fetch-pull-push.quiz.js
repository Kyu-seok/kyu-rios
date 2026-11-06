window.QUIZ = [
  {
    id: "git-workflow/2/q1",
    stem: "You last ran a network command yesterday. Since then, teammates merged three PRs. What does <code>git status</code> say right now?",
    options: ["Up to date with origin/main","Behind origin/main by three","Diverged from origin/main now","Ahead of origin/main by three"],
    answer: 0,
    why: "<code>status</code> compares <code>main</code> with the bookmark <code>origin/main</code>, which hasn’t moved since your last fetch. It never contacts GitHub."
  },
  {
    id: "git-workflow/2/q2",
    stem: "What does <code>git fetch</code> change on your laptop?",
    options: ["Your files and your local main","The main branch stored on GitHub","Only your remote-tracking branches","Only files you edited since commit"],
    answer: 2,
    why: "Fetch downloads commits and moves <code>origin/*</code> bookmarks. Pro Git: it “will not modify your working directory at all.”"
  },
  {
    id: "git-workflow/2/q3",
    stem: "Which is closest to what <code>git pull</code> does?",
    options: ["git push, then a git fetch","git fetch, then integrate it","git status, then a git clone","git clone into a new folder"],
    answer: 1,
    why: "The docs: pull “runs <code>git fetch</code>” and then “integrates that branch into the current branch.”"
  },
  {
    id: "git-workflow/2/q4",
    stem: "<code>git push</code> says <code>! [rejected] main -&gt; main (fetch first)</code>. What does it mean?",
    options: ["Your network dropped mid-push","Your branch has no upstream set","You have uncommitted file edits","GitHub has commits you don’t have"],
    answer: 3,
    why: "Push only moves GitHub’s branch forward. If it holds commits yours lacks, you must bring them in (pull) before pushing."
  },
  {
    id: "git-workflow/2/q5",
    stem: "<code>git branch -a</code> lists <code>remotes/origin/old-fix</code>, but that branch was deleted on GitHub weeks ago. What cleans it up?",
    options: ["git branch -d old-fix","git pull origin old-fix","git fetch --prune","git push origin main"],
    answer: 2,
    why: "<code>--prune</code> removes remote-tracking refs that no longer exist on the remote. A plain fetch leaves them in place."
  },
  {
    id: "git-workflow/2/q6",
    stem: "An agent pushed <code>agent/fix-login</code> to GitHub ten minutes ago. Locally, <code>git branch -a</code> doesn’t show it. Why?",
    options: ["Your laptop hasn’t fetched since","Agents push to a hidden remote","Git hides branches made by bots","The branch needs a PR to appear"],
    answer: 0,
    why: "Your laptop learns about new remote branches only when it talks to GitHub. Run <code>git fetch</code>, then <code>git switch agent/fix-login</code>."
  }
];
