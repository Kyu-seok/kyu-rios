import type { Site } from './types';

export interface PrivateStringFinding {
  /** The Node id of the document, the question id, or `<slug>/ABOUT.md`. */
  where: string;
  pattern: string;
}

/**
 * Every place in the Published content where one of `patterns` appears, as a literal substring.
 * The Site is public: a learner's home path, project folder or account name must never reach it.
 * Scans each Topic's About, each document's HTML and each question's text; never the Site's own file paths.
 */
export function findPrivateStrings(site: Site, patterns: string[]): PrivateStringFinding[] {
  const findings: PrivateStringFinding[] = [];
  const scan = (where: string, text: string) => {
    for (const pattern of patterns) if (text.includes(pattern)) findings.push({ where, pattern });
  };
  for (const topic of site.topics) {
    scan(`${topic.slug}/ABOUT.md`, topic.about);
    for (const doc of [...topic.lessons, ...topic.references]) {
      scan(doc.id, doc.html);
      for (const q of doc.questions) scan(q.id, [q.stem, ...q.options, q.why].join('\n'));
    }
  }
  return findings;
}
