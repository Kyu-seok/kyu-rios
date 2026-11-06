// Sorting drill: put each item in the right bucket, with instant feedback.
//
// Usage: <div class="sort" data-sort="ID"></div>
//        Sort.register("ID", { buckets: ["A", "B"], items: [{ text, bucket: index, why }] });
//        Every item gets the same bucket buttons, in the same order, so the layout gives no clues.

const Sort = (() => {
  function register(id, spec) {
    const mount = () => render(id, spec);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
    else mount();
  }

  function render(id, { buckets, items }) {
    const root = document.querySelector(`.sort[data-sort="${id}"]`);
    if (!root) return;
    let answered = 0, correct = 0;
    const score = el("div", "quiz-score", `0 / ${items.length} sorted`);

    items.forEach((item) => {
      const row = el("div", "sort-item");
      const text = el("div", "sort-text");
      text.innerHTML = item.text;
      const opts = el("div", "sort-opts");
      const fb = el("div", "quiz-fb");
      buckets.forEach((name, bi) => {
        const b = el("button", null, name);
        b.type = "button";
        b.addEventListener("click", () => {
          const ok = bi === item.bucket;
          opts.querySelectorAll("button").forEach((x, xi) => {
            x.disabled = true;
            if (xi === item.bucket) x.classList.add("correct");
          });
          if (!ok) b.classList.add("wrong");
          fb.className = `quiz-fb show ${ok ? "ok" : "no"}`;
          fb.innerHTML = `<span class="verdict">${ok ? "Correct" : "Not quite"}</span> ${item.why || ""}`;
          answered++; if (ok) correct++;
          score.textContent = answered === items.length
            ? `Score: ${correct} / ${items.length}${correct === items.length ? " (all correct)" : ". Reload the page to retry the misses later."}`
            : `${answered} / ${items.length} sorted`;
        });
        opts.append(b);
      });
      row.append(text, opts, fb);
      root.append(row);
    });
    root.append(score);
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  return { register };
})();
