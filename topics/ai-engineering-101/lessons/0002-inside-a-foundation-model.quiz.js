window.QUIZ = [
  {
    id: "ai-engineering-101/2/q1",
    stem: "In the three-layer stack, where does inference optimization live?",
    options: ["Application development layer","Model development layer","Infrastructure layer only","Outside the stack"],
    answer: 1,
    why: "Model development covers modeling and training, dataset engineering, and inference optimization.",
    section: "check-1"
  },
  {
    id: "ai-engineering-101/2/q2",
    stem: "With GPT-4's tokenizer, about how many words are 1,000 tokens?",
    options: ["About 250 words","About 1,333 words","About 750 words","About 1,000 words"],
    answer: 2,
    why: "A token averages about ¾ of a word, so 100 tokens ≈ 75 words. Worth remembering, because you'll pay and wait per token.",
    section: "check-1"
  },
  {
    id: "ai-engineering-101/2/q3",
    stem: "RAG adapts a model by…",
    options: ["Adding retrieved documents to context","Updating weights using retrieved documents","Pre-training on a private corpus","Distilling a smaller specialized model"],
    answer: 0,
    why: "RAG is prompt-based: it puts retrieved information into the input and leaves the weights alone.",
    section: "check-1"
  },
  {
    id: "ai-engineering-101/2/q4",
    stem: "A base model answers “How to make pizza” with “for a family of six?”. Which training stage fixes that?",
    options: ["Additional pre-training on web","Raising the sampling temperature","Adding a bigger vocabulary","Supervised finetuning on demonstrations"],
    answer: 3,
    why: "SFT on (prompt, response) demonstrations teaches the model to answer rather than just continue the text.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/2/q5",
    stem: "What data is an RLHF reward model typically trained on?",
    options: ["Labelers' 1–10 pointwise scores","Raw internet text completions","(prompt, winner, loser) comparisons","The model's own logprobs"],
    answer: 2,
    why: "Comparison data. Labelers are far more consistent at picking the better of two responses than at giving absolute scores.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/2/q6",
    stem: "The logits are [1, 2] and you lower the temperature from 1 to 0.5. What happens to token B's probability?",
    options: ["Rises from 73% to 88%","Falls from 73% to 60%","Stays fixed at 73% throughout","Jumps from 73% to 100%"],
    answer: 0,
    why: "Lower temperature sharpens the distribution toward the top token. It only reaches 100% in the greedy limit (temperature → 0).",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/2/q7",
    stem: "“Answer yes or no” needs about 2 candidates; “What's the meaning of life?” needs many. Which method adapts the pool size?",
    options: ["Fixed top-k sampling","Top-p nucleus sampling","Plain greedy sampling","Higher temperature scaling"],
    answer: 1,
    why: "Top-p keeps however many tokens it takes to reach cumulative probability p, so the pool shrinks or grows with the context.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/2/q8",
    stem: "You lowered the max token limit to save money, and now your JSON parser keeps failing. Why?",
    options: ["Temperature silently resets to zero","Model switches to completion mode","Tokenizer drops all special characters","Output cut before closing brackets"],
    answer: 3,
    why: "A fixed-length stopping condition can end generation mid-structure. Structured-output tooling and enough headroom prevent this.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/2/q9",
    stem: "Temperature 0, fixed seed, same prompt, yet a hosted API still sometimes returns a different answer. The likeliest cause?",
    options: ["The prompt was silently cached","Top-p always overrides temperature settings","Hardware differences between serving machines","Hallucination from labeler knowledge mismatch"],
    answer: 2,
    why: "Different machines execute the same operations slightly differently. With a hosted API you don't control the hardware.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/2/q10",
    stem: "The model writes “Chip Huyen is an architect,” then invents a whole architecture career. Which hypothesis does that illustrate?",
    options: ["Mismatch with labelers' private knowledge","Self-delusion over its own output","Temperature was set too low","Reward model scored it highly"],
    answer: 1,
    why: "Self-delusion: it conditions on its own wrong sentence as if it were a given fact, and the errors snowball.",
    section: "check-2"
  },
  {
    id: "ai-engineering-101/2/q11",
    stem: "Best-of-4 (generate 4 answers, keep the best) costs roughly…",
    options: ["About 2× the cost","About the same cost","About ½ the cost","About 4× the cost"],
    answer: 3,
    why: "Each extra sample is another full generation, so test-time compute trades money for quality.",
    section: "check-2"
  }
];
