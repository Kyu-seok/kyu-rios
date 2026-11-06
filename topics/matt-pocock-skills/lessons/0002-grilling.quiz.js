window.QUIZ = [
  {
    id: "matt-pocock-skills/2/q1",
    stem: "Which skill turns the grilling conversation into a spec, <em>without</em> interviewing you again?",
    options: ["<code>/to-tickets</code>","<code>/implement</code>","<code>/to-spec</code>","<code>/handoff</code>"],
    answer: 2,
    why: "<code>/to-spec</code> only synthesizes what you've already discussed. That's why grilling comes first, in the same context window.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/2/q2",
    stem: "The agent keeps writing long, roundabout descriptions of concepts in your project. Which failure is this?",
    options: ["Misalignment with the user","No shared domain language","Missing feedback loops entirely","Accelerating entropy in codebase"],
    answer: 1,
    why: "Failure #2. The fix is a <code>GLOSSARY.md</code> with one opinionated term per concept, which is what this lesson's section 3 builds.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/2/q3",
    stem: "What does <code>/retro</code> change after a session?",
    options: ["The agent's working environment","The code it wrote","The spec's open tickets","The PR's description text"],
    answer: 0,
    why: "Navigation, automated checks, coding standards, steering files. The next build starts from a better harness.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/2/q4",
    stem: "Mid-grilling, the agent asks: <em>\"Which test runner does this repo use?\"</em> What's the right response?",
    options: ["Answer it and continue","Tell it to check","Defer it until later","Restart using grill-me instead"],
    answer: 1,
    why: "Facts are the agent's job. It should dispatch a subagent and keep asking the decisions that don't depend on it.",
    section: "session"
  },
  {
    id: "matt-pocock-skills/2/q5",
    stem: "You say \"the <em>account</em> gets muted.\" Your <code>GLOSSARY.md</code> has both <strong>Customer</strong> and <strong>User</strong>. What should <code>/domain-modeling</code> do?",
    options: ["Add Account as a term","Assume you meant the Customer","Note it for after grilling","Ask which one you mean"],
    answer: 3,
    why: "Sharpen fuzzy language straight away and resolve the overloaded word to a canonical term. Don't guess, and don't batch it up for later.",
    section: "session"
  },
  {
    id: "matt-pocock-skills/2/q6",
    stem: "Which of these belongs in <code>GLOSSARY.md</code>?",
    options: ["<strong>Quiet Window</strong>: span a Channel stays snoozed","<strong>Timeout</strong>: how long a request may wait","<strong>RedisKey</strong>: stored under the <code>snooze:{id}</code> key","<strong>Retry</strong>: sending again after a delivery failure"],
    answer: 0,
    why: "Only terms specific to this project. Timeout and retry are general programming ideas, and a key format is an implementation detail.",
    section: "session"
  },
  {
    id: "matt-pocock-skills/2/q7",
    stem: "The agent has asked four rounds and proposes to start coding. What must happen first?",
    options: ["It writes the ADRs","It runs /to-tickets now","You confirm shared understanding","It compacts the context"],
    answer: 2,
    why: "Done means the frontier is empty <em>and</em> you've confirmed you're aligned. Then the main flow continues, often with <code>/to-spec</code>.",
    section: "session"
  }
];
