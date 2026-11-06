window.QUIZ = [
  {
    id: "matt-pocock-skills/4/q1",
    stem: "New feature: <em>\"export invoices as CSV.\"</em> Which proposed ticket is a tracer bullet?",
    options: ["Add invoice export columns to schema","Build every export endpoint in API","Download one month's invoices as CSV","Write all export tests after UI"],
    answer: 2,
    why: "It's the only one you can demo: a user clicks, and a file arrives. The others are each one layer.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/4/q2",
    stem: "While grilling the CSV export, the agent asks: <em>\"Does the project already have a CSV library?\"</em>",
    options: ["Tell it to check itself","Answer it, then keep going","Save it for later round","Switch over to grill-me instead"],
    answer: 0,
    why: "That's a fact about the code. A subagent looks it up, and the round continues with the decisions that don't depend on it.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/4/q3",
    stem: "A year in, every small change to billing touches eight files. Which of the four failures is this?",
    options: ["Misalignment with the user","No shared domain language","Accelerating entropy in codebase","Missing feedback loops entirely"],
    answer: 2,
    why: "Failure #4, the ball of mud. Shallow modules and Shotgun Surgery. <code>/improve-codebase-architecture</code> looks for deepening opportunities.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/4/q4",
    stem: "The CSV export grilling is done. It's one endpoint plus a button, and it fits in one window. What next?",
    options: ["Run /to-spec, then /to-tickets","Run /clear, then /to-spec","Run /to-tickets straight away","Run /implement right here"],
    answer: 3,
    why: "Spec and tickets only pay off on multi-session work. Stay in the window that holds the decisions.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/4/q5",
    stem: "<code>/implement</code> committed ticket 03 two days ago. Tickets 04 and 05 still look blocked. Why?",
    options: ["The blocking edges were wrong","Code review rejected the commit","It never closes the ticket","Ticket 04 needs re-triaging first"],
    answer: 2,
    why: "<code>/implement</code> ends at the commit. You close the ticket, and that's what lets the frontier advance.",
    section: "runs"
  },
  {
    id: "matt-pocock-skills/4/q6",
    stem: "Halfway through a run, you call <code>/code-review main</code> and it reports an empty diff. Why?",
    options: ["It only diffs committed work","The fixed point is wrong","It could not find spec","Both sub-agents crashed on startup"],
    answer: 0,
    why: "<code>main...HEAD</code> leaves out staged and working-tree changes. Commit first, then review.",
    section: "runs"
  },
  {
    id: "matt-pocock-skills/4/q7",
    stem: "<code>/tdd</code> asks you to choose between \"component seam\" and \"integration seam\". Nothing else is given. What do you do?",
    options: ["Pick the lowest level seam","Let the agent just decide","Skip testing for this ticket","Ask what each one misses"],
    answer: 3,
    why: "This is the most-reported friction with the skill (issue #607). Ask for the trade-offs first. It's also why seams are better agreed in <code>/to-spec</code>, where you can see the whole feature.",
    section: "runs"
  },
  {
    id: "matt-pocock-skills/4/q8",
    stem: "You typed <code>/code-review</code> in Claude Code and got a bug-hunt list, not Standards and Spec. Why?",
    options: ["The spec axis was skipped","The built-in skill ran instead","The repo has no standards","The fixed point was HEAD"],
    answer: 1,
    why: "Claude Code's own <code>/code-review</code> hunts bugs. With the plugin, Pocock's skill is <code>mattpocock-skills:code-review</code>.",
    section: "runs"
  },
  {
    id: "matt-pocock-skills/4/q9",
    stem: "The third <code>/code-review</code> pass still finds new smells. What now?",
    options: ["Keep looping until it's clean","Fix cited findings, then stop","Delete the smell baseline file","Switch to a bigger model"],
    answer: 1,
    why: "It never converges: every fix adds new code, and smells are judgement calls. Treat a pass as a list of leads.",
    section: "runs"
  },
  {
    id: "matt-pocock-skills/4/q10",
    stem: "The run writes five tests, then all the code to pass them. Which anti-pattern is this?",
    options: ["Horizontal slicing of the tests","Tautological expectations in the assertions","Implementation-coupled design of the tests","Mocking at a system boundary"],
    answer: 0,
    why: "Tests written in bulk check <em>imagined</em> behaviour. The loop is one test, one minimal implementation, repeat.",
    section: "runs"
  }
];
