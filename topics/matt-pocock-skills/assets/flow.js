// The main flow (idea → ship), drawn as HTML so it reflows on phones and prints cleanly.
//
// Usage: <div class="flow" data-highlight="grill tickets"></div>
//        Space-separated step ids get the accent; others are dimmed when any id is given.
//        Ids: grill, prototype, spec, tickets, implement, tdd, review, retro, here

const Flow = (() => {
  const node = (id, name, what) =>
    `<div class="flow-node" data-id="${id}"><code>${name}</code><span>${what}</span></div>`;
  const arrow = '<div class="flow-arrow" aria-hidden="true">↓</div>';

  const html = `
    ${node("grill", "/grill-with-docs", "Interview until aligned. Writes GLOSSARY.md and ADRs.")}
    <div class="flow-side">${node("prototype", "/prototype", "Detour, if a question needs runnable code to answer")}</div>
    ${arrow}
    <div class="flow-q">Will the build take more than one session?</div>
    <div class="flow-branch">
      <div class="flow-col">
        <div class="flow-tag">Yes</div>
        ${node("spec", "/to-spec", "Turn the conversation into a spec on the tracker")}
        ${arrow}
        ${node("tickets", "/to-tickets", "Split into tracer-bullet tickets with blocking edges")}
        ${arrow}
        ${node("implement", "/implement", "One ticket per run. /clear between tickets.")}
      </div>
      <div class="flow-col">
        <div class="flow-tag">No</div>
        ${node("here", "/implement", "Right here, in the same context window")}
      </div>
    </div>
    <div class="flow-inside">Inside every /implement:
      ${node("tdd", "/tdd", "Red → green, one vertical slice at a time, at agreed seams")}
      ${node("review", "/code-review", "Two axes: Standards and Spec. Owns refactoring now.")}
    </div>
    ${arrow}
    ${node("retro", "/retro", "Improve the agent's environment, not the code")}
  `;

  function mount() {
    document.querySelectorAll(".flow").forEach((root) => {
      root.innerHTML = html;
      const ids = (root.dataset.highlight || "").split(/\s+/).filter(Boolean);
      if (!ids.length) return;
      root.classList.add("flow-focus");
      ids.forEach((id) =>
        root.querySelectorAll(`[data-id="${id}"]`).forEach((n) => n.classList.add("on"))
      );
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
  return { mount };
})();
