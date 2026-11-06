window.QUIZ = [
  {
    id: "ai-engineering-101/3/q1",
    stem: "Your AI essay grader gives the same essay very different scores across runs. Which temperature change helps, and why?",
    options: ["Raise it, flattening the probability distribution","Raise it, sharpening toward the top","Lower it, sharpening toward the top","Lower it, flattening the probability distribution"],
    answer: 2,
    why: "Dividing logits by a temperature below 1 widens the gaps between them, so the top token takes more probability (e.g. 73% → 88%). Temperature 0 is the greedy limit.",
    section: "check-1"
  },
  {
    id: "ai-engineering-101/3/q2",
    stem: "A support bot was finetuned on agent replies that quote internal ticket history the model never had access to. Now it invents ticket details. Which hallucination hypothesis fits best?",
    options: ["Self-delusion over its own output","Temperature was set too high","Top-p nucleus was too wide","Mismatch with labelers' private knowledge"],
    answer: 3,
    why: "The training responses relied on knowledge the model doesn't have, so it learned to produce confident details without a source. That's the knowledge-mismatch hypothesis (Gao, Schulman). Self-delusion would be the model building on its <em>own</em> earlier wrong sentence.",
    section: "check-1"
  },
  {
    id: "ai-engineering-101/3/q3",
    stem: "A model gets 10 coding problems and 3 samples per problem. For 6 problems, at least one sample passes every test. What's the score?",
    options: ["pass@1 = 60%","pass@3 = 20%","pass@3 = 60%","pass@3 = 18%"],
    answer: 2,
    why: "pass@k is the fraction of problems where <em>any</em> of the k samples passes, so 6/10 with k = 3. Expect pass@1 to be lower.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/3/q4",
    stem: "The reference is “1929.” For Anne Frank's birth year, the model says “September 12, 1929.” A <em>contains</em>-style exact match scores it as…",
    options: ["Correct, though factually wrong","Wrong, and actually wrong","Correct, and actually correct","Wrong, though actually correct"],
    answer: 0,
    why: "The output contains “1929,” so it passes, but the date is wrong (she was born June 12, 1929). Lenient matching can accept wrong answers.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/3/q5",
    stem: "The generated answer is “What's up?” and the reference is “How are you?”. What scores should you expect?",
    options: ["High lexical, low semantic","High lexical, high semantic","Low lexical, low semantic","Low lexical, high semantic"],
    answer: 3,
    why: "They share almost no tokens but mean nearly the same thing. That gap is why semantic similarity exists.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/3/q6",
    stem: "The AI judge's coherence score rose from 90% last month to 92% this month. Before you celebrate, check…",
    options: ["Whether users wrote longer prompts","Whether the judge prompt changed","Whether the benchmark is saturated","Whether perplexity went up too"],
    answer: 1,
    why: "A judge is a model plus a prompt. If someone edited the prompt or swapped the model, the change may be in the judge, not your app.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/3/q7",
    stem: "In pairwise comparisons, your judge keeps preferring whichever answer comes first. What's the fix?",
    options: ["Use a longer scoring scale","Ask for continuous numeric scores","Swap orders and rerun comparisons","Let the model judge itself"],
    answer: 2,
    why: "That's first-position bias. Run each comparison in both orders (or several), then aggregate.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/3/q8",
    stem: "Which judge setup does the chapter suggest will be most reliable?",
    options: ["Continuous 0–1 score, no examples","A 1–100 scale, no examples","1–10 scale, judged by itself","Good/bad labels with examples"],
    answer: 3,
    why: "Models handle text labels better than numbers, wide numeric ranges get worse, and examples improve consistency. Self-judging adds self-bias.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/3/q9",
    stem: "In side-by-side tests, model B beats model A 51% of the time, and B costs twice as much. What do you actually know?",
    options: ["Which wins, not whether either's good","B is good enough to ship","B resolves 51% more support tickets","B is worth the 2× cost"],
    answer: 0,
    why: "Comparative evaluation ranks models but doesn't measure absolute quality. You need other evaluations to do the cost–benefit math.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/3/q10",
    stem: "A model has suspiciously <em>low</em> perplexity on a public benchmark's test questions. What's the most likely reason?",
    options: ["The model was heavily post-trained","The benchmark leaked into training","The benchmark text is gibberish","The model's vocabulary is huge"],
    answer: 1,
    why: "Memorized text is easy to predict. The other three would all <em>raise</em> perplexity.",
    section: "check-2"
  }
];
