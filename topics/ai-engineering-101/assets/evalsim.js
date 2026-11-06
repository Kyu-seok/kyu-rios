// Simulate comparing two prompts on evaluation sets of different sizes.
//
// Markup:
//   <div class="evalsim" data-base="0.5"
//        data-challenges='[{"text":"…","gap":10,"min":0.95}]'></div>
//
// Prompt A truly scores `base`; prompt B truly scores base + gap. Each run draws
// a fresh eval set of N examples for both and records B − A. The page shows how
// often B measures higher, i.e. how often the eval set would pick the right one.
// A challenge passes when the sliders match its optional `gap` and `n` and the
// win rate is ≥ `min` (or ≤ `max`).
(function () {
  const css = `
  .evalsim{font:.92rem/1.45 var(--sans);background:var(--card);border:1px solid var(--rule);border-radius:6px;padding:1rem 1.1rem;margin:1.6rem 0}
  .evalsim .knobs{display:grid;grid-template-columns:auto 1fr 6.5rem;gap:.5rem .8rem;align-items:center}
  .evalsim input[type=range]{width:100%;accent-color:var(--accent)}
  .evalsim .val{font:600 .88rem var(--mono);text-align:right}
  .evalsim .result{margin:.9rem 0 .2rem;font-size:1rem}
  .evalsim .result b{font:700 1.15rem var(--mono)}
  .evalsim svg{width:100%;height:auto;display:block;margin:.4rem 0}
  .evalsim svg text{font:12px var(--sans);fill:var(--muted)}
  .evalsim .note{font-size:.84rem;color:var(--muted)}
  .evalsim .challenges{margin-top:1rem;border-top:1px solid var(--rule);padding-top:.8rem}
  .evalsim .ch{display:flex;gap:.7rem;padding:.3rem 0}
  .evalsim .mark{flex:0 0 5.2rem;font-weight:600;color:var(--muted)}
  .evalsim .ch.done .mark{color:var(--ok)}
  .evalsim .mark.no{color:var(--bad)}
  .evalsim .actions{margin-top:.7rem;display:flex;gap:.6rem}
  .evalsim button{font:600 .85rem var(--sans);cursor:pointer;background:none;border:1px solid var(--rule);border-radius:4px;padding:.35rem .8rem;color:var(--fg)}
  .evalsim button:hover{border-color:var(--accent)}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const SIZES = [10, 30, 100, 300, 1000, 3000, 10000];
  const GAPS = [30, 10, 3, 1];
  const RUNS = 1000;
  const DOTS = 60;

  // Number of correct answers out of n, each correct with probability p.
  function binom(n, p) {
    if (n > 200) {
      // Normal approximation keeps big sets fast; accurate at these sizes.
      const u = 1 - Math.random(), v = Math.random();
      const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      return Math.round(n * p + z * Math.sqrt(n * p * (1 - p)));
    }
    let c = 0;
    for (let i = 0; i < n; i++) if (Math.random() < p) c++;
    return c;
  }

  function simulate(base, gap, n) {
    const diffs = [];
    let wins = 0;
    for (let r = 0; r < RUNS; r++) {
      const d = (binom(n, base + gap / 100) - binom(n, base)) / n;
      if (d > 0) wins++;
      diffs.push(d);
    }
    return { wins: wins / RUNS, diffs };
  }

  function plot(diffs, gap, n, base) {
    const sd = Math.sqrt((base * (1 - base) + (base + gap / 100) * (1 - base - gap / 100)) / n);
    const lo = Math.min(-0.02, gap / 100 - 4 * sd), hi = gap / 100 + 4 * sd;
    const W = 640, H = 92, x = (d) => 10 + ((d - lo) / (hi - lo)) * (W - 20);
    const dots = diffs.slice(0, DOTS).map((d, i) =>
      `<circle cx="${x(d).toFixed(1)}" cy="${18 + (i % 6) * 9}" r="3.6" style="fill:${d > 0 ? "var(--ok)" : "var(--bad)"};opacity:.8"/>`).join("");
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Measured differences between prompt B and prompt A across runs">
      <line x1="${x(0)}" y1="8" x2="${x(0)}" y2="72" style="stroke:var(--fg);stroke-width:1.5"/>
      <line x1="${x(gap / 100)}" y1="8" x2="${x(gap / 100)}" y2="72" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:4 3"/>
      ${dots}
      <text x="${x(0) - 4}" y="88" text-anchor="end">← A looks better</text>
      <text x="${x(0) + 4}" y="88">B looks better →</text>
      <text x="${x(gap / 100) + 4}" y="12" style="fill:var(--accent)">true gap</text>
    </svg>`;
  }

  function setup(el) {
    const base = Number(el.dataset.base || 0.5);
    const challenges = el.dataset.challenges ? JSON.parse(el.dataset.challenges) : [];
    el.innerHTML = `
      <div class="knobs">
        <label>True gap (B − A)</label><input type="range" data-k="gap" min="0" max="${GAPS.length - 1}" step="1" value="1"><span class="val" data-v="gap"></span>
        <label>Eval set size</label><input type="range" data-k="n" min="0" max="${SIZES.length - 1}" step="1" value="2"><span class="val" data-v="n"></span>
      </div>
      <p class="result"></p>
      <div class="plot"></div>
      <p class="note">Each dot is one evaluation run on a fresh eval set (the first ${DOTS} of ${RUNS.toLocaleString()} runs). Green means the eval picked the truly better prompt B, red means it picked A or tied.</p>
      ${challenges.length ? `<div class="challenges"><span class="box-label">Challenges: set the sliders, then check</span>${challenges
        .map((c, i) => `<div class="ch" data-i="${i}"><span class="mark">○ To do</span><span>${c.text}</span></div>`)
        .join("")}<div class="actions"><button data-a="check">Check my settings</button><button data-a="rerun">Run again</button></div></div>` : ""}
    `;
    const inputs = [...el.querySelectorAll("input[type=range]")];
    let state;
    const render = () => {
      const gap = GAPS[Number(inputs[0].value)], n = SIZES[Number(inputs[1].value)];
      el.querySelector('[data-v="gap"]').textContent = `${gap} points`;
      el.querySelector('[data-v="n"]').textContent = n.toLocaleString();
      const sim = simulate(base, gap, n);
      state = { gap, n, wins: sim.wins };
      el.querySelector(".result").innerHTML =
        `Prompt A truly scores ${Math.round(base * 100)}%, prompt B ${Math.round(base * 100) + gap}%. With ${n.toLocaleString()} examples, the eval picks B in <b>${Math.round(sim.wins * 100)}%</b> of runs.`;
      el.querySelector(".plot").innerHTML = plot(sim.diffs, gap, n, base);
    };
    inputs.forEach((i) => i.addEventListener("input", render));
    el.addEventListener("click", (e) => {
      const a = e.target.dataset && e.target.dataset.a;
      if (a === "rerun") render();
      if (a !== "check") return;
      challenges.forEach((c, i) => {
        const row = el.querySelector(`.ch[data-i="${i}"]`);
        const ok = (c.gap == null || state.gap === c.gap) && (c.min == null || state.wins >= c.min) && (c.max == null || state.wins <= c.max) &&
          (c.n == null || state.n === c.n);
        if (ok) row.classList.add("done");
        const mark = row.querySelector(".mark");
        if (row.classList.contains("done")) { mark.textContent = "✓ Done"; mark.classList.remove("no"); }
        else { mark.textContent = "✗ Not yet"; mark.classList.add("no"); }
      });
    });
    render();
  }
  document.querySelectorAll(".evalsim").forEach(setup);
})();
