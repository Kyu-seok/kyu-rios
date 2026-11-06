/** Colour per Topic, by the Topic's position in the Site (stable for a given set of Published Topics). */
const TOPIC_COLORS = ['#2563eb', '#d97706', '#059669', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d', '#9333ea', '#ea580c'];

export function topicColor(index: number): string {
  return TOPIC_COLORS[index % TOPIC_COLORS.length]!;
}

/** Line style per Relationship type: dash pattern, width and opacity, with a short description for the legend. */
export const LINE_STYLES: Record<string, { dash: number[]; width: number; alpha: number; arrow: boolean; label: string }> = {
  requires: { dash: [], width: 2, alpha: 0.9, arrow: true, label: 'requires (solid, arrow)' },
  extends: { dash: [8, 4], width: 2, alpha: 0.9, arrow: true, label: 'extends (dashed)' },
  'contrasts-with': { dash: [2, 4], width: 2, alpha: 0.9, arrow: false, label: 'contrasts with (dotted)' },
  applies: { dash: [8, 3, 2, 3], width: 2, alpha: 0.9, arrow: true, label: 'applies (dash-dot)' },
  mentions: { dash: [], width: 1, alpha: 0.35, arrow: false, label: 'mentions (thin)' },
};
