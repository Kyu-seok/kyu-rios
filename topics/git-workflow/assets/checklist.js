/* Persistent step checklist for hands-on lessons.
   Usage: <ol class="steps" data-checklist="lesson-0001"> <li><div class="step-title">Title</div> …</li> </ol>
   Adds a "Mark done" toggle to each step and remembers progress in localStorage (when available). */
(function () {
  function load(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: progress just isn't remembered */ }
  }

  document.querySelectorAll('ol.steps[data-checklist]').forEach(list => {
    const key = 'checklist:' + list.dataset.checklist;
    const done = new Set(load(key));
    const items = [...list.children];
    const progress = document.createElement('p');
    progress.className = 'progress';
    list.before(progress);

    function render() {
      items.forEach((li, i) => {
        li.classList.toggle('done', done.has(i));
        li.querySelector('.step-toggle').textContent = done.has(i) ? 'Undo' : 'Mark done';
      });
      progress.textContent = `${done.size} of ${items.length} steps done`;
    }

    items.forEach((li, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'step-toggle';
      btn.addEventListener('click', () => {
        done.has(i) ? done.delete(i) : done.add(i);
        save(key, [...done]);
        render();
      });
      (li.querySelector('.step-title') || li).appendChild(btn);
    });
    render();
  });
})();
