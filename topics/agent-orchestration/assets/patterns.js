// Mini diagrams of the orchestration patterns from Anthropic's "Building effective agents".
// Usage: <div class="pattern" data-pattern="chain"></div>  (plus <script src="../assets/patterns.js">)
// Patterns: chain, route, parallel, orchestrator, evaluator, agent.
// Theme-aware: colors come from CSS variables in style.css.

const Patterns = (() => {
  // Each node: [id, x, y, label, fill, dashed?]. Each edge: [from, to, label?, bend?].
  const W = 96, H = 34;
  const defs = {
    chain: {
      nodes: [["in", 10, 48, "In", "--l1"], ["a", 120, 48, "LLM 1", "--l3"], ["g", 230, 48, "Gate", "--l2"],
              ["b", 340, 48, "LLM 2", "--l3"], ["out", 450, 48, "Out", "--l1"]],
      edges: [["in", "a"], ["a", "g"], ["g", "b", "pass"], ["b", "out"]],
    },
    route: {
      nodes: [["in", 10, 48, "In", "--l1"], ["r", 140, 48, "Router", "--l4"],
              ["a", 300, 4, "Prompt A", "--l3"], ["b", 300, 48, "Prompt B", "--l3"], ["c", 300, 92, "Prompt C", "--l3"],
              ["out", 450, 48, "Out", "--l1"]],
      edges: [["in", "r"], ["r", "a"], ["r", "b"], ["r", "c"], ["a", "out"], ["b", "out"], ["c", "out"]],
    },
    parallel: {
      nodes: [["in", 10, 48, "In", "--l1"],
              ["a", 150, 4, "LLM", "--l3"], ["b", 150, 48, "LLM", "--l3"], ["c", 150, 92, "LLM", "--l3"],
              ["agg", 300, 48, "Aggregate", "--l2"], ["out", 450, 48, "Out", "--l1"]],
      edges: [["in", "a"], ["in", "b"], ["in", "c"], ["a", "agg"], ["b", "agg"], ["c", "agg"], ["agg", "out"]],
    },
    orchestrator: {
      nodes: [["in", 10, 48, "In", "--l1"], ["o", 130, 48, "Orchestrator", "--l4"],
              ["a", 270, 4, "Worker ?", "--l3", true], ["b", 270, 48, "Worker ?", "--l3", true], ["c", 270, 92, "Worker ?", "--l3", true],
              ["s", 400, 48, "Synthesize", "--l2"]],
      edges: [["in", "o"], ["o", "a"], ["o", "b"], ["o", "c"], ["a", "s"], ["b", "s"], ["c", "s"]],
    },
    evaluator: {
      nodes: [["in", 10, 48, "In", "--l1"], ["g", 140, 48, "Generator", "--l3"], ["e", 300, 48, "Evaluator", "--l5"],
              ["out", 450, 48, "Out", "--l1"]],
      edges: [["in", "g"], ["g", "e", "draft", -1], ["e", "g", "feedback", -1], ["e", "out", "accepted"]],
    },
    agent: {
      nodes: [["in", 10, 48, "Human", "--l1"], ["m", 140, 48, "LLM", "--l3"], ["env", 300, 48, "Environment", "--l2"],
              ["out", 450, 48, "Stop", "--l1"]],
      edges: [["in", "m"], ["m", "env", "action", -1], ["env", "m", "feedback", -1], ["m", "out", "", 2]],
    },
  };

  const v = (name) => `var(${name})`;

  function svg(name) {
    const d = defs[name];
    const pos = Object.fromEntries(d.nodes.map(([id, x, y]) => [id, { x, y }]));
    let s = `<svg viewBox="0 0 556 132" role="img" aria-label="${name} pattern diagram">
      <defs><marker id="pa-${name}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L10 5 L0 10z" fill="${v("--fg")}"/></marker></defs>`;
    for (const [from, to, label = "", bend = 0] of d.edges) {
      const a = pos[from], b = pos[to];
      let x1 = a.x + W, y1 = a.y + H / 2, x2 = b.x, y2 = b.y + H / 2;
      if (b.x < a.x) { x1 = a.x; x2 = b.x + W; }               // edge pointing backwards
      let path, lx, ly;
      if (bend === 2) {                                         // drop from node to a far target below
        path = `M${a.x + W / 2} ${a.y + H} C ${a.x + W / 2} 128, ${b.x + W / 2} 128, ${b.x + W / 2} ${b.y + H}`;
        lx = (a.x + b.x) / 2 + W / 2; ly = 126;
      } else if (bend) {                                        // paired arcs for a two-way loop
        const up = b.x > a.x ? -1 : 1, off = 26 * up;
        const mx = (x1 + x2) / 2;
        path = `M${x1} ${y1 + off / 3} Q ${mx} ${y1 + off * 1.4}, ${x2} ${y2 + off / 3}`;
        lx = mx; ly = y1 + off * 1.1 + (up < 0 ? -2 : 10);
      } else {
        path = `M${x1} ${y1} L${x2} ${y2}`;
        lx = (x1 + x2) / 2; ly = (y1 + y2) / 2 - 5;
      }
      s += `<path d="${path}" fill="none" stroke="${v("--fg")}" stroke-width="1.1" marker-end="url(#pa-${name})"/>`;
      if (label) s += `<text x="${lx}" y="${ly}" text-anchor="middle" font-family="var(--sans)" font-size="10" fill="${v("--muted")}">${label}</text>`;
    }
    for (const [, x, y, label, fill, dashed] of d.nodes) {
      s += `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="5" fill="${v(fill)}" stroke="${v("--fg")}" stroke-width="1"${dashed ? ' stroke-dasharray="4 3"' : ""}/>
            <text x="${x + W / 2}" y="${y + H / 2 + 4}" text-anchor="middle" font-family="var(--serif)" font-size="13" fill="${v("--fg")}">${label}</text>`;
    }
    return s + "</svg>";
  }

  function mountAll() {
    document.querySelectorAll(".pattern[data-pattern]").forEach((el) => {
      if (defs[el.dataset.pattern]) el.innerHTML = svg(el.dataset.pattern);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountAll);
  else mountAll();

  return { svg };
})();
