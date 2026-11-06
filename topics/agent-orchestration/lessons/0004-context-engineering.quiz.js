window.QUIZ = [
  {
    id: "agent-orchestration/4/q1",
    stem: "A model writes a SQL query; a script runs it, and if it errors, the error message goes <strong>back</strong> to the model to fix the query.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 4,
    why: "The work is sent back to be redone (key Q2), so it's evaluator-optimizer. Compare Lesson 3's Q9, where the check only stopped the work.",
    section: "warmup"
  },
  {
    id: "agent-orchestration/4/q2",
    stem: "A translation step runs, then a script stops the pipeline if the output is empty; otherwise the next step formats it.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 0,
    why: "The check only decides continue or stop, and nothing goes back. That's a gate in a chain.",
    section: "warmup"
  },
  {
    id: "agent-orchestration/4/q3",
    stem: "You hard-code four checkers (security, style, tests, docs) that run at the same time on every PR.",
    options: ["Prompt chaining","Routing","Parallelization","Orchestrator-workers","Evaluator-optimizer","Autonomous agent"],
    answer: 2,
    why: "Simultaneous calls on a list <em>you</em> fixed in code: parallelization (sectioning).",
    section: "warmup"
  },
  {
    id: "agent-orchestration/4/q4",
    stem: "A failing test is run after the agent's edit and its output tells the agent what broke. In harness terms, the test is a…",
    options: ["guide that steers beforehand","sensor that checks afterward"],
    answer: 1,
    why: "It checks after the agent acts and feeds back, so it's a sensor.",
    section: "warmup"
  },
  {
    id: "agent-orchestration/4/q5",
    stem: "Three hours into a session, the window is mostly old build logs. You want to keep going in the same session, just leaner.",
    options: ["Compaction","Structured note-taking","Subagent"],
    answer: 0,
    why: "Summarise and continue (or clear old tool results). In Claude Code that's <code>/compact</code>.",
    section: "l4"
  },
  {
    id: "agent-orchestration/4/q6",
    stem: "You need to know how authentication works across a 400-file repo, but you don't want 400 files of reading in your main window.",
    options: ["Compaction","Structured note-taking","Subagent"],
    answer: 2,
    why: "Send a helper to read in its own window and return a short summary. The main window stays clean.",
    section: "l4"
  },
  {
    id: "agent-orchestration/4/q7",
    stem: "Tomorrow a <em>brand-new</em> session must know which features are done and which decisions were made today.",
    options: ["Compaction","Structured note-taking","Subagent"],
    answer: 1,
    why: "Compaction lives inside one session. Only something written to disk, like a progress file, survives into a fresh one.",
    section: "l4"
  },
  {
    id: "agent-orchestration/4/q8",
    stem: "Why does an agent get worse late in a long session even though its window isn't full?",
    options: ["Recall weakens as context grows","The model's weights slowly change"],
    answer: 0,
    why: "That's context rot: attention is a finite budget. The weights never change during a session, since they are the model, not the harness.",
    section: "l4"
  },
  {
    id: "agent-orchestration/4/q9",
    stem: "A Ralph loop starts every iteration with a completely fresh window. Where does its memory between iterations live?",
    options: ["In a summary of last window","In files and git on disk"],
    answer: 1,
    why: "Ralph pushes \"memory outside the window\" to the extreme: plan, specs and commits on disk, and nothing carried over in context.",
    section: "l4"
  }
];
