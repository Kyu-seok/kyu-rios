// Click the parts of a text that match a task, then check.
//
// Markup:
//   <div class="spotter" data-task="Click every part an attacker could control.">
//     <div class="text">Plain text <span class="seg" data-hit="1" data-label="Email body"
//       data-why="…">clickable target</span> <span class="seg" data-label="System prompt"
//       data-why="…">clickable decoy</span></div>
//   </div>
//
// Add class "mono" to the .text block for prompts and code. "Check" marks each
// segment as found, missed or a false alarm and lists every segment's explanation.
(function () {
  const css = `
  .spotter{font:.92rem/1.45 var(--sans);background:var(--card);border:1px solid var(--rule);border-radius:6px;padding:1rem 1.1rem;margin:1.6rem 0}
  .spotter .task{font-weight:600;margin:0 0 .7rem}
  .spotter .text{font:1rem/1.6 var(--serif);white-space:pre-wrap;margin:0}
  .spotter .text.mono{font:.84rem/1.6 var(--mono);overflow-wrap:anywhere}
  .spotter .seg{cursor:pointer;border-radius:3px;padding:.05rem .15rem;border-bottom:1px dashed var(--muted)}
  .spotter .seg:hover{background:var(--accent-soft)}
  .spotter .seg.picked{background:var(--accent-soft);border-bottom:2px solid var(--accent)}
  .spotter .seg.found{background:var(--ok-soft);border-bottom:2px solid var(--ok)}
  .spotter .seg.missed{background:var(--bad-soft);border-bottom:2px dashed var(--bad)}
  .spotter .seg.wrong{background:var(--bad-soft);border-bottom:2px solid var(--bad);text-decoration:line-through}
  .spotter .actions{margin-top:.9rem;display:flex;gap:.6rem;align-items:center;flex-wrap:wrap}
  .spotter button{font:600 .85rem var(--sans);cursor:pointer;background:none;border:1px solid var(--rule);border-radius:4px;padding:.35rem .8rem;color:var(--fg)}
  .spotter button:hover{border-color:var(--accent)}
  .spotter .score{font-weight:600}
  .spotter ul.why{margin:.8rem 0 0;padding-left:1.1rem;font-size:.86rem;color:var(--muted)}
  .spotter ul.why b{color:var(--fg)}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function setup(el) {
    const segs = [...el.querySelectorAll(".seg")];
    const task = document.createElement("p");
    task.className = "task";
    task.textContent = el.dataset.task || "Click every part that matches.";
    el.prepend(task);
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.innerHTML = `<button data-a="check">Check</button><button data-a="retry">Retry</button><span class="score"></span>`;
    el.append(actions);
    const list = document.createElement("ul");
    list.className = "why";
    list.hidden = true;
    el.append(list);

    segs.forEach((s) => {
      s.tabIndex = 0;
      s.setAttribute("role", "button");
      const toggle = () => { if (!el.classList.contains("checked")) s.classList.toggle("picked"); };
      s.addEventListener("click", toggle);
      s.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    });

    actions.addEventListener("click", (e) => {
      const a = e.target.dataset && e.target.dataset.a;
      if (a === "check") {
        let found = 0, wrong = 0;
        const hits = segs.filter((s) => s.dataset.hit).length;
        list.innerHTML = segs.map((s) => {
          const hit = !!s.dataset.hit, picked = s.classList.contains("picked");
          s.classList.remove("found", "missed", "wrong");
          let mark;
          if (hit && picked) { s.classList.add("found"); found++; mark = "✓"; }
          else if (hit) { s.classList.add("missed"); mark = "✗ missed:"; }
          else if (picked) { s.classList.add("wrong"); wrong++; mark = "✗ not this one:"; }
          else mark = "·";
          return `<li><b>${mark} ${s.dataset.label || ""}</b> ${s.dataset.why || ""}</li>`;
        }).join("");
        list.hidden = false;
        el.classList.add("checked");
        el.querySelector(".score").textContent =
          `Found ${found} of ${hits}` + (wrong ? ` · ${wrong} false alarm${wrong > 1 ? "s" : ""}` : "");
      } else if (a === "retry") {
        segs.forEach((s) => s.classList.remove("picked", "found", "missed", "wrong"));
        list.hidden = true;
        el.classList.remove("checked");
        el.querySelector(".score").textContent = "";
      }
    });
  }
  document.querySelectorAll(".spotter").forEach(setup);
})();
