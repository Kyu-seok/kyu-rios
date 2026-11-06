// Sort items into categories with per-item feedback.
//
// Markup:
//   <div class="sorter"
//        data-categories='["Pre-training","Supervised finetuning"]'
//        data-items='[{"text":"Billions of web pages","answer":"Pre-training","why":"…"}]'></div>
//
// Each item gets a dropdown. "Check" marks every item right or wrong and reveals
// its explanation; "Retry" clears the answers. Items are shuffled on load so
// their order gives no clue.
(function () {
  const css = `
  .sorter{font:.92rem/1.45 var(--sans);background:var(--card);border:1px solid var(--rule);border-radius:6px;padding:1rem 1.1rem;margin:1.6rem 0}
  .sorter .item{padding:.65rem 0;border-bottom:1px solid var(--rule)}
  .sorter .item:last-of-type{border-bottom:none}
  .sorter .line{display:flex;gap:.8rem;align-items:center;justify-content:space-between;flex-wrap:wrap}
  .sorter .txt{flex:1 1 16rem}
  .sorter select{font:.88rem var(--sans);padding:.35rem .5rem;border:1px solid var(--rule);border-radius:4px;background:var(--bg);color:var(--fg);min-width:12rem}
  .sorter .item.ok select{border-color:var(--ok);background:var(--ok-soft)}
  .sorter .item.no select{border-color:var(--bad);background:var(--bad-soft)}
  .sorter .why{display:none;font-size:.84rem;margin-top:.45rem;color:var(--muted)}
  .sorter .item.ok .why,.sorter .item.no .why{display:block}
  .sorter .why b{color:var(--fg)}
  .sorter .actions{margin-top:.9rem;display:flex;gap:.6rem;align-items:center;flex-wrap:wrap}
  .sorter button{font:600 .85rem var(--sans);cursor:pointer;background:none;border:1px solid var(--rule);border-radius:4px;padding:.35rem .8rem;color:var(--fg)}
  .sorter button:hover{border-color:var(--accent)}
  .sorter .score{font-weight:600}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function setup(el) {
    const cats = JSON.parse(el.dataset.categories);
    const items = JSON.parse(el.dataset.items);
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    const options = `<option value="">Choose…</option>` + cats.map((c) => `<option>${esc(c)}</option>`).join("");
    el.innerHTML =
      items.map((it, i) => `
        <div class="item" data-i="${i}">
          <div class="line"><span class="txt">${it.text}</span><select aria-label="Category">${options}</select></div>
          <div class="why"></div>
        </div>`).join("") +
      `<div class="actions"><button data-a="check">Check</button><button data-a="retry">Retry</button><span class="score"></span></div>`;

    const rows = [...el.querySelectorAll(".item")];
    el.addEventListener("click", (e) => {
      const a = e.target.dataset && e.target.dataset.a;
      if (a === "check") {
        let right = 0, answered = 0;
        rows.forEach((row, i) => {
          const v = row.querySelector("select").value;
          row.classList.remove("ok", "no");
          if (!v) return;
          answered++;
          const ok = v === items[i].answer;
          if (ok) right++;
          row.classList.add(ok ? "ok" : "no");
          row.querySelector(".why").innerHTML = (ok ? "" : `<b>Answer: ${esc(items[i].answer)}.</b> `) + (items[i].why || "");
        });
        el.querySelector(".score").textContent =
          answered < rows.length ? `${right} / ${answered} right · ${rows.length - answered} unanswered` : `${right} / ${rows.length} right`;
      } else if (a === "retry") {
        rows.forEach((row) => { row.classList.remove("ok", "no"); row.querySelector("select").value = ""; });
        el.querySelector(".score").textContent = "";
      }
    });
  }
  document.querySelectorAll(".sorter").forEach(setup);
})();
