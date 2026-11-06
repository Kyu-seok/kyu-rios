/* Predict-the-guardrail drill: given a set of active rules, decide whether each action is allowed or blocked.
   Usage:
     <div class="rules-drill" id="drill"></div>
     <script src="../assets/rules-drill.js"></script>
     <script>RulesDrill.mount('#drill', {
       title: 'Ruleset “protect-main” on main',
       rules: ['Require a pull request (0 approvals)', 'Require status check: test'],
       cases: [ { action: 'HTML allowed', answer: 'blocked' | 'allowed', why: 'Explanation shown after answering' } ]
     });</script>
   The first click on each case locks it in, as in quiz.js. */
(function () {
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function mount(selector, cfg) {
    const root = document.querySelector(selector);
    if (!root) return;
    let answered = 0, correct = 0;
    root.innerHTML = '';

    const head = el('div', 'rd-rules');
    head.appendChild(el('div', 'rd-title', cfg.title));
    const ul = el('ul');
    cfg.rules.forEach(r => ul.appendChild(el('li', null, r)));
    head.appendChild(ul);
    root.appendChild(head);

    const score = el('div', 'q-score');
    score.hidden = true;

    cfg.cases.forEach((c, i) => {
      const row = el('div', 'rd-case');
      row.appendChild(el('div', 'rd-action', `<strong>${i + 1}.</strong> ${c.action}`));
      const bar = el('div', 'rd-bar');
      const fb = el('div', 'q-feedback');
      const buttons = ['allowed', 'blocked'].map(choice => {
        const b = el('button', 'q-option rd-' + choice, choice === 'allowed' ? 'Allowed' : 'Blocked');
        b.type = 'button';
        b.addEventListener('click', () => {
          buttons.forEach(x => (x.disabled = true));
          const ok = choice === c.answer;
          b.classList.add(ok ? 'correct' : 'wrong');
          buttons.find(x => x.classList.contains('rd-' + c.answer)).classList.add('correct');
          fb.innerHTML = (ok ? '<strong class="ok">Correct.</strong> ' : '<strong class="no">Not quite.</strong> ') + (c.why || '');
          answered++; if (ok) correct++;
          if (answered === cfg.cases.length) {
            score.hidden = false;
            score.innerHTML = `You predicted <strong>${correct} / ${cfg.cases.length}</strong> correctly.`;
            const retry = el('button', 'step-toggle q-retry', 'Retry');
            retry.type = 'button';
            retry.addEventListener('click', () => mount(selector, cfg));
            score.appendChild(retry);
          }
        });
        bar.appendChild(b);
        return b;
      });
      row.appendChild(bar);
      row.appendChild(fb);
      root.appendChild(row);
    });
    root.appendChild(score);
  }

  window.RulesDrill = { mount };
})();
