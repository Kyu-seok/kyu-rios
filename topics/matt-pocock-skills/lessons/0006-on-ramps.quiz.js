window.QUIZ = [
  {
    id: "matt-pocock-skills/6/q1",
    stem: "Your \"QA\" step is a script with written pass criteria: the CSV has 12 rows, and the header matches the spec. Can it run AFK?",
    options: ["No: QA always needs you","Yes: yardstick is written down","No: only reviews go AFK","Yes: but only after /compact"],
    answer: 1,
    why: "What decides it is whether the yardstick is written down, not whether the task is called QA or review. This \"QA\" is really a test, so a subagent can run it.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/6/q2",
    stem: "Mid-grilling, you need a UI prototype in a separate directory, and you want to keep this grilling session alive. Which move?",
    options: ["/handoff out and back","/compact then prototype here","/clear then start prototype","Subagent prototypes it AFK"],
    answer: 0,
    why: "A new directory plus a mid-phase fork. And a prototype is HITL, because its point is your reaction, so it can't go AFK.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/6/q3",
    stem: "Review flags a <code>retryPolicy</code> option that has exactly one implementation behind it. Which smell is it?",
    options: ["Feature Envy","Middle Man","Data Clumps","Speculative Generality"],
    answer: 3,
    why: "An abstraction for a need the spec doesn't have. Delete it and inline it until a real need shows up.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/6/q4",
    stem: "\"We use BullMQ, not Kafka, for job retries, because the ops team only runs Redis.\" ADR?",
    options: ["No: it's easy to reverse","No: nobody would be surprised","Yes: passes all three tests","No: it belongs in GLOSSARY.md"],
    answer: 2,
    why: "Hard to reverse, surprising without the ops context, and a real trade-off. It's a constraint you can't see in the code.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/6/q5",
    stem: "The loop is red. The agent offers a single hypothesis: <em>\"it's probably caching.\"</em> What's missing?",
    options: ["Ranked list of falsifiable ones","A second feedback loop command","A wayfinder map for this","A prototype of the cache"],
    answer: 0,
    why: "Write 3–5 ranked hypotheses, each with a prediction. A single hypothesis anchors on the first plausible idea, and one you can't falsify is just a vibe.",
    section: "inside"
  },
  {
    id: "matt-pocock-skills/6/q6",
    stem: "The bug only shows up when three callers race. The only test seam reaches one caller. What do you do about the regression test?",
    options: ["Write it there, it's better","Skip it, and say nothing","Record no seam as finding","Mock the other two callers"],
    answer: 2,
    why: "A shallow seam gives false confidence. The missing seam <em>is</em> the finding, and it's a job for <code>/improve-codebase-architecture</code>.",
    section: "inside"
  },
  {
    id: "matt-pocock-skills/6/q7",
    stem: "The wayfinder map has cleared: nothing is left to decide. What comes next?",
    options: ["/implement the map directly","/to-spec with the map","/triage each closed ticket","/to-tickets on each ticket"],
    answer: 1,
    why: "<code>/to-spec #&lt;map&gt;</code> collapses the linked decisions into a buildable plan. Looping the map straight into <code>/implement</code> throws that detail away.",
    section: "inside"
  },
  {
    id: "matt-pocock-skills/6/q8",
    stem: "During a wayfinder grilling ticket, the agent answers its own questions and closes the ticket. What broke?",
    options: ["It was a research ticket","It skipped the fog section","It forgot to claim it","HITL needs the human's side"],
    answer: 3,
    why: "A grilling ticket only resolves through a live exchange with you. The agent never stands in for the human's side.",
    section: "inside"
  },
  {
    id: "matt-pocock-skills/6/q9",
    stem: "<code>/triage</code> on a request: \"add CSV export.\" What does it check <em>before</em> any grilling?",
    options: ["Already built, or already rejected","Which tests the reporter wrote","How long the build takes","Who should implement the change"],
    answer: 0,
    why: "A redundancy search by domain concept, plus <code>.out-of-scope/</code> for past rejections. Then it verifies the claim, and only then grills.",
    section: "inside"
  },
  {
    id: "matt-pocock-skills/6/q10",
    stem: "The UI prototype answered the question. What happens to the prototype code?",
    options: ["Merge it into main as-is","Delete it once it's decided","Keep on a prototype branch","Turn it into tickets first"],
    answer: 2,
    why: "The validated decision goes into the real code. The prototype is kept as a primary source on <code>prototype/&lt;name&gt;</code>, linked from the issue.",
    section: "inside"
  }
];
