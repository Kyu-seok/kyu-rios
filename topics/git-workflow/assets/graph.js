/* Commit-graph diagrams, drawn as inline SVG that follows the course theme.
   Usage:
     <figure class="graph" id="g1"></figure>
     <script src="../assets/graph.js"></script>
     <script>Graph.render('#g1', {
       commits: [ { id: 'a1', col: 0 }, { id: 'b2', col: 1, parents: ['a1'] }, { id: 'c3', col: 2, lane: 1, parents: ['b2'] } ],
       refs:    [ { name: 'main', at: 'b2' }, { name: 'feature', at: 'c3' }, { name: 'origin/main', at: 'a1', kind: 'remote' } ],
       head: 'feature',          // branch name HEAD points to (drawn as "HEAD →" on that label)
       caption: 'Optional caption'
     });</script>
   col = position left→right (time); lane = row (0 = bottom/main line). Labels sit below lane 0, above other lanes.
   Commits with ghost: true are drawn dashed (e.g. "about to exist"). */
(function () {
  const DX = 72, DY = 64, R = 11, PAD = 28, LABEL_H = 20, CHAR_W = 7.4;

  function render(selector, spec) {
    const host = document.querySelector(selector);
    if (!host) return;
    const commits = spec.commits, byId = {};
    commits.forEach(c => { c.lane = c.lane || 0; byId[c.id] = c; });
    const maxCol = Math.max(...commits.map(c => c.col));
    const maxLane = Math.max(...commits.map(c => c.lane));

    // Group labels by commit so they stack instead of overlapping.
    const stacks = {};
    (spec.refs || []).forEach(r => (stacks[r.at] = stacks[r.at] || []).push(r));
    const maxStack = Math.max(1, ...Object.values(stacks).map(s => s.length));
    const top = PAD + (maxLane > 0 ? maxStack * (LABEL_H + 4) : 0);
    const bottomLabels = maxStack * (LABEL_H + 4);
    const width = PAD * 2 + maxCol * DX + 120;
    const height = top + maxLane * DY + R + 12 + bottomLabels + 8;
    const pos = c => ({ x: PAD + 20 + c.col * DX, y: top + (maxLane - c.lane) * DY });

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${spec.caption || 'commit graph'}" xmlns="http://www.w3.org/2000/svg">`;

    // Edges first, so nodes paint over them.
    commits.forEach(c => (c.parents || []).forEach(pid => {
      const p = pos(byId[pid]), q = pos(c);
      const d = p.y === q.y ? `M${p.x},${p.y} L${q.x},${q.y}`
        : `M${p.x},${p.y} C${p.x + DX * 0.6},${p.y} ${q.x - DX * 0.6},${q.y} ${q.x},${q.y}`;
      svg += `<path d="${d}" fill="none" style="stroke:var(--muted)" stroke-width="2"${c.ghost ? ' stroke-dasharray="4 4"' : ''}/>`;
    }));

    commits.forEach(c => {
      const { x, y } = pos(c);
      svg += `<circle cx="${x}" cy="${y}" r="${R}" style="fill:var(--bg);stroke:var(--fg)" stroke-width="2"${c.ghost ? ' stroke-dasharray="3 3"' : ''}/>`;
      svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="9" style="fill:var(--muted)">${c.id}</text>`;
    });

    Object.entries(stacks).forEach(([at, refs]) => {
      const { x, y } = pos(byId[at]);
      const above = byId[at].lane > 0;
      refs.forEach((r, i) => {
        const isHead = spec.head === r.name;
        const text = (isHead ? 'HEAD → ' : '') + r.name;
        const w = text.length * CHAR_W + 14;
        const ly = above ? y - R - 6 - (i + 1) * (LABEL_H + 4) + 4 : y + R + 6 + i * (LABEL_H + 4);
        const colour = r.kind === 'remote' ? 'var(--remote)' : 'var(--branch)';
        const dash = r.kind === 'remote' ? ' stroke-dasharray="3 2"' : '';
        svg += `<rect x="${x - w / 2}" y="${ly}" width="${w}" height="${LABEL_H}" rx="4" style="fill:var(--bg);stroke:${isHead ? 'var(--head)' : colour}" stroke-width="${isHead ? 2 : 1.4}"${dash}/>`;
        svg += `<text x="${x}" y="${ly + 14}" text-anchor="middle" font-family="-apple-system, Helvetica, sans-serif" font-size="11.5" font-weight="600" style="fill:${colour}">` +
          (isHead ? `<tspan style="fill:var(--head)">HEAD → </tspan>${r.name}` : r.name) + `</text>`;
      });
    });

    svg += '</svg>';
    host.innerHTML = svg + (spec.caption ? `<figcaption>${spec.caption}</figcaption>` : '');
  }

  window.Graph = { render };
})();
