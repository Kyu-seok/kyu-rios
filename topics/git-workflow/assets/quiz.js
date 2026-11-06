/* Reusable retrieval-practice quiz.
   Usage:
     <div class="quiz" data-quiz-id="0001"></div>
     <script src="../assets/quiz.js"></script>
     <script>Quiz.mount('[data-quiz-id="0001"]', [
       { q: "Prompt (HTML allowed)", options: ["A", "B", "C", "D"], answer: 2, why: "Explanation shown after answering" },
     ]);</script>
   The first click on each question locks it in, so the score reflects genuine recall. */
(function () {
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function mount(selector, questions) {
    const root = document.querySelector(selector);
    if (!root) return;
    let answered = 0, correct = 0;
    root.innerHTML = '';
    const score = el('div', 'q-score');
    score.hidden = true;

    questions.forEach((item, i) => {
      const box = el('div', 'q');
      box.appendChild(el('div', 'q-prompt', `<strong>${i + 1}.</strong> ${item.stem ?? item.q}`));
      const opts = el('div', 'q-options');
      const fb = el('div', 'q-feedback');
      const buttons = item.options.map((text, j) => {
        const b = el('button', 'q-option', text);
        b.type = 'button';
        b.addEventListener('click', () => {
          buttons.forEach(x => (x.disabled = true));
          const ok = j === item.answer;
          b.classList.add(ok ? 'correct' : 'wrong');
          buttons[item.answer].classList.add('correct');
          fb.innerHTML = (ok ? '<strong class="ok">Correct.</strong> ' : '<strong class="no">Not quite.</strong> ') + (item.why || '');
          answered++; if (ok) correct++;
          if (answered === questions.length) {
            score.hidden = false;
            score.innerHTML = `You recalled <strong>${correct} / ${questions.length}</strong>. ` +
              (correct === questions.length ? 'Come back in a few days and try again, before you look at the notes.'
                : 'Reread the explanations above, then retry tomorrow. A spaced retry builds more memory than an immediate one.');
            const retry = el('button', 'step-toggle q-retry', 'Retry');
            retry.type = 'button';
            retry.addEventListener('click', () => mount(selector, questions));
            score.appendChild(retry);
          }
        });
        opts.appendChild(b);
        return b;
      });
      box.appendChild(opts);
      box.appendChild(fb);
      root.appendChild(box);
    });
    root.appendChild(score);
  }

  window.Quiz = { mount };
})();
