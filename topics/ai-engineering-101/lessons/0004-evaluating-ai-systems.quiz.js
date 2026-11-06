window.QUIZ = [
  {
    id: "ai-engineering-101/4/q1",
    stem: "20 problems, 5 samples each. For 12 problems, at least one sample passes every test. What's pass@5?",
    options: ["12%","24%","60%","15%"],
    answer: 2,
    why: "pass@k counts <em>problems</em>, not samples: 12 of 20 problems solved = 60%. The number of samples (5) only says how many tries each problem got.",
    section: "check-1"
  },
  {
    id: "ai-engineering-101/4/q2",
    stem: "Users prefer reply B over reply A in 70% of side-by-side matchups. Does that tell you B is good enough to ship?",
    options: ["Yes, if A was already in production","No, it only says B is better","Yes, a 70% win rate guarantees quality","No, comparisons only work for code tasks"],
    answer: 1,
    why: "Comparative evaluation ranks; it doesn't grade. B could be the better of two bad options. You still need an absolute check against your criteria.",
    section: "check-1"
  },
  {
    id: "ai-engineering-101/4/q3",
    stem: "Reference: “The meeting is cancelled.” Output: “We called off the meeting.” Which metric rates it most fairly?",
    options: ["Semantic similarity: the meaning matches","Exact match: both mention meetings","Lexical similarity: words mostly overlap","Perplexity: the output is fluent"],
    answer: 0,
    why: "The words barely overlap, so exact and lexical metrics punish a correct answer. Embeddings capture that “called off” ≈ “cancelled.”",
    section: "check-1"
  },
  {
    id: "ai-engineering-101/4/q4",
    stem: "Your team wants to start building a support bot this week and “figure out evaluation later.” What would Huyen push for?",
    options: ["Ship first, then add evaluation later","Define what good means before building","Pick the top leaderboard model first","Finetune a model on support transcripts"],
    answer: 1,
    why: "Evaluation-driven development: an app nobody can evaluate is worse than no app, because you can't tell if it helps and it's costly to remove.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/4/q5",
    stem: "You call a hosted model API, and responses are two seconds too slow. For you, latency is a…",
    options: ["soft attribute you can simply tune","benchmark score you should ignore entirely","business metric, not an evaluation one","hard attribute you can’t optimize much"],
    answer: 3,
    why: "You can't optimize someone else's serving stack, so latency is hard for you. (You can still trim it a little with shorter outputs.) If you hosted the model, it would be soft.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/4/q6",
    stem: "A brand-new model tops a benchmark that was published two years before the model was trained. What should you suspect first?",
    options: ["Benchmark questions leaked into its training","The benchmark is simply too hard","Its tokenizer favors the benchmark’s format","Leaderboards always favor the newest models"],
    answer: 0,
    why: "Benchmark data published before training is likely in web-scraped training data. That's contamination, and it's usually accidental.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/4/q7",
    stem: "You want to check a model for contamination, but you have no access to its training data. Which approach still works?",
    options: ["N-gram overlap against training data","Ask the model about it","Perplexity on the benchmark text","Exact match on benchmark answers"],
    answer: 2,
    why: "N-gram overlap needs the training data. Perplexity only needs the model: unusually low perplexity means the text is suspiciously easy to predict. (This is the Lesson 3 idea, used for a real job.)",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/4/q8",
    stem: "Your résumé app (PDF→text, then text→current employer) gets the employer right 60% of the time. What do you do first?",
    options: ["Score the two steps separately first","Switch to a bigger, stronger model","Add more résumés to the prompt","Raise the temperature for more variety"],
    answer: 0,
    why: "Without per-component evaluation you don't know whether text extraction or employer extraction is failing, so any fix is a guess.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/4/q9",
    stem: "On your 100-example eval set, prompt B beats prompt A by 3 points. Ship B?",
    options: ["Yes, any improvement on real data counts","No, prompts can only be compared pairwise","Yes, 100 examples is the standard minimum","Not yet, a 3-point gap needs ~1,000"],
    answer: 3,
    why: "At 100 examples, a 3-point gap is mostly noise. You saw it in the simulator: the eval picks the truly better prompt only about two-thirds of the time.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/4/q10",
    stem: "Model A scores higher overall, but model B wins on <em>both</em> free and paid users. What's going on, and what do you do?",
    options: ["Trust the overall number; slices are noise","Compare per slice; the overall can mislead","Average the slices to break the tie","Rerun with a higher judge temperature setting"],
    answer: 1,
    why: "Simpson's paradox: the slices have different sizes, so the aggregate flips. Slicing is how you catch it.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/4/q11",
    stem: "Running the same evaluation twice gives 81% and then 74%. Your AI judge runs at temperature 0.9. First fix?",
    options: ["Add more criteria to the rubric","Switch the judge to comparative mode","Set the judge’s temperature to 0","Average both runs and report 77.5%"],
    answer: 2,
    why: "A reliable pipeline gives the same result twice. High temperature makes the judge itself random. Pin it to 0 and log its configuration. (Lessons 2 and 3 meet here.)",
    section: "check-2"
  }
];
