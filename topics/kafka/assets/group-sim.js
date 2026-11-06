/* Consumer group simulator using the classic protocol's RangeAssignor:
   per topic, partitions in numeric order, consumers in lexicographic order, first few get one extra.
   Usage: GroupSim.mount(element) */
const GroupSim = {
  rangeAssign(consumers, topics) {
    const sorted = [...consumers].sort();
    const out = Object.fromEntries(sorted.map(c => [c, []]));
    if (!sorted.length) return out;
    topics.forEach(t => {
      const each = Math.floor(t.partitions / sorted.length);
      const extra = t.partitions % sorted.length;
      let next = 0;
      sorted.forEach((c, i) => {
        const take = each + (i < extra ? 1 : 0);
        for (let n = 0; n < take; n++) out[c].push(`${t.name}:${next++}`);
      });
    });
    return out;
  },

  mount(root) {
    const MAX_CONSUMERS = 8, MAX_PARTITIONS = 8;
    let topics, groups, message;
    const start = () => {
      topics = [{ name: 'orders', partitions: 3 }];
      groups = [
        { name: 'billing', consumers: ['c1', 'c2'], made: 2, rebalances: 0 },
        { name: 'analytics', consumers: [], made: 0, rebalances: 0 }
      ];
      message = 'Each group tracks its own members and assignment.';
    };
    start();
    root.className = 'sim';
    root.innerHTML = `
      <div class="sim-controls">
        <button data-a="partition">Add partition to orders</button>
        <button data-a="topic">Add topic refunds</button>
        <button data-a="reset">Reset</button>
      </div>
      <div class="gsim-groups"></div>
      <div class="sim-readout" aria-live="polite"></div>`;
    const grid = root.querySelector('.gsim-groups');
    const out = root.querySelector('.sim-readout');
    const self = this;

    const draw = () => {
      grid.textContent = '';
      groups.forEach((g, i) => {
        const box = document.createElement('div');
        box.className = 'gsim-group';
        const h = document.createElement('h4');
        h.textContent = `${g.name} `;
        const count = document.createElement('small');
        count.textContent = `${g.rebalances} rebalance${g.rebalances === 1 ? '' : 's'}`;
        h.append(count);
        box.append(h);
        const assigned = self.rangeAssign(g.consumers, topics);
        if (!g.consumers.length) {
          const none = document.createElement('div');
          none.className = 'gsim-empty';
          none.textContent = 'No members.';
          box.append(none);
        }
        Object.entries(assigned).forEach(([c, parts]) => {
          const row = document.createElement('div');
          row.className = 'gsim-member' + (parts.length ? '' : ' gsim-idle');
          row.textContent = `${c}: ${parts.length ? parts.join(', ') : 'idle'}`;
          box.append(row);
        });
        const buttons = document.createElement('div');
        buttons.className = 'gsim-buttons';
        [['join', 'Add consumer'], ['leave', 'Stop first consumer']].forEach(([a, label]) => {
          const b = document.createElement('button');
          b.dataset.a = a; b.dataset.g = i; b.textContent = label;
          buttons.append(b);
        });
        box.append(buttons);
        grid.append(box);
      });
      out.textContent = message;
    };
    const rebalanceActive = why => {
      const hit = groups.filter(g => g.consumers.length);
      hit.forEach(g => { g.rebalances++; });
      message = hit.length ? `${why} Rebalance in: ${hit.map(g => g.name).join(', ')}.` : why;
    };
    const actions = {
      join(g) {
        if (g.consumers.length >= MAX_CONSUMERS) { message = `This simulator stops at ${MAX_CONSUMERS} consumers per group.`; return; }
        const name = `c${++g.made}`;
        g.consumers.push(name);
        g.rebalances++;
        message = `${name} joined ${g.name}. Rebalance in: ${g.name}. Other groups are untouched.`;
      },
      leave(g) {
        if (!g.consumers.length) { message = `${g.name} has no consumers to stop.`; return; }
        const name = [...g.consumers].sort()[0];
        g.consumers = g.consumers.filter(c => c !== name);
        if (g.consumers.length) g.rebalances++;
        message = g.consumers.length ? `${name} left ${g.name}. Rebalance in: ${g.name}. Other groups are untouched.` : `${name} left ${g.name}, which now has no members. Its partitions go unread until a consumer joins.`;
      },
      partition() {
        if (topics[0].partitions >= MAX_PARTITIONS) { message = `This simulator stops at ${MAX_PARTITIONS} partitions.`; return; }
        topics[0].partitions++;
        rebalanceActive(`orders now has ${topics[0].partitions} partitions.`);
      },
      topic() {
        if (topics.length > 1) { message = 'refunds already exists.'; return; }
        topics.push({ name: 'refunds', partitions: 3 });
        rebalanceActive('Created refunds with 3 partitions, and every group here subscribes to it.');
      },
      reset() { start(); }
    };
    root.addEventListener('click', ev => {
      const { a, g } = ev.target.dataset || {};
      if (!a) return;
      actions[a](g === undefined ? undefined : groups[+g]);
      draw();
    });
    draw();
  }
};
if (typeof module !== 'undefined') module.exports = GroupSim;
