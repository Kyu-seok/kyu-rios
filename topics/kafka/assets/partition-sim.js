/* Partition simulator. Keyed routing uses Kafka's real algorithm:
   toPositive(murmur2(keyBytes)) % numPartitions. Keyless batching is simplified.
   Usage: PartitionSim.mount(element, {partitions: 3}) */
const PartitionSim = {
  murmur2(text) {
    const d = new TextEncoder().encode(text), m = 0x5bd1e995, r = 24, l = d.length;
    let h = (0x9747b28c ^ l) | 0;
    const n = l >> 2;
    for (let i = 0; i < n; i++) {
      const o = i * 4;
      let k = d[o] | (d[o + 1] << 8) | (d[o + 2] << 16) | (d[o + 3] << 24);
      k = Math.imul(k, m); k ^= k >>> r; k = Math.imul(k, m);
      h = Math.imul(h, m); h ^= k;
    }
    const t = n * 4;
    switch (l % 4) {
      case 3: h ^= d[t + 2] << 16; // falls through
      case 2: h ^= d[t + 1] << 8;  // falls through
      case 1: h ^= d[t]; h = Math.imul(h, m);
    }
    h ^= h >>> 13; h = Math.imul(h, m); h ^= h >>> 15;
    return h | 0;
  },
  partitionFor(key, count) { return (this.murmur2(key) & 0x7fffffff) % count; },

  mount(root, { partitions = 3 } = {}) {
    const STICKY_BATCH = 4, MAX = 8;
    let logs, seq, sticky, stickyLeft, message = '';
    const start = () => {
      logs = Array.from({ length: partitions }, () => []);
      seq = 0; sticky = 0; stickyLeft = 0;
      message = 'Send an event to see where it lands.';
    };
    start();
    root.className = 'sim';
    root.innerHTML = `
      <div class="sim-controls">
        <input aria-label="Event key" value="alice" maxlength="24">
        <button data-a="send">Send with key</button>
        <button data-a="nokey">Send without key</button>
      </div>
      <div class="sim-controls">
        <button data-a="grow">Add partition</button>
        <button data-a="shrink">Remove partition</button>
        <button data-a="reset">Reset</button>
      </div>
      <div class="sim-logs"></div>
      <div class="sim-readout" aria-live="polite"></div>`;
    const input = root.querySelector('input');
    const grid = root.querySelector('.sim-logs');
    const out = root.querySelector('.sim-readout');

    const spans = () => {
      const seen = new Map();
      logs.forEach((log, p) => log.forEach(e => {
        if (e.key === null) return;
        if (!seen.has(e.key)) seen.set(e.key, new Set());
        seen.get(e.key).add(p);
      }));
      return [...seen].filter(([, set]) => set.size > 1).map(([k, set]) => [k, [...set]]);
    };
    const draw = () => {
      grid.textContent = '';
      logs.forEach((log, p) => {
        const col = document.createElement('div');
        col.className = 'sim-log';
        const h = document.createElement('h4');
        h.textContent = `Partition ${p}`;
        col.append(h);
        log.forEach((e, off) => {
          const row = document.createElement('div');
          row.className = 'sim-event';
          const o = document.createElement('span');
          o.className = 'off';
          o.textContent = `${off} `;
          row.append(o, `${e.key === null ? '(none)' : e.key}:${e.value}`);
          col.append(row);
        });
        grid.append(col);
      });
      out.textContent = message;
      spans().forEach(([k, ps]) => {
        const w = document.createElement('span');
        w.className = 'sim-warn';
        w.textContent = `"${k}" now spans partitions ${ps.join(' and ')}, so its order is no longer guaranteed.`;
        out.append(w);
      });
    };
    const actions = {
      send() {
        const key = input.value.trim();
        if (!key) { message = 'Type a key first, or use "Send without key".'; return; }
        const p = this_.partitionFor(key, logs.length);
        logs[p].push({ key, value: `e${++seq}` });
        message = `toPositive(murmur2("${key}")) % ${logs.length} = ${p}`;
      },
      nokey() {
        if (stickyLeft === 0) {
          if (logs.length > 1) {
            let next;
            do { next = Math.floor(Math.random() * logs.length); } while (next === sticky);
            sticky = next;
          }
          stickyLeft = STICKY_BATCH;
        }
        stickyLeft--;
        logs[sticky].push({ key: null, value: `e${++seq}` });
        message = `No key: sticking to partition ${sticky} until the batch fills. (Simplified: a batch here is ${STICKY_BATCH} events. Real batches are measured in bytes.)`;
      },
      grow() {
        if (logs.length >= MAX) { message = `This simulator stops at ${MAX} partitions.`; return; }
        logs.push([]);
        message = `Now ${logs.length} partitions. Existing events did not move. New keyed events use % ${logs.length}.`;
      },
      shrink() {
        message = `Rejected. InvalidPartitionsException: The topic currently has ${logs.length} partition(s); ${logs.length - 1} would not be an increase.`;
      },
      reset() { start(); }
    };
    const this_ = this;
    root.addEventListener('click', ev => {
      const a = ev.target.dataset && ev.target.dataset.a;
      if (a) { actions[a](); draw(); }
    });
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') { actions.send(); draw(); }
    });
    draw();
  }
};
if (typeof module !== 'undefined') module.exports = PartitionSim;
