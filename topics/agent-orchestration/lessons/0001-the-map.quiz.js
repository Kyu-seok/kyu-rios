window.QUIZ = [
  {
    id: "agent-orchestration/1/q1",
    stem: "A bash script restarts Claude Code with the same <code>PROMPT.md</code> every time it exits, until <code>fix_plan.md</code> has no items left.",
    options: ["Prompt engineering","Context engineering","Harness engineering","Loop engineering","Graph engineering"],
    answer: 3,
    why: "One agent, one job, rerun until a stop condition. This is the Ralph loop."
  },
  {
    id: "agent-orchestration/1/q2",
    stem: "Late in a long session the agent forgets earlier decisions. You have it write decisions to <code>NOTES.md</code> and clear old tool output from the window.",
    options: ["Prompt engineering","Context engineering","Harness engineering","Loop engineering","Graph engineering"],
    answer: 1,
    why: "You are curating which tokens are in the window: structured note-taking and clearing tool results are context-engineering techniques."
  },
  {
    id: "agent-orchestration/1/q3",
    stem: "Three reviewer agents audit a pull request in parallel, a verifier confirms their findings, a fixer applies them, and the tests decide whether to ship or loop back.",
    options: ["Prompt engineering","Context engineering","Harness engineering","Loop engineering","Graph engineering"],
    answer: 4,
    why: "Several loops connected by handoffs, parallel branches and a veto is a graph."
  },
  {
    id: "agent-orchestration/1/q4",
    stem: "You add a pre-commit linter whose error messages explain how to fix the violation, and a <code>CLAUDE.md</code> that describes the module layout.",
    options: ["Prompt engineering","Context engineering","Harness engineering","Loop engineering","Graph engineering"],
    answer: 2,
    why: "CLAUDE.md is a guide (feedforward) and the linter is a sensor (feedback). Both shape the environment the agent works in."
  },
  {
    id: "agent-orchestration/1/q5",
    stem: "You rewrite a single request so it includes an example of the exact output format you want back.",
    options: ["Prompt engineering","Context engineering","Harness engineering","Loop engineering","Graph engineering"],
    answer: 0,
    why: "Changing the wording of one message is prompt engineering, the innermost level."
  },
  {
    id: "agent-orchestration/1/q6",
    stem: "In <em>Agent = Model + Harness</em>, which of these is <strong>not</strong> part of the harness?",
    options: ["The project's CLAUDE.md file","The repository's test suite","The model's trained weights","The permitted tool list"],
    answer: 2,
    why: "The harness is everything except the model. The weights <em>are</em> the model; the rest is harness you can change today."
  }
];
