window.QUIZ = [
  {
    id: "agent-orchestration/3/q1",
    stem: "Incoming emails are <strong>sorted</strong> into <em>sales</em> or <em>support</em>, and each kind goes to a different prompt.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 1,
    why: "Key Q3: each input goes down one branch. \"Sorted into\" is the clue for routing."
  },
  {
    id: "agent-orchestration/3/q2",
    stem: "<strong>First</strong> extract the dates from a contract, <strong>then</strong> format them as a table, <strong>then</strong> write a summary.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 0,
    why: "Nothing goes back, nothing branches, nothing runs in parallel: fixed steps in order (Q6). \"First… then… then\" means chaining."
  },
  {
    id: "agent-orchestration/3/q3",
    stem: "An essay is drafted, a second model grades it against a rubric, and the draft is <strong>revised until</strong> it scores 8/10.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 4,
    why: "Key Q2: the work is sent back. \"Revised until\" is the clue for evaluator-optimizer."
  },
  {
    id: "agent-orchestration/3/q4",
    stem: "The same question is sent to <strong>five prompts at once</strong> and the most common answer wins.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 2,
    why: "Key Q4: the calls run simultaneously on a list you fixed (five copies). Combining them by vote makes this parallelization."
  },
  {
    id: "agent-orchestration/3/q5",
    stem: "\"Research this company.\" A <strong>lead model reads the request and decides</strong> which topics to investigate, then hands each topic to a helper.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 3,
    why: "Key Q5: a model writes the subtask list after seeing the input. That's orchestrator-workers."
  },
  {
    id: "agent-orchestration/3/q6",
    stem: "\"Find out why the server is slow.\" The model runs commands, reads logs and follows leads. <strong>Nobody knows how many steps</strong> it will take.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 5,
    why: "Key Q1: the model chooses its own steps, with no fixed plan. That's an autonomous agent."
  },
  {
    id: "agent-orchestration/3/q7",
    stem: "A blog post is checked by three prompts <strong>at the same time</strong>, one each for <em>grammar</em>, <em>facts</em> and <em>tone</em>, which you defined in code.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 2,
    why: "Key Q4: you fixed the three subtasks in advance and they run simultaneously. This is the sectioning kind of parallelization."
  },
  {
    id: "agent-orchestration/3/q8",
    stem: "Generated code is run against the tests; if any fail, the error output is <strong>sent back</strong> to the model to try again.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 4,
    why: "Key Q2: the work is sent back. Here the evaluator is the test suite, a sensor from Lesson 1."
  },
  {
    id: "agent-orchestration/3/q9",
    stem: "Write an outline, and a script <strong>rejects</strong> it if it has fewer than 3 sections. If it passes, write the full article.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 0,
    why: "Trap: the check doesn't send anything back; it only lets the work continue or stops it. That's a chaining gate."
  },
  {
    id: "agent-orchestration/3/q10",
    stem: "A refactor touches <strong>an unknown set of files</strong>; a lead model inspects the repo and assigns each affected file to its own worker.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 3,
    why: "Trap: it looks parallel, but a model decided the list after seeing the input (Q5), so it's orchestrator-workers."
  }
];
