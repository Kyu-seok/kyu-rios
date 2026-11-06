window.QUIZ = [
  {
    id: "matt-pocock-skills/1/q1",
    stem: "You asked for \"export to CSV\". The agent built a polished export to JSON with a settings page. Which skill would have prevented it?",
    options: ["<code>/improve-codebase-architecture</code>","<code>/grill-with-docs</code>","<code>/tdd</code>","<code>/diagnosing-bugs</code>"],
    answer: 1,
    why: "The code may work fine, but it isn't what you wanted. That's failure #1. The fix happens before any code is written: an interview that settles every decision."
  },
  {
    id: "matt-pocock-skills/1/q2",
    stem: "Which skill comes right after <code>/to-spec</code> in a multi-session build?",
    options: ["<code>/implement</code>","<code>/code-review</code>","<code>/retro</code>","<code>/to-tickets</code>"],
    answer: 3,
    why: "Spec, then tickets, then implement. <code>/to-tickets</code> splits the spec into tracer-bullet tickets with blocking edges, so each <code>/implement</code> run can start fresh."
  },
  {
    id: "matt-pocock-skills/1/q3",
    stem: "The agent says \"done\", but the feature breaks the first time you click it. Which skill targets this failure most directly?",
    options: ["<code>/tdd</code>","<code>/grill-me</code>","<code>/to-spec</code>","<code>/handoff</code>"],
    answer: 0,
    why: "Failure #3: the agent had no feedback loop. With the red → green loop, a failing test exists before the code, so \"done\" means a test passes."
  },
  {
    id: "matt-pocock-skills/1/q4",
    stem: "Which of these skills is <em>model-invoked</em>, meaning the agent can reach for it by itself?",
    options: ["<code>/to-spec</code>","<code>/grill-me</code>","<code>/code-review</code>","<code>/to-tickets</code>"],
    answer: 2,
    why: "<code>/code-review</code> holds reusable discipline, so the agent may pick it up. <code>/to-spec</code>, <code>/to-tickets</code> and <code>/grill-me</code> orchestrate work and run only when you type them."
  },
  {
    id: "matt-pocock-skills/1/q5",
    stem: "You're planning a talk outline on a train, with no repository open. Which grilling skill fits?",
    options: ["<code>/grill-with-docs</code>","<code>/grill-me</code>","<code>/wayfinder</code>","<code>/prototype</code>"],
    answer: 1,
    why: "<code>/grill-me</code> is stateless. With no repo, there's nowhere for <code>/grill-with-docs</code> to write <code>GLOSSARY.md</code> and ADRs. In a repo, <code>/grill-with-docs</code> is strictly better."
  },
  {
    id: "matt-pocock-skills/1/q6",
    stem: "You're working through tickets one <code>/implement</code> at a time. What do you do between tickets?",
    options: ["Run /compact between tickets","Run /handoff between tickets","Run /clear between tickets","Keep one long session"],
    answer: 2,
    why: "Each ticket is self-contained, so the last ticket's context is disposable. Clearing gives every build a fresh, sharp context window."
  },
  {
    id: "matt-pocock-skills/1/q7",
    stem: "A user-invoked skill wants to reuse the interview behaviour. Which may it call?",
    options: ["Model-invoked <code>/grilling</code>","User-invoked <code>/grill-me</code>","User-invoked <code>/to-spec</code>","User-invoked <code>/triage</code>"],
    answer: 0,
    why: "User-invoked skills may call model-invoked ones, but never another user-invoked one. That's why <code>/grill-me</code> is a one-line wrapper around <code>/grilling</code>."
  },
  {
    id: "matt-pocock-skills/1/q8",
    stem: "Every week the agent finds the codebase a bit harder to change, and new features touch ten files each. Which skill should you run?",
    options: ["<code>/diagnosing-bugs</code>","<code>/wait-what</code>","<code>/to-tickets</code>","<code>/improve-codebase-architecture</code>"],
    answer: 3,
    why: "Failure #4, the ball of mud. It looks for deepening opportunities: more behaviour behind smaller interfaces. Pocock suggests running it every few days."
  }
];
