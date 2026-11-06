window.QUIZ = [
  {
    id: "agent-orchestration/2/q1",
    stem: "The Java compiler rejects the agent's code because it doesn't type-check. Is the compiler a guide or a sensor?",
    options: ["A guide (feedforward)","A sensor (feedback)"],
    answer: 1,
    why: "It checks the work <em>after</em> the agent acts and reports back, so it's a sensor. It's also <em>computational</em>: deterministic and cheap.",
    section: "warmup"
  },
  {
    id: "agent-orchestration/2/q2",
    stem: "An <code>AGENTS.md</code> that explains how to build and run the app. Guide or sensor?",
    options: ["A guide (feedforward)","A sensor (feedback)"],
    answer: 0,
    why: "Words written in advance to steer the agent <em>before</em> it acts are a guide.",
    section: "warmup"
  },
  {
    id: "agent-orchestration/2/q3",
    stem: "A reviewer agent reads the diff and lists bugs it found. Guide or sensor?",
    options: ["A guide (feedforward)","A sensor (feedback)"],
    answer: 1,
    why: "It checks after the fact, so it's a sensor. Because it uses an LLM's judgment, Böckeler calls it an <em>inferential</em> sensor.",
    section: "warmup"
  },
  {
    id: "agent-orchestration/2/q4",
    stem: "Which of these is <strong>graph engineering</strong>?",
    options: ["Claude decides mid-task to spawn one helper","Your script always runs searchers, then a verifier"],
    answer: 1,
    why: "In graph engineering <em>you</em> design the control flow in advance. A helper the model decides to spawn is a feature of the harness.",
    section: "warmup"
  },
  {
    id: "agent-orchestration/2/q5",
    stem: "You switch from Sonnet to Opus and keep everything else identical. What did you change?",
    options: ["The model, not the harness","The harness, not the model"],
    answer: 0,
    why: "Agent = Model + Harness. The harness is everything <em>except</em> the model, so swapping models leaves it untouched.",
    section: "warmup"
  },
  {
    id: "agent-orchestration/2/q6",
    stem: "A support bot sorts each message into <em>refund</em>, <em>technical</em> or <em>general</em>, and sends each type to its own specialised prompt.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 1,
    why: "Distinct categories that can be classified reliably, each with its own handler, is routing.",
    section: "l2"
  },
  {
    id: "agent-orchestration/2/q7",
    stem: "A bug fix whose set of files you can't know in advance. A lead model inspects the bug, decides which files need changes, and hands each one to a worker.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 3,
    why: "The subtasks are decided <em>at runtime from the input</em>. That's what separates orchestrator-workers from parallelization.",
    section: "l2"
  },
  {
    id: "agent-orchestration/2/q8",
    stem: "Turn release notes into a tweet: first summarise, then a code check rejects anything over 280 characters, then translate into Korean.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 0,
    why: "The same fixed steps every time, with a programmatic gate in between, is prompt chaining.",
    section: "l2"
  },
  {
    id: "agent-orchestration/2/q9",
    stem: "\"Make the failing CI pipeline green.\" Nobody knows how many steps it will take; the model must investigate, run commands and react to what it finds.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 5,
    why: "Open-ended work with an unpredictable number of steps, guided by feedback from the environment, needs an autonomous agent. Put a strong harness around it.",
    section: "l2"
  },
  {
    id: "agent-orchestration/2/q10",
    stem: "Three separate prompts each review the same code for security holes; the code is flagged if at least two of them agree.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 2,
    why: "The same task run several times and combined by vote is parallelization (the <em>voting</em> kind).",
    section: "l2"
  },
  {
    id: "agent-orchestration/2/q11",
    stem: "The model drafts SQL, a script runs it against test data and returns the errors, and the model revises until the query's output matches the expected rows.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 4,
    why: "Generate, check against clear criteria, give feedback, repeat. That's evaluator-optimizer, and here the evaluator is a deterministic sensor rather than an LLM.",
    section: "l2"
  }
];
