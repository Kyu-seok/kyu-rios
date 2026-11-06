import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type Simulation, type SimulationLinkDatum, type SimulationNodeDatum } from 'd3-force';
import { escapeHtml } from '../lib/escape';
import { LINE_STYLES, topicColor } from '../lib/palette';
import type { GraphData, GraphNode, RelationshipType } from '../lib/types';

export interface GraphOptions {
  /** Site base with trailing slash, used to turn a Node's url into an href. */
  base: string;
  /** Every Published Topic id, in Site order, so colours stay stable across pages. */
  allTopics: string[];
  /** Node (or Topic) to draw with emphasis. */
  focus?: string;
  /** Show the Topic and Relationship-type filter checkboxes. */
  filters?: boolean;
  /** Always draw Node titles (local Graphs); otherwise only Topics and the hovered Node are labelled. */
  labels?: boolean;
  height?: number;
  /** Where a click goes; defaults to the current window. */
  navigate?: (href: string) => void;
}

type SimNode = GraphNode & SimulationNodeDatum & { r: number; degree: number };
type SimRelationship = SimulationLinkDatum<SimNode> & { type: RelationshipType };

/** Exposed on the container as `__graph` so tests can find Nodes on the canvas. */
export interface GraphHandle {
  /** Screen-space positions of the Nodes currently drawn. */
  positions(): Array<{ id: string; x: number; y: number; r: number }>;
  /** Runs the layout to rest at once, so positions stop moving. */
  settle(): void;
  destroy(): void;
}

export function mountGraph(container: HTMLElement, data: GraphData, opts: GraphOptions): GraphHandle {
  container.textContent = '';
  const navigate = opts.navigate ?? ((href: string) => window.location.assign(href));
  const colorOf = new Map(opts.allTopics.map((t, i) => [t, topicColor(i)]));
  const height = opts.height ?? 420;

  const topicsShown = new Set(data.nodes.map((n) => n.topic));
  const typesShown = new Set<RelationshipType>(Object.keys(LINE_STYLES) as RelationshipType[]);

  if (opts.filters) container.append(toolbar());
  const stage = document.createElement('div');
  stage.style.position = 'relative';
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Graph of Topics, Lessons and Reference sheets');
  canvas.style.height = `${height}px`;
  const tooltip = document.createElement('div');
  tooltip.className = 'graph-tooltip';
  stage.append(canvas, tooltip);
  container.append(stage, legend(), nodeList());
  if (data.nodes.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'graph-empty';
    empty.textContent = 'Nothing to show yet.';
    stage.replaceWith(empty);
  }

  const ctx = canvas.getContext('2d')!;
  let width = 0;
  let nodes: SimNode[] = [];
  let relationships: SimRelationship[] = [];
  let hovered: SimNode | undefined;
  let dragging: SimNode | undefined;
  let panning: { x: number; y: number; tx: number; ty: number } | undefined;
  let transform = { k: 1, x: 0, y: 0 };
  /** Once the reader pans, zooms or drags, the view is theirs and no longer auto-fitted. */
  let userTransformed = false;
  let simulation: Simulation<SimNode, SimRelationship> | undefined;

  /** Scales and centres the layout so every Node is inside the canvas, with padding for labels. */
  function fit() {
    if (userTransformed || nodes.length === 0 || width === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of nodes) {
      minX = Math.min(minX, n.x! - n.r);
      maxX = Math.max(maxX, n.x! + n.r);
      minY = Math.min(minY, n.y! - n.r);
      maxY = Math.max(maxY, n.y! + n.r);
    }
    const pad = 48;
    const k = Math.min(1.5, (width - 2 * pad) / Math.max(1, maxX - minX), (height - 2 * pad) / Math.max(1, maxY - minY));
    transform = { k, x: width / 2 - ((minX + maxX) / 2) * k, y: height / 2 - ((minY + maxY) / 2) * k };
  }

  const degree = new Map<string, number>();
  for (const r of data.relationships) {
    degree.set(r.from, (degree.get(r.from) ?? 0) + 1);
    degree.set(r.to, (degree.get(r.to) ?? 0) + 1);
  }

  function rebuild() {
    const prev = new Map(nodes.map((n) => [n.id, n]));
    nodes = data.nodes
      .filter((n) => topicsShown.has(n.topic))
      .map((n) => {
        const d = degree.get(n.id) ?? 0;
        const old = prev.get(n.id);
        return { ...n, degree: d, r: (n.kind === 'topic' ? 9 : 5) + 2 * Math.sqrt(d), x: old?.x, y: old?.y, vx: 0, vy: 0 } as SimNode;
      });
    const byId = new Map(nodes.map((n) => [n.id, n]));
    relationships = data.relationships
      .filter((r) => typesShown.has(r.type) && byId.has(r.from) && byId.has(r.to))
      .map((r) => ({ source: byId.get(r.from)!, target: byId.get(r.to)!, type: r.type }));
    simulation?.stop();
    simulation = forceSimulation<SimNode>(nodes)
      .force('link', forceLink<SimNode, SimRelationship>(relationships).id((d) => d.id).distance((l) => (l.type === 'mentions' ? 70 : 90)).strength((l) => (l.type === 'mentions' ? 0.3 : 0.7)))
      .force('charge', forceManyBody<SimNode>().strength((d) => -120 - 20 * d.degree))
      .force('collide', forceCollide<SimNode>().radius((d) => d.r + 6))
      .force('center', forceCenter(width / 2, height / 2))
      .force('x', forceX<SimNode>(width / 2).strength(0.03))
      .force('y', forceY<SimNode>(height / 2).strength(0.03))
      .on('tick', () => {
        fit();
        draw();
      });
    updateNodeList();
  }

  function resize() {
    width = container.clientWidth || 600;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    simulation?.force('center', forceCenter(width / 2, height / 2));
    simulation?.force('x', forceX<SimNode>(width / 2).strength(0.03));
    simulation?.force('y', forceY<SimNode>(height / 2).strength(0.03));
    fit();
    draw();
  }

  function toScreen(x: number, y: number) {
    return { x: x * transform.k + transform.x, y: y * transform.k + transform.y };
  }
  function toWorld(x: number, y: number) {
    return { x: (x - transform.x) / transform.k, y: (y - transform.y) / transform.k };
  }

  function draw() {
    ctx.save();
    ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    const neighbours = new Set<string>();
    if (hovered) {
      for (const l of relationships) {
        const s = l.source as SimNode, t = l.target as SimNode;
        if (s.id === hovered.id) neighbours.add(t.id);
        if (t.id === hovered.id) neighbours.add(s.id);
      }
    }

    for (const l of relationships) {
      const s = l.source as SimNode, t = l.target as SimNode;
      const style = LINE_STYLES[l.type]!;
      const lit = hovered && (s.id === hovered.id || t.id === hovered.id);
      ctx.beginPath();
      ctx.setLineDash(style.dash);
      ctx.lineWidth = (lit ? style.width + 1 : style.width) / transform.k;
      ctx.strokeStyle = lit ? '#111827' : `rgba(55,65,81,${hovered && !lit ? style.alpha * 0.25 : style.alpha})`;
      ctx.moveTo(s.x!, s.y!);
      ctx.lineTo(t.x!, t.y!);
      ctx.stroke();
      ctx.setLineDash([]);
      if (style.arrow) arrowhead(s, t, lit ? '#111827' : `rgba(55,65,81,${hovered && !lit ? style.alpha * 0.25 : style.alpha})`);
    }

    for (const n of nodes) {
      const color = colorOf.get(n.topic) ?? '#6b7280';
      const dim = hovered && hovered.id !== n.id && !neighbours.has(n.id);
      ctx.beginPath();
      ctx.arc(n.x!, n.y!, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.kind === 'reference' ? '#fff' : color;
      ctx.globalAlpha = dim ? 0.3 : 1;
      ctx.fill();
      ctx.lineWidth = (n.kind === 'reference' ? 2 : 1.5) / transform.k;
      ctx.strokeStyle = n.kind === 'reference' ? color : '#fff';
      ctx.stroke();
      if (n.id === opts.focus || hovered?.id === n.id) {
        ctx.beginPath();
        ctx.arc(n.x!, n.y!, n.r + 4 / transform.k, 0, Math.PI * 2);
        ctx.lineWidth = 2 / transform.k;
        ctx.strokeStyle = '#111827';
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    const labelAll = opts.labels || nodes.length <= 40;
    ctx.font = `${12 / transform.k}px system-ui, sans-serif`;
    ctx.textBaseline = 'middle';
    for (const n of nodes) {
      const show = n.kind === 'topic' || labelAll || hovered?.id === n.id || neighbours.has(n.id);
      if (!show) continue;
      const dim = hovered && hovered.id !== n.id && !neighbours.has(n.id);
      ctx.globalAlpha = dim ? 0.3 : 1;
      ctx.fillStyle = '#111827';
      ctx.font = `${n.kind === 'topic' ? 600 : 400} ${12 / transform.k}px system-ui, sans-serif`;
      ctx.fillText(n.title, n.x! + n.r + 4 / transform.k, n.y!);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function arrowhead(s: SimNode, t: SimNode, color: string) {
    const dx = t.x! - s.x!, dy = t.y! - s.y!;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const tipX = t.x! - ux * (t.r + 2), tipY = t.y! - uy * (t.r + 2);
    const size = 7 / transform.k;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX - ux * size - uy * size * 0.6, tipY - uy * size + ux * size * 0.6);
    ctx.lineTo(tipX - ux * size + uy * size * 0.6, tipY - uy * size - ux * size * 0.6);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function nodeAt(clientX: number, clientY: number): SimNode | undefined {
    const rect = canvas.getBoundingClientRect();
    const p = toWorld(clientX - rect.left, clientY - rect.top);
    let best: SimNode | undefined;
    let bestD = Infinity;
    for (const n of nodes) {
      const d = Math.hypot(n.x! - p.x, n.y! - p.y);
      if (d <= n.r + 4 / transform.k && d < bestD) {
        best = n;
        bestD = d;
      }
    }
    return best;
  }

  function setHovered(n: SimNode | undefined, clientX?: number, clientY?: number) {
    hovered = n;
    container.classList.toggle('has-hover', !!n);
    if (n && clientX !== undefined && clientY !== undefined) {
      const rect = stage.getBoundingClientRect();
      tooltip.innerHTML = `<b></b><span></span>`;
      tooltip.querySelector('b')!.textContent = n.title;
      tooltip.querySelector('span')!.textContent = n.summary || kindLabel(n);
      tooltip.style.display = 'block';
      const x = clientX - rect.left + 14, y = clientY - rect.top + 14;
      tooltip.style.left = `${Math.min(x, rect.width - tooltip.offsetWidth - 8)}px`;
      tooltip.style.top = `${Math.min(y, rect.height - tooltip.offsetHeight - 8)}px`;
    } else {
      tooltip.style.display = 'none';
    }
    draw();
  }

  let moved = false;
  canvas.addEventListener('pointerdown', (e) => {
    const n = nodeAt(e.clientX, e.clientY);
    moved = false;
    canvas.setPointerCapture(e.pointerId);
    if (n) {
      dragging = n;
      n.fx = n.x;
      n.fy = n.y;
      userTransformed = true;
      simulation?.alphaTarget(0.3).restart();
    } else {
      panning = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
      container.classList.add('is-dragging');
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (dragging) {
      moved = true;
      const rect = canvas.getBoundingClientRect();
      const p = toWorld(e.clientX - rect.left, e.clientY - rect.top);
      dragging.fx = p.x;
      dragging.fy = p.y;
      return;
    }
    if (panning) {
      if (Math.hypot(e.clientX - panning.x, e.clientY - panning.y) > 3) moved = true;
      userTransformed = true;
      transform = { ...transform, x: panning.tx + (e.clientX - panning.x), y: panning.ty + (e.clientY - panning.y) };
      draw();
      return;
    }
    setHovered(nodeAt(e.clientX, e.clientY), e.clientX, e.clientY);
  });
  const release = (e: PointerEvent) => {
    if (dragging) {
      const n = dragging;
      dragging = undefined;
      n.fx = null;
      n.fy = null;
      simulation?.alphaTarget(0);
      if (!moved) navigate(opts.base + n.url);
    }
    if (panning) {
      panning = undefined;
      container.classList.remove('is-dragging');
    }
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', () => {
    if (!dragging && !panning) setHovered(undefined);
  });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    const k = Math.min(4, Math.max(0.3, transform.k * (e.deltaY < 0 ? 1.1 : 0.9)));
    const w = toWorld(px, py);
    userTransformed = true;
    transform = { k, x: px - w.x * k, y: py - w.y * k };
    draw();
  }, { passive: false });

  function toolbar(): HTMLElement {
    const bar = document.createElement('div');
    bar.className = 'graph-toolbar';
    const topics = document.createElement('fieldset');
    topics.innerHTML = '<legend>Topics</legend>';
    for (const t of opts.allTopics) {
      if (!data.nodes.some((n) => n.topic === t)) continue;
      const title = data.nodes.find((n) => n.id === t)?.title ?? t;
      topics.append(checkbox(`filter-topic-${t}`, `<span class="swatch" style="background:${colorOf.get(t)}"></span>${escapeHtml(title)}`, true, (on) => {
        if (on) topicsShown.add(t);
        else topicsShown.delete(t);
        rebuild();
      }));
    }
    const types = document.createElement('fieldset');
    types.innerHTML = '<legend>Relationships</legend>';
    for (const type of Object.keys(LINE_STYLES) as RelationshipType[]) {
      types.append(checkbox(`filter-type-${type}`, `${lineSample(type)}${type}`, true, (on) => {
        if (on) typesShown.add(type);
        else typesShown.delete(type);
        rebuild();
      }));
    }
    bar.append(topics, types);
    return bar;
  }

  function checkbox(testId: string, labelHtml: string, checked: boolean, onChange: (on: boolean) => void): HTMLElement {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;
    input.dataset.testid = testId;
    input.addEventListener('change', () => onChange(input.checked));
    label.append(input);
    label.insertAdjacentHTML('beforeend', labelHtml);
    return label;
  }

  function legend(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'graph-legend';
    el.setAttribute('aria-label', 'Legend');
    for (const [type, style] of Object.entries(LINE_STYLES)) {
      const item = document.createElement('span');
      item.innerHTML = `${lineSample(type as RelationshipType)}${escapeHtml(style.label)}`;
      el.append(item);
    }
    const kinds = document.createElement('span');
    kinds.innerHTML = `<svg viewBox="0 0 32 10"><circle cx="5" cy="5" r="4" fill="#6b7280"/><circle cx="18" cy="5" r="4" fill="#fff" stroke="#6b7280" stroke-width="2"/></svg>filled: Topic or Lesson · hollow: Reference sheet · size: number of Relationships`;
    el.append(kinds);
    return el;
  }

  function lineSample(type: RelationshipType): string {
    const style = LINE_STYLES[type]!;
    const dash = style.dash.length ? ` stroke-dasharray="${style.dash.join(' ')}"` : '';
    return `<svg viewBox="0 0 32 10" aria-hidden="true"><line x1="0" y1="5" x2="32" y2="5" stroke="#374151" stroke-opacity="${style.alpha}" stroke-width="${style.width}"${dash}/></svg>`;
  }

  /** An accessible, testable mirror of what the canvas shows. */
  function nodeList(): HTMLElement {
    const ul = document.createElement('ul');
    ul.className = 'sr-only';
    ul.setAttribute('aria-label', 'Nodes shown');
    ul.dataset.testid = 'visible-nodes';
    return ul;
  }
  function updateNodeList() {
    const ul = container.querySelector<HTMLElement>('[data-testid="visible-nodes"]');
    if (!ul) return;
    ul.textContent = '';
    for (const n of nodes) {
      const li = document.createElement('li');
      li.dataset.nodeId = n.id;
      const a = document.createElement('a');
      a.href = opts.base + n.url;
      a.textContent = n.title;
      li.append(a);
      ul.append(li);
    }
    container.dataset.visibleNodes = String(nodes.length);
    container.dataset.visibleRelationships = String(relationships.length);
  }

  const observer = new ResizeObserver(() => resize());
  observer.observe(container);
  resize();
  rebuild();

  const handle: GraphHandle = {
    positions: () => {
      const rect = canvas.getBoundingClientRect();
      return nodes.map((n) => {
        const p = toScreen(n.x!, n.y!);
        return { id: n.id, x: rect.left + p.x, y: rect.top + p.y, r: n.r * transform.k };
      });
    },
    settle: () => {
      simulation?.stop().tick(300);
      fit();
      draw();
    },
    destroy: () => {
      simulation?.stop();
      observer.disconnect();
    },
  };
  (container as HTMLElement & { __graph?: GraphHandle }).__graph = handle;
  return handle;
}

function kindLabel(n: GraphNode): string {
  return n.kind === 'topic' ? 'Topic' : n.kind === 'lesson' ? 'Lesson' : 'Reference sheet';
}
