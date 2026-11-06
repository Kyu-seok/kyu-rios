/* Three-box simulator for local ↔ remote sync: GitHub's main, your origin/main bookmark, your local main.
   Usage:
     <div class="remote-sim" id="sim"></div>
     <script src="../assets/remote-sim.js"></script>
     <script>RemoteSim.mount('#sim', {
       challenges: [ { text: 'Make git status say behind by 1', check: s => s.status().startsWith('Your branch is behind') && s.behind === 1 } ]
     });</script>
   Each ref holds the ordered list of commits it can reach. ahead/behind = set differences against origin/main,
   which is exactly what git status reports. pull follows git 2.39 defaults: it refuses to reconcile divergent branches
   unless told how (--no-rebase merges). */
(function () {
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

  function mount(selector, opts) {
    const root = document.querySelector(selector);
    if (!root) return;
    const challenges = (opts && opts.challenges) || [];
    let s, done, prev = null;

    function reset() {
      s = { remote: ['A', 'B'], tracking: ['A', 'B'], local: ['A', 'B'], next: 0, mine: new Set(), log: [] };
      done = new Set();
      prev = null;
      render(['$ git status', status()]);
    }
    const nextId = () => 'CDEFGHIJKLMNOPQRSTUVWXYZ'[s.next++] || '?';
    const has = (list, id) => list.includes(id);
    const sub = (a, b) => a.filter(x => !has(b, x));
    function counts() { return { ahead: sub(s.local, s.tracking).length, behind: sub(s.tracking, s.local).length }; }
    function status() {
      const { ahead, behind } = counts();
      if (!ahead && !behind) return "Your branch is up to date with 'origin/main'.";
      if (ahead && !behind) return `Your branch is ahead of 'origin/main' by ${plural(ahead, 'commit')}.`;
      if (!ahead && behind) return `Your branch is behind 'origin/main' by ${plural(behind, 'commit')}, and can be fast-forwarded.`;
      return `Your branch and 'origin/main' have diverged,\nand have ${ahead} and ${behind} different commits each, respectively.`;
    }

    const actions = {
      teammate() {
        const id = nextId();
        s.remote = [...s.remote, id];
        return ['(a teammate merges a PR on GitHub — nothing happens on your laptop)'];
      },
      commit() {
        const id = nextId();
        s.mine.add(id);
        s.local = [...s.local, id];
        return [`$ git commit -m "…"`, `[main ${id}] …`];
      },
      fetch() {
        const before = s.tracking.length;
        s.tracking = [...s.remote];
        return ['$ git fetch', s.tracking.length === before ? '(no output: nothing new on GitHub)' : `   ${s.tracking[before - 1]}..${s.tracking.at(-1)}  main -> origin/main`];
      },
      pull(merge) {
        const out = [merge ? '$ git pull --no-rebase' : '$ git pull'];
        s.tracking = [...s.remote];
        const { ahead, behind } = counts();
        if (!behind) out.push('Already up to date.');
        else if (!ahead) { s.local = [...s.tracking]; out.push('Fast-forward'); }
        else if (!merge) {
          out.push('hint: You have divergent branches and need to specify how to reconcile them.',
            'fatal: Need to specify how to reconcile divergent branches.');
        } else {
          const id = 'M' + (s.next++);
          s.mine.add(id);
          s.local = [...s.local, ...sub(s.tracking, s.local), id];
          out.push("Merge made by the 'ort' strategy.");
        }
        return out;
      },
      push() {
        const out = ['$ git push'];
        if (sub(s.remote, s.local).length) {
          out.push(' ! [rejected]        main -> main (' + (sub(s.remote, s.tracking).length ? 'fetch first' : 'non-fast-forward') + ')',
            'hint: Updates were rejected because the remote contains work that you do not have locally.');
        } else if (!sub(s.local, s.remote).length) out.push('Everything up-to-date');
        else { s.remote = [...s.local]; s.tracking = [...s.local]; out.push('   main -> main'); }
        return out;
      },
      status() { return ['$ git status', status()]; }
    };

    function chain(list, prev) {
      return list.map(id => {
        const cls = ['chip', s.mine.has(id) ? 'mine' : (id === 'A' || id === 'B' ? '' : 'theirs'), id[0] === 'M' ? 'merge' : '', prev && !has(prev, id) ? 'new' : ''].join(' ');
        return `<span class="${cls}">${id[0] === 'M' ? 'M' : id}</span>`;
      }).join('<span class="link">–</span>');
    }

    function render(lines) {
      const snap = prev;
      prev = { remote: s.remote, tracking: s.tracking, local: s.local };
      s.log = [...s.log, ...lines].slice(-14);
      const st = { status, ...counts() };
      challenges.forEach((c, i) => { if (!done.has(i) && c.check(st, s)) done.add(i); });

      root.innerHTML = '';
      const boxes = el('div', 'sim-boxes');
      [
        ['GitHub', 'main on origin', 'remote', 'Lives on github.com. Changes when anyone pushes or merges.'],
        ['Your laptop', 'origin/main', 'tracking', 'Your bookmark of GitHub. Moves only on fetch, pull, or push.'],
        ['Your laptop', 'main', 'local', 'Your branch. Moves when you commit, pull, or merge.']
      ].forEach(([where, name, key, note]) => {
        const b = el('div', 'sim-box ' + key);
        b.appendChild(el('div', 'sim-where', where));
        b.appendChild(el('div', 'sim-name', `<code>${name}</code>`));
        b.appendChild(el('div', 'sim-chain', chain(s[key], snap && snap[key])));
        b.appendChild(el('div', 'sim-note', note));
        boxes.appendChild(b);
      });
      root.appendChild(boxes);

      const bar = el('div', 'sim-buttons');
      [['Teammate merges a PR', 'teammate'], ['git commit', 'commit'], ['git fetch', 'fetch'], ['git pull', 'pull'],
        ['git pull --no-rebase', 'pullmerge'], ['git push', 'push'], ['git status', 'status']].forEach(([label, key]) => {
        const btn = el('button', 'step-toggle sim-btn' + (key === 'teammate' ? ' theirs' : ''), label);
        btn.type = 'button';
        btn.addEventListener('click', () => render(key === 'pullmerge' ? actions.pull(true) : actions[key]()));
        bar.appendChild(btn);
      });
      const r = el('button', 'step-toggle sim-btn', 'Reset');
      r.type = 'button';
      r.addEventListener('click', reset);
      bar.appendChild(r);
      root.appendChild(bar);

      root.appendChild(el('pre', 'sim-term', s.log.map(l => l.replace(/&/g, '&amp;').replace(/</g, '&lt;')).join('\n')));

      if (challenges.length) {
        const ul = el('ol', 'sim-challenges');
        challenges.forEach((c, i) => ul.appendChild(el('li', done.has(i) ? 'done' : '', c.text)));
        root.appendChild(el('div', 'sim-ch-title', `Challenges · ${done.size} of ${challenges.length} done`));
        root.appendChild(ul);
      }
    }
    reset();
  }

  window.RemoteSim = { mount };
})();
