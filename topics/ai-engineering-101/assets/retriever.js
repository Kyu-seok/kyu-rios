// A tiny term-based (BM25) retriever over a handful of documents.
//
// Markup:
//   <div class="retriever" data-k="3"
//        data-docs='[{"id":"pw","title":"Reset your password","text":"…","extra":"Questions it answers: …"}]'
//        data-queries='[{"q":"help I can’t log in","relevant":["pw"]}]'
//        data-challenges='[{"text":"…","q":"help I can’t log in","target":"pw","augment":true}]'></div>
//
// `extra` is the contextual-retrieval augmentation (questions, keywords, a summary).
// It is only indexed while the "contextual retrieval" box is ticked. Preset queries
// with `relevant` ids also show context precision and recall for the top k. A
// challenge passes when the current query equals `q`, the toggle matches
// `augment` (if given), and `target` ranks first.
(function () {
  const css = `
  .retriever{font:.92rem/1.45 var(--sans);background:var(--card);border:1px solid var(--rule);border-radius:6px;padding:1rem 1.1rem;margin:1.6rem 0}
  .retriever .bar{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}
  .retriever input[type=text]{flex:1 1 14rem;font:.95rem var(--sans);padding:.45rem .6rem;border:1px solid var(--rule);border-radius:4px;background:var(--bg);color:var(--fg)}
  .retriever .presets{display:flex;gap:.4rem;flex-wrap:wrap;margin:.6rem 0}
  .retriever button{font:600 .82rem var(--sans);cursor:pointer;background:none;border:1px solid var(--rule);border-radius:4px;padding:.3rem .65rem;color:var(--fg)}
  .retriever button:hover{border-color:var(--accent)}
  .retriever label.aug{display:flex;gap:.4rem;align-items:center;font-size:.86rem;margin:.3rem 0 .6rem}
  .retriever ol{list-style:none;margin:0;padding:0}
  .retriever li{display:grid;grid-template-columns:1.6rem 1fr 3.6rem;gap:.5rem;padding:.45rem 0;border-top:1px solid var(--rule);align-items:baseline}
  .retriever li.top{background:var(--accent-soft)}
  .retriever li .r{font:600 .85rem var(--mono);color:var(--muted);text-align:right}
  .retriever li .s{font:.8rem var(--mono);color:var(--muted);text-align:right}
  .retriever li .t{font-weight:600}
  .retriever li .x{display:block;font-size:.82rem;color:var(--muted);margin-top:.1rem}
  .retriever li .x.extra{font-style:italic}
  .retriever mark{background:var(--ok-soft);color:inherit;border-radius:2px;padding:0 .1em}
  .retriever .rel{font:600 .72rem var(--sans);color:var(--ok);margin-left:.4rem;text-transform:uppercase;letter-spacing:.04em}
  .retriever .metrics{margin:.6rem 0 0;font-size:.9rem}
  .retriever .metrics b{font-family:var(--mono)}
  .retriever .challenges{margin-top:1rem;border-top:1px solid var(--rule);padding-top:.8rem}
  .retriever .ch{display:flex;gap:.7rem;padding:.3rem 0}
  .retriever .mark{flex:0 0 5.2rem;font-weight:600;color:var(--muted)}
  .retriever .ch.done .mark{color:var(--ok)}
  .retriever .mark.no{color:var(--bad)}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const STOP = new Set("a an and are as at be by can can’t cant do does for from how i i’m in is it its me my not of on or our so t that the this to was we what when where which who why will with you your".split(" "));
  const tokens = (s) => s.toLowerCase().replace(/[’']/g, "’").split(/[^a-z0-9’]+/).flatMap((w) => w.split("’")).filter((w) => w && !STOP.has(w));
  const norm = (s) => s.trim().toLowerCase().replace(/'/g, "’");
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const highlight = (s, terms) => esc(s).replace(/[A-Za-z0-9]+/g, (w) => (terms.has(w.toLowerCase()) ? `<mark>${w}</mark>` : w));

  // Okapi BM25 with the usual defaults; term frequency is normalized by document length.
  function bm25(docs, query, augment) {
    const k1 = 1.2, b = 0.75;
    const bodies = docs.map((d) => tokens(`${d.title} ${d.text} ${augment && d.extra ? d.extra : ""}`));
    const avg = bodies.reduce((a, t) => a + t.length, 0) / bodies.length;
    const q = [...new Set(tokens(query))];
    const df = Object.fromEntries(q.map((t) => [t, bodies.filter((body) => body.includes(t)).length]));
    return docs.map((d, i) => {
      const body = bodies[i];
      let score = 0;
      const hit = new Set();
      q.forEach((t) => {
        const f = body.filter((w) => w === t).length;
        if (!f) return;
        hit.add(t);
        const idf = Math.log(1 + (docs.length - df[t] + 0.5) / (df[t] + 0.5));
        score += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * body.length / avg));
      });
      return { d, score, hit };
    }).sort((x, y) => y.score - x.score);
  }

  function setup(el) {
    const docs = JSON.parse(el.dataset.docs);
    const presets = el.dataset.queries ? JSON.parse(el.dataset.queries) : [];
    const challenges = el.dataset.challenges ? JSON.parse(el.dataset.challenges) : [];
    const k = Number(el.dataset.k || 3);
    const hasExtra = docs.some((d) => d.extra);
    el.innerHTML = `
      <div class="bar"><input type="text" aria-label="Search query" placeholder="Type a query…"></div>
      ${presets.length ? `<div class="presets">${presets.map((p, i) => `<button data-p="${i}">${esc(p.q)}</button>`).join("")}</div>` : ""}
      ${hasExtra ? `<label class="aug"><input type="checkbox"> Contextual retrieval: also index each document’s added context</label>` : ""}
      <ol></ol>
      <p class="metrics"></p>
      ${challenges.length ? `<div class="challenges"><span class="box-label">Challenges: set it up, then check</span>${challenges
        .map((c, i) => `<div class="ch" data-i="${i}"><span class="mark">○ To do</span><span>${c.text}</span></div>`)
        .join("")}<div class="presets"><button data-a="check">Check</button></div></div>` : ""}
    `;
    const input = el.querySelector("input[type=text]");
    const aug = el.querySelector("input[type=checkbox]");
    let ranked = [];
    const render = () => {
      const augment = !!(aug && aug.checked);
      const query = input.value;
      const preset = presets.find((p) => norm(p.q) === norm(query));
      ranked = query.trim() ? bm25(docs, query, augment) : [];
      el.querySelector("ol").innerHTML = ranked.map((r, i) => {
        const relevant = preset && preset.relevant.includes(r.d.id);
        return `<li class="${i < k && r.score > 0 ? "top" : ""}"><span class="r">${i + 1}</span><span>
          <span class="t">${highlight(r.d.title, r.hit)}</span>${relevant ? `<span class="rel">relevant</span>` : ""}
          <span class="x">${highlight(r.d.text, r.hit)}</span>
          ${augment && r.d.extra ? `<span class="x extra">+ ${highlight(r.d.extra, r.hit)}</span>` : ""}
        </span><span class="s">${r.score.toFixed(2)}</span></li>`;
      }).join("");
      const m = el.querySelector(".metrics");
      if (preset && ranked.length) {
        const got = ranked.slice(0, k).filter((r) => r.score > 0);
        const rel = got.filter((r) => preset.relevant.includes(r.d.id)).length;
        const prec = got.length ? rel / got.length : 0;
        const rec = rel / preset.relevant.length;
        m.innerHTML = `Top ${k} retrieved (shaded). Context precision <b>${Math.round(prec * 100)}%</b> (${rel} of ${got.length} retrieved are relevant) · context recall <b>${Math.round(rec * 100)}%</b> (${rel} of ${preset.relevant.length} relevant were retrieved)`;
      } else m.textContent = ranked.length ? `Top ${k} retrieved (shaded). Score = BM25 relevance; 0 means no query term matched.` : "";
    };
    input.addEventListener("input", render);
    if (aug) aug.addEventListener("change", render);
    el.addEventListener("click", (e) => {
      const p = e.target.dataset && e.target.dataset.p;
      if (p != null) { input.value = presets[Number(p)].q; render(); return; }
      if (e.target.dataset && e.target.dataset.a === "check") {
        challenges.forEach((c, i) => {
          const row = el.querySelector(`.ch[data-i="${i}"]`);
          const ok = norm(input.value) === norm(c.q) && (c.augment == null || !!(aug && aug.checked) === c.augment) &&
            ranked.length && ranked[0].score > 0 && ranked[0].d.id === c.target;
          if (ok) row.classList.add("done");
          const mark = row.querySelector(".mark");
          if (row.classList.contains("done")) { mark.textContent = "✓ Done"; mark.classList.remove("no"); }
          else { mark.textContent = "✗ Not yet"; mark.classList.add("no"); }
        });
      }
    });
    render();
  }
  document.querySelectorAll(".retriever").forEach(setup);
})();
