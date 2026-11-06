window.QUIZ = [
  {
    id: "matt-pocock-skills/8/q1",
    stem: "The agent's commit messages keep saying \"the record that marks a habit as done on a given day.\" Which failure mode is this?",
    options: ["Misaligned with you","No shared language","No feedback loop","Codebase is mud"],
    answer: 1,
    why: "Twenty words where one would do. Grilling should settle a term, <em>Check-in</em>, in <code>GLOSSARY.md</code>."
  },
  {
    id: "matt-pocock-skills/8/q2",
    stem: "While grilling, the agent asks you: \"Where does the app store habits today?\" How should it go?",
    options: ["You must answer it","Skip it as irrelevant","Agent should check code","Record it as ADR"],
    answer: 2,
    why: "Facts are the agent's job, and decisions are yours. <code>app.py</code> answers it: there's no storage yet."
  },
  {
    id: "matt-pocock-skills/8/q3",
    stem: "The spec contains a \"weekly goal\" feature that never came up in grilling. What is it?",
    options: ["Fine, specs should add ideas","It's a defect: remove it","Move it to a ticket","Triage it as an enhancement"],
    answer: 1,
    why: "<code>/to-spec</code> is a record of decisions already made. Invented content is a defect."
  },
  {
    id: "matt-pocock-skills/8/q4",
    stem: "<code>/to-tickets</code> proposes ticket 01: \"Install pytest and create the test folder.\" Is it a tracer bullet?",
    options: ["Yes: tests come first always","Yes: it unblocks everything else","No: it needs a spec","No: nothing to demo yet"],
    answer: 3,
    why: "\"What can I demo?\" Nothing. Fold the test setup into the first real slice (add and list a habit)."
  },
  {
    id: "matt-pocock-skills/8/q5",
    stem: "Ticket 04, which <code>/to-tickets</code> wrote yesterday, now looks thin. Do you run <code>/triage</code> on it?",
    options: ["Yes: triage every open ticket","Yes: thin tickets need triage","No: you created it yourself","No: delete and re-slice it"],
    answer: 2,
    why: "Triage is only for work you didn't create. Edit the ticket, or go back to the spec."
  },
  {
    id: "matt-pocock-skills/8/q6",
    stem: "Plugin installed. In Claude Code you type <code>/code-review</code> to review the streak branch. What's the risk?",
    options: ["Pocock's review, guaranteed every time","It errors: unknown skill name","Both reviews run and merge","You may get the built-in"],
    answer: 3,
    why: "The name clashes with Claude Code's own command. Call <code>mattpocock-skills:code-review</code> to get the two-axis review."
  },
  {
    id: "matt-pocock-skills/8/q7",
    stem: "The streak calculation is copied into two routes, slightly differently, and one copy has a bug. Which skill addresses the cause?",
    options: ["/retro on the session","/triage the duplicate code","/improve-codebase-architecture pointed at streaks","/wayfinder a streak map"],
    answer: 2,
    why: "The shape is the problem: no locality. Deepen it into one Streak module. Retro improves the environment, not the code."
  }
];
