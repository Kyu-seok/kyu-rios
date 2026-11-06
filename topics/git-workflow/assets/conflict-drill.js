/* Conflict-resolution drills: edit a conflicted file in the browser, get instant feedback.
   Usage:
     <div class="conflict-drill" id="drills"></div>
     <script src="../assets/conflict-drill.js"></script>
     <script>ConflictDrill.mount('#drills', [
       { title: 'Keep both', intent: 'HTML explaining what each side meant',
         text: 'a\n<<<<<<< HEAD\nb\n=======\nc\n>>>>>>> origin/main\n',
         accept: ['a\nb\nc', 'a\nc\nb'],        // any of these (whitespace-normalised) is correct
         ours: 'a\nb', theirs: 'a\nc',          // optional: recognised so feedback can say what was lost
         why: 'Shown once solved' },
     ]);</script>
   Comparison ignores trailing spaces, runs of spaces inside a line, and blank lines at the ends. */
(function () {
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  const norm = t => t.replace(/\r/g, '').split('\n').map(l => l.replace(/\s+/g, ' ').trimEnd()).join('\n').trim();
  const MARKER = /^(<{7}|={7}|>{7})/m;

  function mount(selector, drills) {
    const root = document.querySelector(selector);
    if (!root) return;
    root.innerHTML = '';

    drills.forEach((d, i) => {
      const box = el('div', 'cd');
      box.appendChild(el('div', 'cd-title', `<strong>Drill ${i + 1}.</strong> ${d.title}`));
      if (d.intent) box.appendChild(el('div', 'cd-intent', d.intent));
      const ta = el('textarea', 'cd-text');
      ta.value = d.text;
      ta.spellcheck = false;
      ta.rows = Math.max(4, d.text.split('\n').length + 1);
      box.appendChild(ta);

      const bar = el('div', 'cd-bar');
      const check = el('button', 'step-toggle cd-btn', 'Check resolution');
      const reset = el('button', 'step-toggle cd-btn', 'Reset file');
      const show = el('button', 'step-toggle cd-btn', 'Show a solution');
      [check, reset, show].forEach(b => { b.type = 'button'; bar.appendChild(b); });
      show.hidden = true;
      box.appendChild(bar);
      const fb = el('div', 'cd-feedback');
      box.appendChild(fb);

      let tries = 0;
      check.addEventListener('click', () => {
        const v = norm(ta.value);
        tries++;
        let msg, ok = false;
        if (MARKER.test(ta.value)) msg = 'Conflict markers are still in the file. Git does not check for them, so if you <code>git add</code> now they get committed as ordinary text.';
        else if (d.accept.some(a => norm(a) === v)) { ok = true; msg = d.why || 'Resolved.'; }
        else if (d.ours != null && norm(d.ours) === v) msg = 'That keeps only your side (above <code>=======</code>). Re-read the intent: what did the other side change that should survive?';
        else if (d.theirs != null && norm(d.theirs) === v) msg = 'That keeps only their side (below <code>=======</code>). Re-read the intent: did your own change need to survive too?';
        else msg = 'Markers are gone, but the result doesn’t match the intent yet. Compare each line to what both sides meant to do.';
        box.classList.toggle('solved', ok);
        fb.innerHTML = (ok ? '<strong class="ok">Resolved.</strong> ' : '<strong class="no">Not yet.</strong> ') + msg;
        if (!ok && tries >= 2) show.hidden = false;
      });
      reset.addEventListener('click', () => { ta.value = d.text; fb.innerHTML = ''; box.classList.remove('solved'); });
      show.addEventListener('click', () => { ta.value = d.accept[0] + '\n'; fb.innerHTML = 'One correct resolution is shown above. Press <em>Reset file</em> and try it yourself tomorrow.'; });
      root.appendChild(box);
    });
  }

  window.ConflictDrill = { mount };
})();
