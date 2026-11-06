// Interactive next-token sampler: temperature, top-k, top-p over a toy vocabulary.
//
// Markup:
//   <div class="sampler" data-context="My favorite color is"
//        data-logits='{"blue":3,"green":2.6,"red":2.3}'
//        data-challenges='[{"text":"Make blue ≥ 95%","token":"blue","min":0.95}]'></div>
//
// Pipeline (same order most inference stacks use):
//   logits ÷ temperature → softmax → keep top-k → keep top-p nucleus → renormalize.
// Temperature 0 is treated as greedy: all probability on the highest logit.
//
// Challenge fields (all optional, all must hold):
//   token + min / max   final probability of that token
//   candidates          exact number of tokens left after top-k/top-p
//   topkOff: true       top-k must be at its maximum (i.e. not filtering)
(function () {
  const css = `
  .sampler{font:.9rem/1.4 var(--sans);background:var(--card);border:1px solid var(--rule);border-radius:6px;padding:1rem 1.1rem;margin:1.6rem 0}
  .sampler .ctx{font:1.05rem var(--serif);margin:0 0 .8rem}
  .sampler .ctx b{color:var(--accent)}
  .sampler .knobs{display:grid;grid-template-columns:auto 1fr 3.2rem;gap:.35rem .7rem;align-items:center;margin-bottom:1rem}
  .sampler input[type=range]{width:100%;accent-color:var(--accent)}
  .sampler .val{font:600 .85rem var(--mono);text-align:right}
  .sampler .row{display:grid;grid-template-columns:4.5rem 1fr 3.4rem;gap:.6rem;align-items:center;margin:.22rem 0}
  .sampler .bar{height:1rem;background:var(--rule);border-radius:3px;overflow:hidden}
  .sampler .bar span{display:block;height:100%;background:var(--app);transition:width .15s}
  .sampler .row.out{opacity:.38}
  .sampler .row.out .bar span{background:var(--muted)}
  .sampler .pct{font:.8rem var(--mono);text-align:right}
  .sampler .tok{font:.85rem var(--mono)}
  .sampler .actions{margin-top:.9rem;display:flex;gap:.5rem;flex-wrap:wrap}
  .sampler button{font:600 .82rem var(--sans);cursor:pointer;background:none;border:1px solid var(--rule);border-radius:4px;padding:.35rem .7rem;color:var(--fg)}
  .sampler button:hover{border-color:var(--accent)}
  .sampler .draws{font:.82rem var(--mono);margin-top:.6rem;min-height:1.2em;word-break:break-word}
  .sampler .challenges{margin-top:1rem;border-top:1px solid var(--rule);padding-top:.8rem}
  .sampler .ch{display:flex;gap:.6rem;align-items:baseline;margin:.35rem 0}
  .sampler .ch .mark{font:600 .8rem var(--sans);min-width:4.2rem}
  .sampler .ch.done .mark{color:var(--ok)}
  .sampler .ch .mark.no{color:var(--bad)}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function compute(logits, T, k, p) {
    const toks = Object.keys(logits).sort((a, b) => logits[b] - logits[a]);
    let probs;
    if (T === 0) {
      probs = toks.map((_, i) => (i === 0 ? 1 : 0));
    } else {
      const ex = toks.map((t) => Math.exp(logits[t] / T));
      const s = ex.reduce((a, b) => a + b, 0);
      probs = ex.map((e) => e / s);
    }
    const before = probs.slice();
    const keep = toks.map((_, i) => i < k);
    let cum = 0;
    for (let i = 0; i < toks.length; i++) {
      if (!keep[i]) continue;
      if (cum >= p - 1e-9) keep[i] = false;
      else cum += probs[i];
    }
    const kept = probs.reduce((a, v, i) => a + (keep[i] ? v : 0), 0);
    const final = probs.map((v, i) => (keep[i] ? v / kept : 0));
    return { toks, before, final, keep };
  }

  function setup(el) {
    const logits = JSON.parse(el.dataset.logits);
    const challenges = el.dataset.challenges ? JSON.parse(el.dataset.challenges) : [];
    const n = Object.keys(logits).length;
    el.innerHTML = `
      <p class="ctx">“${el.dataset.context} <b>___</b>”</p>
      <div class="knobs">
        <label>Temperature</label><input type="range" data-k="T" min="0" max="2" step="0.05" value="1"><span class="val" data-v="T"></span>
        <label>Top-k</label><input type="range" data-k="k" min="1" max="${n}" step="1" value="${n}"><span class="val" data-v="k"></span>
        <label>Top-p</label><input type="range" data-k="p" min="0.05" max="1" step="0.01" value="1"><span class="val" data-v="p"></span>
      </div>
      <div class="bars"></div>
      <div class="actions"><button data-a="draw">Sample 20 times</button><button data-a="reset">Reset knobs</button></div>
      <div class="draws"></div>
      ${challenges.length ? `<div class="challenges"><span class="box-label">Challenges: set the knobs, then check</span>${challenges
        .map((c, i) => `<div class="ch" data-i="${i}"><span class="mark">○ To do</span><span>${c.text}</span></div>`)
        .join("")}<div class="actions"><button data-a="check">Check my settings</button></div></div>` : ""}
    `;
    const inputs = [...el.querySelectorAll("input[type=range]")];
    const get = () => {
      const v = Object.fromEntries(inputs.map((i) => [i.dataset.k, Number(i.value)]));
      return v;
    };
    let state;
    const render = () => {
      const { T, k, p } = get();
      el.querySelector('[data-v="T"]').textContent = T === 0 ? "0 (greedy)" : T.toFixed(2);
      el.querySelector('[data-v="T"]').style.fontSize = T === 0 ? ".7rem" : "";
      el.querySelector('[data-v="k"]').textContent = k === n ? `${k} (off)` : k;
      el.querySelector('[data-v="k"]').style.fontSize = k === n ? ".7rem" : "";
      el.querySelector('[data-v="p"]').textContent = p.toFixed(2);
      state = compute(logits, T, k, p);
      el.querySelector(".bars").innerHTML = state.toks
        .map((t, i) => `<div class="row ${state.keep[i] ? "" : "out"}"><span class="tok">${t}</span><span class="bar"><span style="width:${(state.final[i] * 100).toFixed(1)}%"></span></span><span class="pct">${(state.final[i] * 100).toFixed(1)}%</span></div>`)
        .join("");
    };
    inputs.forEach((i) => i.addEventListener("input", render));
    el.addEventListener("click", (e) => {
      const a = e.target.dataset && e.target.dataset.a;
      if (a === "draw") {
        const out = [];
        for (let j = 0; j < 20; j++) {
          let r = Math.random(), acc = 0, pick = state.toks[0];
          for (let i = 0; i < state.toks.length; i++) { acc += state.final[i]; if (r < acc) { pick = state.toks[i]; break; } }
          out.push(pick);
        }
        el.querySelector(".draws").textContent = out.join(" · ");
      } else if (a === "reset") {
        inputs.forEach((i) => (i.value = i.dataset.k === "T" ? 1 : i.dataset.k === "k" ? n : 1));
        el.querySelector(".draws").textContent = "";
        render();
      } else if (a === "check") {
        const { k } = get();
        const candidates = state.keep.filter(Boolean).length;
        challenges.forEach((c, i) => {
          const row = el.querySelector(`.ch[data-i="${i}"]`);
          const prob = c.token ? state.final[state.toks.indexOf(c.token)] : null;
          const ok =
            (c.min == null || prob >= c.min) &&
            (c.max == null || prob <= c.max) &&
            (c.candidates == null || candidates === c.candidates) &&
            (!c.topkOff || k === n);
          if (ok) row.classList.add("done");
          const mark = row.querySelector(".mark");
          if (row.classList.contains("done")) { mark.textContent = "✓ Done"; mark.classList.remove("no"); }
          else { mark.textContent = "✗ Not yet"; mark.classList.add("no"); }
        });
      }
    });
    render();
  }
  document.querySelectorAll(".sampler").forEach(setup);
})();
