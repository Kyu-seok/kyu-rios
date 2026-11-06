import type { GraphData } from './types';

/** Shared by the build and the browser: which part of the Graph a page shows. */

/** A Topic's local Graph: its own Nodes plus Nodes one Relationship away in other Topics. */
export function topicSubgraph(graph: GraphData, topic: string): GraphData {
  const own = new Set(graph.nodes.filter((n) => n.topic === topic).map((n) => n.id));
  return neighbourhood(graph, own);
}

/** A Lesson's (or Reference sheet's) local Graph: the Node and its neighbours one Relationship away. */
export function nodeSubgraph(graph: GraphData, nodeId: string): GraphData {
  return neighbourhood(graph, new Set([nodeId]));
}

function neighbourhood(graph: GraphData, seeds: Set<string>): GraphData {
  const keep = new Set(seeds);
  for (const r of graph.relationships) {
    if (seeds.has(r.from)) keep.add(r.to);
    if (seeds.has(r.to)) keep.add(r.from);
  }
  return {
    nodes: graph.nodes.filter((n) => keep.has(n.id)),
    relationships: graph.relationships.filter((r) => keep.has(r.from) && keep.has(r.to) && (seeds.has(r.from) || seeds.has(r.to))),
  };
}
