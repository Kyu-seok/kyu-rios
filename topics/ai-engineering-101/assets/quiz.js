// Multiple-choice quiz with instant feedback.
//
// Markup:
//   <div class="quiz">
//     <div class="q" data-answer="2">            <!-- 0-based index of the correct option -->
//       <p class="q-prompt">Question?</p>
//       <div class="q-options"><button>A</button><button>B</button>…</div>
//       <div class="q-feedback">Why the right answer is right.</div>
//     </div>
//   </div>
// One attempt per question; the explanation is shown either way. A score line
// and a "Retry quiz" button are appended to each .quiz.
//
// Data-driven form (the Quiz convention of this repo):
//   <div class="quiz" data-quiz="check-1"></div>
//   <script src="NNNN-lesson.quiz.js"></script>   <!-- window.QUIZ = [{ id, stem, options, answer, why, section? }] -->
//   <script>Quiz.mount(document.querySelector('.quiz[data-quiz="check-1"]'), window.QUIZ);</script>
// Quiz.mount builds the markup above from the questions, then wires it up the same way.
(function () {
  function setup(quiz) {
    const questions = [...quiz.querySelectorAll(".q")];
    const score = document.createElement("p");
    score.className = "quiz-score";
    const retry = document.createElement("button");
    retry.textContent = "Retry quiz";
    retry.className = "quiz-retry";
    retry.style.cssText = "font:600 .85rem var(--sans);margin-left:.8rem;cursor:pointer;background:none;border:1px solid var(--rule);border-radius:4px;padding:.3rem .7rem;color:var(--fg)";
    let answered = 0, correct = 0;

    const render = () => {
      score.textContent = answered === questions.length
        ? `Score: ${correct} / ${questions.length}. Missed ones? Re-read that section, then retry tomorrow.`
        : `Answered ${answered} of ${questions.length}`;
      if (answered === questions.length) score.appendChild(retry);
    };

    questions.forEach((q) => {
      const answer = Number(q.dataset.answer);
      const buttons = [...q.querySelectorAll(".q-options button")];
      const feedback = q.querySelector(".q-feedback");
      buttons.forEach((b, i) => b.addEventListener("click", () => {
        buttons.forEach((x) => (x.disabled = true));
        buttons[answer].classList.add("correct");
        const ok = i === answer;
        if (!ok) b.classList.add("wrong");
        if (feedback) {
          feedback.classList.add("show", ok ? "ok" : "no");
          if (!feedback.querySelector(".q-verdict")) {
            const v = document.createElement("strong");
            v.className = "q-verdict";
            feedback.prepend(v);
          }
          feedback.querySelector(".q-verdict").textContent = (ok ? "Correct. " : "Not quite. ");
        }
        answered++; if (ok) correct++;
        render();
      }));
    });

    retry.addEventListener("click", () => {
      answered = correct = 0;
      questions.forEach((q) => {
        q.querySelectorAll(".q-options button").forEach((b) => { b.disabled = false; b.classList.remove("correct", "wrong"); });
        const f = q.querySelector(".q-feedback");
        if (f) f.classList.remove("show", "ok", "no");
      });
      render();
      quiz.scrollIntoView({ behavior: "smooth" });
    });

    quiz.appendChild(score);
    render();
  }

  function mount(root, questions) {
    if (!root) return;
    root.textContent = "";
    questions.forEach((item) => {
      const q = document.createElement("div");
      q.className = "q";
      q.dataset.answer = String(item.answer);
      const prompt = document.createElement("p");
      prompt.className = "q-prompt";
      prompt.innerHTML = item.stem ?? item.q;
      const options = document.createElement("div");
      options.className = "q-options";
      item.options.forEach((text) => {
        const b = document.createElement("button");
        b.innerHTML = text;
        options.appendChild(b);
      });
      const feedback = document.createElement("div");
      feedback.className = "q-feedback";
      feedback.innerHTML = item.why;
      q.append(prompt, options, feedback);
      root.appendChild(q);
    });
    setup(root);
  }

  // Markup quizzes set themselves up on load; data-driven ones wait for Quiz.mount.
  document.querySelectorAll(".quiz:not([data-quiz])").forEach(setup);
  window.Quiz = { mount };
})();
