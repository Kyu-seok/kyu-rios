// Context-window bar: shows how a model's context window is filled.
// Usage: <div class="ctxbar" data-cap="200" data-segments="System:10:--l1, CLAUDE.md:8:--l2, Tool output:120:--l5"></div>
//   data-cap       window size (any unit, e.g. thousands of tokens)
//   data-segments  comma-separated  label:size:cssColorVar
//   data-caption   optional text drawn under the bar
// Segments beyond the cap are drawn hatched in red as overflow.

(() => {
  function render(el) {
    const cap = Number(el.dataset.cap || 100);
    const segs = el.dataset.segments.split(",").map((s) => {
      const [label, size, color] = s.trim().split(":");
      return { label, size: Number(size), color: color || "--l3" };
    });
    const total = segs.reduce((a, s) => a + s.size, 0);
    const scale = Math.max(cap, total);
    const W = 560, barY = 18, barH = 34, x0 = 4, inner = W - 8;
    let x = x0, out = "", legend = [];
    for (const s of segs) {
      const w = (s.size / scale) * inner;
      out += `<rect x="${x}" y="${barY}" width="${w}" height="${barH}" fill="var(${s.color})" stroke="var(--fg)" stroke-width=".8"/>`;
      if (w > 46) out += `<text x="${x + w / 2}" y="${barY + barH / 2 + 4}" text-anchor="middle" font-family="var(--sans)" font-size="10.5" fill="var(--fg)">${s.label}</text>`;
      else legend.push(s);                                   // too narrow to label inline
      x += w;
    }
    let lx = x0;
    for (const s of legend) {
      out += `<rect x="${lx}" y="${barY + barH + 34}" width="10" height="10" fill="var(${s.color})" stroke="var(--fg)" stroke-width=".6"/>
              <text x="${lx + 14}" y="${barY + barH + 43}" font-family="var(--sans)" font-size="10.5" fill="var(--muted)">${s.label}</text>`;
      lx += 24 + s.label.length * 6.2;
    }
    const capX = x0 + (cap / scale) * inner;
    if (total > cap) {
      out += `<rect x="${capX}" y="${barY}" width="${x - capX}" height="${barH}" fill="url(#ctx-hatch)" />`;
    }
    out += `<line x1="${capX}" y1="${barY - 8}" x2="${capX}" y2="${barY + barH + 8}" stroke="var(--accent)" stroke-width="2"/>`;
    out += `<text x="${Math.min(capX, W - 4)}" y="${barY - 10}" text-anchor="end" font-family="var(--sans)" font-size="10" fill="var(--accent)">window limit</text>`;
    const used = Math.round((total / cap) * 100);
    const caption = el.dataset.caption || `${used}% of window used`;
    out += `<text x="${x0}" y="${barY + barH + 22}" font-family="var(--sans)" font-size="11" fill="var(--muted)">${caption}</text>`;
    el.innerHTML = `<svg viewBox="0 0 ${W} ${legend.length ? 100 : 82}" role="img" aria-label="Context window usage">
      <defs><pattern id="ctx-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="var(--bad)" stroke-width="3"/></pattern></defs>${out}</svg>`;
  }
  const mount = () => document.querySelectorAll(".ctxbar[data-segments]").forEach(render);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
