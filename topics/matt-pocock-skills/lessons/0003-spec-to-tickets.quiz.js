window.QUIZ = [
  {
    id: "matt-pocock-skills/3/q1",
    stem: "Before Round 1, the agent asks <em>\"when a Channel snooze ends, digest or each Notification?\"</em> What went wrong?",
    options: ["It skipped the recommended answer","It should have used grill-me","It asked beyond the frontier","It never wrote an ADR"],
    answer: 2,
    why: "That question depends on D1 (Channel or Notification?), which isn't settled yet. Each round asks only the frontier.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/3/q2",
    stem: "You've just finished one ticket with <code>/implement</code>. What comes before the next ticket?",
    options: ["<code>/clear</code>, then a fresh run","<code>/compact</code>, then continue the run","<code>/retro</code>, then the next ticket","<code>/handoff</code> to a teammate first"],
    answer: 0,
    why: "Each ticket is sized for one fresh context window. <code>/clear</code> between tickets means every run starts with a clean context.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/3/q3",
    stem: "Which decision passes all three ADR tests?",
    options: ["Format the snooze dates using date-fns","Hold snoozes in Redis, not Postgres","Store Notifications in Postgres, as usual","Name the button \"Snooze\" for clarity"],
    answer: 1,
    why: "Hard to reverse, surprising (everything else is in Postgres), and a real trade-off. The Postgres one is hard to reverse, but it's the obvious choice.",
    section: "warmup"
  },
  {
    id: "matt-pocock-skills/3/q4",
    stem: "Nothing has been built yet. Which tickets are on the frontier?",
    options: ["Tickets 01 and 02 both","Ticket 01 and nothing else","Tickets 01 through 05 inclusive","All six tickets at once"],
    answer: 1,
    why: "Only 01 has no blockers. 02 waits for the prefactor, and everything else waits for 02.",
    section: "edges"
  },
  {
    id: "matt-pocock-skills/3/q5",
    stem: "01 and 02 are done. How many fresh sessions can you open in parallel?",
    options: ["One: just ticket 03","Two: 03 and 04","Four: 03 through 06","Three: 03, 04, 05"],
    answer: 3,
    why: "03, 04 and 05 are each blocked only by 02. 06 still waits for 03.",
    section: "edges"
  },
  {
    id: "matt-pocock-skills/3/q6",
    stem: "The agent proposes making 04 (urgent bypass) blocked by 03 (presets). What do you say?",
    options: ["Accept it, edges are cheap","Remove it, nothing gates 04","Merge both into one ticket","Split 04 into two tickets"],
    answer: 1,
    why: "Urgent bypass doesn't need the presets to work. A fake edge shrinks the frontier and serialises work that could run in parallel.",
    section: "edges"
  },
  {
    id: "matt-pocock-skills/3/q7",
    stem: "Ticket 02 lists the criterion <em>\"existing Notifications still deliver normally.\"</em> What's wrong with it?",
    options: ["It needs a file path","It belongs in the spec","It already passes before work","It should be ticket 01"],
    answer: 2,
    why: "A criterion that's true at the base commit grades nothing. For each criterion, name the observation that would show it false, and check that it fails before the work starts.",
    section: "edges"
  },
  {
    id: "matt-pocock-skills/3/q8",
    stem: "You've grilled a small change: one setting and one test. It easily fits in one context window. What's next?",
    options: ["Run /to-spec, then /to-tickets","Run /implement right here","Run /to-tickets straight away","Run /clear, then /to-spec"],
    answer: 1,
    why: "The spec and tickets only pay for themselves on multi-session work. Here they'd just add a step where the model can drift.",
    section: "boundary"
  },
  {
    id: "matt-pocock-skills/3/q9",
    stem: "The spec says <em>\"snoozes sync across devices.\"</em> You never discussed that. What is it?",
    options: ["A helpful agent addition","A future ticket candidate","An ADR to write","A defect to remove"],
    answer: 3,
    why: "The spec records decisions. It never makes them. Anything you didn't decide is a defect, and it's a sign the grilling missed a branch.",
    section: "boundary"
  },
  {
    id: "matt-pocock-skills/3/q10",
    stem: "You only have time to read two sections of the spec closely. Which two?",
    options: ["The seams and Out of Scope","Problem statement and the solution","User stories and further notes","The implementation and testing decisions"],
    answer: 0,
    why: "A wrong seam or a wrong scope line is cheapest to catch now and most expensive to find later. <code>/tdd</code> and <code>/code-review</code> both build on the seams.",
    section: "boundary"
  },
  {
    id: "matt-pocock-skills/3/q11",
    stem: "<code>/to-spec</code> has just published. Context is at 60%. What do you do before <code>/to-tickets</code>?",
    options: ["Run /compact before slicing it","Run /clear and refetch it","Keep going in this window","Hand off to fresh session"],
    answer: 2,
    why: "Keep both in one window. After a clear, the agent has to fetch a big spec back from the tracker, and that can truncate.",
    section: "boundary"
  }
];
