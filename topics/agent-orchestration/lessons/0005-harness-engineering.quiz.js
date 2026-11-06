window.QUIZ = [
  {
    id: "agent-orchestration/5/q1",
    stem: "Tomorrow's brand-new session must know today's decisions. Which context fix?",
    options: ["Compaction","Structured note-taking","Subagent"],
    answer: 1,
    why: "Only on-disk notes survive into a fresh session.",
    section: "warmup"
  },
  {
    id: "agent-orchestration/5/q2",
    stem: "Four checkers you hard-coded run simultaneously on each PR, and then a script <strong>sends</strong> any failures back to the author agent to fix.",
    options: ["Parallelization then routing","Parallelization then evaluator-optimizer"],
    answer: 1,
    why: "Fixed simultaneous list = parallelization; work sent back = evaluator-optimizer. Real systems combine shapes.",
    section: "warmup"
  },
  {
    id: "agent-orchestration/5/q3",
    stem: "Which is a <strong>harness</strong> change rather than a <strong>graph</strong> change?",
    options: ["Add a linter the agent runs","Wire a verifier after three agents"],
    answer: 0,
    why: "A sensor around one agent is harness. Designing how several agents connect is graph.",
    section: "warmup"
  },
  {
    id: "agent-orchestration/5/q4",
    stem: "A type checker rejects the agent's code.",
    options: ["Computational guide","Computational sensor","Inferential guide","Inferential sensor"],
    answer: 1,
    why: "A deterministic program that checks after the agent acts.",
    section: "grid"
  },
  {
    id: "agent-orchestration/5/q5",
    stem: "A skill file describing your team's error-handling conventions.",
    options: ["Computational guide","Computational sensor","Inferential guide","Inferential sensor"],
    answer: 2,
    why: "Text that steers before acting, and it works only if the model interprets it.",
    section: "grid"
  },
  {
    id: "agent-orchestration/5/q6",
    stem: "A reviewer agent asks \"is this over-engineered?\" about each diff.",
    options: ["Computational guide","Computational sensor","Inferential guide","Inferential sensor"],
    answer: 3,
    why: "A judgment of meaning, made after the agent acts, by an LLM.",
    section: "grid"
  },
  {
    id: "agent-orchestration/5/q7",
    stem: "A script that generates the boilerplate for a new service before the agent starts writing it.",
    options: ["Computational guide","Computational sensor","Inferential guide","Inferential sensor"],
    answer: 0,
    why: "Deterministic, and it shapes the work before the agent acts.",
    section: "grid"
  },
  {
    id: "agent-orchestration/5/q8",
    stem: "<code>CLAUDE.md</code> saying \"never use <code>System.out.println</code>; use the logger.\"",
    options: ["Computational guide","Computational sensor","Inferential guide","Inferential sensor"],
    answer: 2,
    why: "Even a strict-sounding rule in CLAUDE.md is inferential, because the model can ignore it. To enforce it, add a lint rule (computational sensor).",
    section: "grid"
  },
  {
    id: "agent-orchestration/5/q9",
    stem: "A structural test failing whenever the UI layer imports the database layer directly.",
    options: ["Computational guide","Computational sensor","Inferential guide","Inferential sensor"],
    answer: 1,
    why: "A mechanical architecture check after the change, like OpenAI's layer rules.",
    section: "grid"
  },
  {
    id: "agent-orchestration/5/q10",
    stem: "The CLAUDE.md already says \"use the logger,\" yet the agent keeps adding <code>println</code> calls.",
    options: ["Add a guide","Add a sensor","Add a state file"],
    answer: 1,
    why: "The guide exists and is being ignored. Make it computational: a lint rule that fails and says \"use the logger.\"",
    section: "fix"
  },
  {
    id: "agent-orchestration/5/q11",
    stem: "Every new session spends 10 minutes working out how to start the app and run the tests.",
    options: ["Add a guide","Add a sensor","Add a state file"],
    answer: 0,
    why: "Tell it up front: a short AGENTS.md/CLAUDE.md section or an <code>init.sh</code>, like Anthropic's harness. That steers before it acts.",
    section: "fix"
  },
  {
    id: "agent-orchestration/5/q12",
    stem: "A fresh session sees half the features built and announces \"the project is complete.\"",
    options: ["Add a guide","Add a sensor","Add a state file"],
    answer: 2,
    why: "It can't see what's left. A feature list with every item marked <code>passes: false</code> makes the remaining work visible to a fresh window.",
    section: "fix"
  },
  {
    id: "agent-orchestration/5/q13",
    stem: "The agent marks a feature done after unit tests pass, but the page is broken in a real browser.",
    options: ["Add a guide","Add a sensor","Add a state file"],
    answer: 1,
    why: "The existing sensor is too weak. Anthropic added end-to-end browser testing and bug detection improved a lot.",
    section: "fix"
  }
];
