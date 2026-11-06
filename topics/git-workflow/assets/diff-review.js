/* Spot-the-issue diff review drill: click lines to flag them, submit, see what you caught and missed.
   Usage:
     <div class="diff-review" id="dr"></div>
     <script src="../assets/diff-review.js"></script>
     <script>DiffReview.mount('#dr', {
       title: 'PR #12 · Add retry',             // optional
       lines: [
         { t: 'file', s: 'api.py' },              // file header
         { t: ' ', s: 'import requests' },        // context
         { t: '+', s: 'import time', issue: 'unused' },
         { t: '-', s: 'old line' },
       ],
       issues: { unused: 'Explanation shown after submitting' }
     });</script>
   An issue counts as caught if any line tagged with it is flagged. Untagged flagged lines are reported, not penalised. */
(function () {
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function mount(selector, spec) {
    const root = document.querySelector(selector);
    if (!root) return;
    root.innerHTML = '';
    if (spec.title) root.appendChild(el('div', 'dr-title', spec.title));

    const flagged = new Set();
    let submitted = false;
    const table = el('div', 'dr-diff');
    const rows = spec.lines.map((line, i) => {
      if (line.t === 'file') { const h = el('div', 'dr-file', esc(line.s)); table.appendChild(h); return h; }
      const kind = line.t === '+' ? 'add' : line.t === '-' ? 'del' : 'ctx';
      const row = el('button', 'dr-line ' + kind, `<span class="dr-sign">${line.t === ' ' ? '&nbsp;' : line.t}</span><span class="dr-code">${esc(line.s) || '&nbsp;'}</span>`);
      row.type = 'button';
      row.title = 'Click to flag this line';
      row.addEventListener('click', () => {
        if (submitted) return;
        flagged.has(i) ? flagged.delete(i) : flagged.add(i);
        row.classList.toggle('flagged', flagged.has(i));
      });
      table.appendChild(row);
      return row;
    });
    root.appendChild(table);

    const bar = el('div', 'cd-bar');
    const submit = el('button', 'step-toggle cd-btn', 'Submit review');
    const retry = el('button', 'step-toggle cd-btn', 'Start over');
    submit.type = retry.type = 'button';
    retry.hidden = true;
    bar.appendChild(submit); bar.appendChild(retry);
    root.appendChild(bar);
    const out = el('div', 'dr-result');
    root.appendChild(out);

    submit.addEventListener('click', () => {
      if (!flagged.size) { out.innerHTML = 'Flag at least one line first: click any line in the diff.'; return; }
      submitted = true;
      submit.hidden = true; retry.hidden = false;
      const keys = Object.keys(spec.issues);
      const caught = keys.filter(k => spec.lines.some((l, i) => l.issue === k && flagged.has(i)));
      spec.lines.forEach((l, i) => {
        if (l.issue) rows[i].classList.add(caught.includes(l.issue) ? 'hit' : 'miss');
      });
      const extra = [...flagged].filter(i => !spec.lines[i].issue).length;
      out.innerHTML = `<p class="dr-score">You caught <strong>${caught.length} of ${keys.length}</strong> planted issues.` +
        (extra ? ` You also flagged ${extra} other line${extra > 1 ? 's' : ''}. That’s fine if you can say why.` : '') + '</p>' +
        '<ul>' + keys.map(k => `<li class="${caught.includes(k) ? 'ok' : 'no'}"><strong>${caught.includes(k) ? 'Caught' : 'Missed'}:</strong> ${spec.issues[k]}</li>`).join('') + '</ul>';
    });
    retry.addEventListener('click', () => mount(selector, spec));
  }

  window.DiffReview = { mount };
})();
