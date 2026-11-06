window.QUIZ = [
  {
    id: "matt-pocock-skills/7/q1",
    stem: "The double-processing loop is red, and the hypotheses are ranked and confirmed. The agent proposes the fix. What has to come first?",
    options: ["A regression test that's red","A /retro on the session","A wayfinder map for it","A fresh /clear of context"],
    answer: 0,
    why: "Write the regression test before the fix, at a correct seam. If there's no correct seam, that's the finding (see below).",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/7/q2",
    stem: "<code>/to-tickets</code> returns five tickets: schema, repository, service, controller, UI. What's wrong?",
    options: ["Too few blocking edges","Missing the agent label","Layers, not vertical slices","Should be one ticket"],
    answer: 2,
    why: "Horizontal slicing. Nothing can be demoed until ticket 5. Each tracer-bullet ticket cuts through every layer.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/7/q3",
    stem: "<code>/to-spec</code> just wrote the spec, using 60k tokens. Next is <code>/to-tickets</code>. Which move?",
    options: ["/clear, since spec is saved","/handoff to a new session","/compact, then run /to-tickets","Continue in the same window"],
    answer: 3,
    why: "/to-tickets wants the spec's reasoning verbatim (a primary source), and there's plenty of smart zone left.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/7/q4",
    stem: "In <code>/tdd</code>, the agent mocks your own in-process <code>PriceCalculator</code> class inside the checkout tests. OK?",
    options: ["Yes: mocks keep tests fast","No: mock only system boundaries","Yes: every collaborator gets mocked","No: mocks are always banned"],
    answer: 1,
    why: "It's an in-process dependency, so test through it. Mocks belong at system boundaries, the \"true external\" kind in this lesson.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/7/q5",
    stem: "The architecture report has nine cards, and every one is badged <code>Speculative</code>. What does that tell you?",
    options: ["Work through all nine now","Rerun it with bigger model","It found nothing worth doing","Grill each one in turn"],
    answer: 2,
    why: "The skill rarely says \"fine,\" because it exists to output findings. All Speculative is how it says nothing is wrong.",
    section: "inside"
  },
  {
    id: "matt-pocock-skills/7/q6",
    stem: "You picked a card, and grilling settled on a deepened interface. What's the next step?",
    options: ["Refactor right now in session","Take the decision to /to-spec","Pick the next card here","Ask it to apply diffs"],
    answer: 1,
    why: "The output is a decision, not a diff. It goes into the main flow: /to-spec → /to-tickets → /implement. Use one candidate per session.",
    section: "inside"
  },
  {
    id: "matt-pocock-skills/7/q7",
    stem: "You reject a candidate: \"workers stay split, because ops deploys them separately.\" What should happen?",
    options: ["Add a line to CLAUDE.md","Just say not right now","Delete the HTML report file","Record it as an ADR"],
    answer: 3,
    why: "It's a lasting, load-bearing reason, so future runs would otherwise suggest it again. \"Not right now\" is the ephemeral kind that gets no ADR.",
    section: "inside"
  },
  {
    id: "matt-pocock-skills/7/q8",
    stem: "A fresh session: <code>/codebase-design</code> \"redesign the job module, go.\" What typically goes wrong?",
    options: ["It invents a long process","It refuses without a glossary","It edits CLAUDE.md files first","It asks one question only"],
    answer: 0,
    why: "It's a reference with no process and no stopping rule. Run a driver skill, such as /improve-codebase-architecture, and let it use the vocabulary.",
    section: "inside"
  },
  {
    id: "matt-pocock-skills/7/q9",
    stem: "Retro: the agent keeps calling <code>new Redis()</code> inside handlers. Which fix does <code>/retro</code> default to?",
    options: ["Add a CLAUDE.md warning line","Write a rule in CODING_STANDARDS.md","Add a custom lint rule","Ask the implementer to remember"],
    answer: 2,
    why: "It's mechanical, a banned API in a fixed place. \"Default to building the check over writing the rule.\"",
    section: "inside"
  },
  {
    id: "matt-pocock-skills/7/q10",
    stem: "Your session is at 180k tokens and out of the smart zone, but it was a rough one. How do you retro it?",
    options: ["Run /retro right here anyway","Skip retro; nothing to learn","/compact first, then run /retro","/clear, then retro the log"],
    answer: 3,
    why: "Compacting would throw away the struggles retro needs. Clear, then point a fresh /retro at the old session's log, which is the primary source.",
    section: "inside"
  },
  {
    id: "matt-pocock-skills/7/q11",
    stem: "Why does a judgement-call rule go to the reviewer instead of into <code>CLAUDE.md</code>?",
    options: ["The implementer cannot read markdown","Reviewer has least context pressure","CLAUDE.md is too short already","Standards only matter after merging"],
    answer: 1,
    why: "The implementer explores, codes, and debugs under the most pressure. The reviewer gets only a diff. CLAUDE.md loads into every session, so it holds navigation pointers.",
    section: "inside"
  }
];
