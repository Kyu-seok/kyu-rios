window.QUIZ = [
  {
    id: "git-workflow/4/q1",
    stem: "You want an agent to fix two problems before you’ll consider merging. Which review decision fits?",
    options: ["Approve, with comments attached","Request changes on the PR","Comment, then merge it now","Close the PR and reopen it"],
    answer: 1,
    why: "Request changes “flags feedback that the author should address before merging.” On your own PR (which includes agent PRs under your login) you can only Comment, so you just don’t merge yet."
  },
  {
    id: "git-workflow/4/q2",
    stem: "You’ve left five line comments with “Start a review” but haven’t submitted. Who can see them?",
    options: ["Only you, until you submit","Everyone with repo access","Only the PR’s author so far","Nobody, they’re saved offline"],
    answer: 0,
    why: "GitHub: “your line comments are pending and only visible to you.” Submitting sends them all at once with your decision."
  },
  {
    id: "git-workflow/4/q3",
    stem: "Claude Code opened a PR using your <code>gh</code> login. What happens if you run <code>gh pr review --approve</code>?",
    options: ["It approves and auto-merges","It approves as the agent","It asks for admin rights","It fails: authors can’t approve"],
    answer: 3,
    why: "“Pull request authors cannot approve their own pull requests.” GitHub treats the PR as yours because it was opened with your credentials."
  },
  {
    id: "git-workflow/4/q4",
    stem: "An agent’s PR adds a test that passes. What’s the most important question about that test?",
    options: ["Does it run in under a second?","Is it in the tests folder?","Would it fail if code broke?","Does it have a docstring?"],
    answer: 2,
    why: "Google’s guide: “Will the tests actually fail when the code is broken?” <code>assert result &gt; 0</code> passes for almost any bug."
  },
  {
    id: "git-workflow/4/q5",
    stem: "The PR description says “handles empty input”, but you see no code for that case. Best move?",
    options: ["Trust it; the agent wrote tests","Run it on empty input, then comment","Approve and fix it yourself later","Ignore it; descriptions are optional"],
    answer: 1,
    why: "Check claims against behaviour. One concrete failing input in a comment is the strongest feedback you can give."
  },
  {
    id: "git-workflow/4/q6",
    stem: "The agent pushes fix commits after your review. How do you see which files you need to re-check?",
    options: ["Reread every file from the top","Check the PR description again","Run git log on your main branch","Files GitHub has unmarked Viewed"],
    answer: 3,
    why: "GitHub: “If the file changes after you view the file, it will be unmarked as viewed.” Re-review only those files."
  }
];
