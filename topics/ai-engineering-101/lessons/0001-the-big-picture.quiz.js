window.QUIZ = [
  {
    id: "ai-engineering-101/1/q1",
    stem: "A coworker says, “I trained ChatGPT on our docs by pasting them into the chat.” Technically, what did they do?",
    options: ["Pre-trained a new model","Finetuned the existing weights","Prompt engineering via context","Ran post-training on it"],
    answer: 2,
    why: "Teaching a model through its input changes no weights, so it's prompt engineering. Pre-training, post-training, and finetuning all update weights."
  },
  {
    id: "ai-engineering-101/1/q2",
    stem: "Why could language models scale to huge datasets when supervised models like AlexNet couldn't?",
    options: ["Text data is smaller","Self-supervision makes labels free","Transformers need no data","Humans label text faster"],
    answer: 1,
    why: "With self-supervision, each next token is the label for the text before it, so any text on the internet becomes training data with no labeling cost."
  },
  {
    id: "ai-engineering-101/1/q3",
    stem: "Which of these is <em>not</em> one of Huyen's three shifts from ML engineering to AI engineering?",
    options: ["Focus on adapting models","Bigger, slower, costlier models","Open-ended outputs, harder evaluation","Less need for evaluation"],
    answer: 3,
    why: "It's the reverse. Open-ended outputs make evaluation <em>more</em> important and harder. Chapters 3 and 4 both cover it."
  },
  {
    id: "ai-engineering-101/1/q4",
    stem: "You're building a retailer's support bot: writing the system prompt, pulling in product docs, measuring answer quality. Which layer is that?",
    options: ["Application development","Model development","Compute infrastructure","Dataset engineering"],
    answer: 0,
    why: "Prompts, context construction, evaluation, and interface are all application-layer work, and that's where you'll start."
  },
  {
    id: "ai-engineering-101/1/q5",
    stem: "Your app takes 4 seconds to respond and you need it under 1. Which responsibility and chapter is that?",
    options: ["Prompt engineering, Chapter 5","Model evaluation, Chapters 3–4","Inference optimization, Chapter 9","Dataset engineering, Chapter 8"],
    answer: 2,
    why: "Making models faster and cheaper is inference optimization. It matters more now because autoregressive models generate one token at a time."
  },
  {
    id: "ai-engineering-101/1/q6",
    stem: "Prompt engineering and finetuning are the two families of adaptation. What separates them?",
    options: ["Whether data is labeled","Whether weights get updated","Whether output is text","Whether model is open-source"],
    answer: 1,
    why: "Prompt-based techniques (including RAG) leave the weights alone. Finetuning changes them."
  },
  {
    id: "ai-engineering-101/1/q7",
    stem: "With foundation models, what build order does Huyen say is now possible (Fig. 1-16)?",
    options: ["Data → model → product","Model → data → product","Data → product → model","Product → data → model"],
    answer: 3,
    why: "Build the product first, then invest in data and models once it shows promise. Traditional ML ran in the opposite order."
  }
];
