window.QUIZ = [
  {
    id: "matt-pocock-skills/5/q1",
    stem: "A test for the webhook retry worker asserts that your own <code>backoff.compute()</code> helper was called three times. What's wrong with it?",
    options: ["It's tautological by its construction","It's horizontal slicing of tests","It's coupled to the implementation","Nothing, it's a good test"],
    answer: 2,
    why: "Asserted call counts on your own module. Inline the helper and the test breaks, even though behaviour is the same.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/5/q2",
    stem: "The spec says failed webhooks retry 5 times. The code retries 3 times. Which axis reports it?",
    options: ["Spec axis: implemented wrongly","Standards axis: documented breach","Standards axis: Mysterious Name","Neither: built-in bug hunt"],
    answer: 0,
    why: "A requirement that looks implemented but behaves wrongly. The finding quotes the spec line.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/5/q3",
    stem: "A proposed ticket says: <em>\"Add a <code>retry_count</code> column to the webhooks table.\"</em> What's wrong?",
    options: ["It needs blocking edges","It is too large","It's a horizontal slice","It should be prefactor"],
    answer: 2,
    why: "\"What can I demo?\" The column exists, but nobody can use it yet. That's one layer, not a tracer bullet.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/5/q4",
    stem: "During the retry-worker grilling, which question should the agent put to <em>you</em>?",
    options: ["Which BullMQ version is installed?","Where is the worker defined?","Does the repo use Vitest?","Should exhausted webhooks page on-call?"],
    answer: 3,
    why: "That's a decision, so it's yours. The other three are facts a subagent can look up.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/5/q5",
    stem: "Mid-implementation, not at a boundary, the context is getting heavy. What do you do?",
    options: ["Compact now to free room","Continue, or split into subagents","Clear and reread the diff","Hand off to fresh session"],
    answer: 1,
    why: "Mid-phase there's no decision to make. Compacting now makes the agent lose the thread.",
    section: "costs"
  },
  {
    id: "matt-pocock-skills/5/q6",
    stem: "Which move is the only one that keeps the session as a primary source?",
    options: ["<code>/compact</code>","<code>/handoff</code>","Continue","<code>/clear</code>"],
    answer: 2,
    why: "Every other move swaps the conversation for a summary of it, or for nothing. That's why continue is checked first.",
    section: "costs"
  },
  {
    id: "matt-pocock-skills/5/q7",
    stem: "You ran <code>/clear</code> after a decision-heavy build. A week later you wonder why snoozes live in Redis. What did the clear cost you?",
    options: ["The why behind the build","The code you just committed","The tickets on the tracker","The glossary terms you wrote"],
    answer: 0,
    why: "Rereading the diff won't give the why back (although the old session can still be resumed). Decisions meant to last belong in ADRs.",
    section: "costs"
  },
  {
    id: "matt-pocock-skills/5/q8",
    stem: "You'll continue tomorrow in Codex from a <code>/handoff</code> file. What's the main risk?",
    options: ["It copies the whole spec","It leaks your API keys","Codex cannot read markdown files","Temp dir may get cleared"],
    answer: 3,
    why: "It writes to the OS temp directory, which reboots and some harnesses empty. Copy the file somewhere durable.",
    section: "costs"
  },
  {
    id: "matt-pocock-skills/5/q9",
    stem: "The handoff says <em>\"the retry worker isn't built yet.\"</em> Nobody checked that. What do you do?",
    options: ["Trust it, the agent knows","Downgrade it to an assumption","Delete the whole handoff doc","Paste it into shell command"],
    answer: 1,
    why: "The next agent won't recheck it. A belief written as a fact becomes a false premise for everything that follows.",
    section: "costs"
  },
  {
    id: "matt-pocock-skills/5/q10",
    stem: "You're at the boundary before QA, and the tree lands on <code>/compact</code>. How do you make the summary keep what matters?",
    options: ["Run /compact twice in succession","Compact earlier, during the phase","Tell /compact what comes next","Use /handoff in same directory"],
    answer: 2,
    why: "<code>/compact we're going to QA this area</code>. The instruction decides what survives the summary.",
    section: "costs"
  }
];
