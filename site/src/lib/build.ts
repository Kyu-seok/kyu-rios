import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { documentSummary, documentTitle } from './html';
import { readManifest } from './manifest';
import { readQuizFile } from './quiz';
import { collectRelationships } from './relationships';
import { docFolder, nodeId, type Document, type GraphNode, type Output, type ReviewCard, type Site, type Topic } from './types';

export { renderDocument } from './render';

/**
 * The build seam. Reads a `topics/` directory and returns everything the site emits:
 * the Published Topics, the Graph data, the Review data and the list of output files.
 */
export function buildSite(topicsDir: string): Site {
  const topics = loadTopics(topicsDir);
  const nodes = topics.flatMap(topicNodes);
  const relationships = collectRelationships(topics, nodes);
  const cards = topics.flatMap(reviewCards);
  const outputs: Output[] = [
    { path: 'index.html', kind: 'home' },
    { path: 'review/index.html', kind: 'review' },
    { path: 'graph.json', kind: 'data' },
    { path: 'review.json', kind: 'data' },
    ...topics.flatMap(topicOutputs),
  ];
  return { topics, graph: { nodes, relationships }, review: { cards }, outputs };
}

function loadTopics(topicsDir: string): Topic[] {
  if (!existsSync(topicsDir)) return [];
  const topics: Topic[] = [];
  for (const slug of readdirSync(topicsDir).sort()) {
    const dir = join(topicsDir, slug);
    if (!statSync(dir).isDirectory()) continue;
    const manifestPath = join(dir, 'topic.yaml');
    if (!existsSync(manifestPath)) continue;
    const manifest = readManifest(manifestPath);
    if (!manifest.published) continue;
    const aboutPath = join(dir, 'ABOUT.md');
    topics.push({
      slug,
      title: manifest.title,
      summary: manifest.summary,
      about: existsSync(aboutPath) ? readFileSync(aboutPath, 'utf8') : '',
      dir,
      lessons: loadDocuments(slug, dir, 'lesson', new Set(manifest.exclude)),
      references: loadDocuments(slug, dir, 'reference', new Set(manifest.exclude)),
      assets: listFiles(join(dir, 'assets')).map((abs) => relative(dir, abs)),
      manifest,
    });
  }
  return topics;
}

function loadDocuments(slug: string, dir: string, kind: Document['kind'], excluded: Set<string>): Document[] {
  const sub = docFolder(kind);
  const folder = join(dir, sub);
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .filter((f) => f.endsWith('.html'))
    .sort()
    .map((file) => ({ file, stem: file.slice(0, -'.html'.length) }))
    .filter(({ stem }) => !excluded.has(kind === 'lesson' ? stem : `reference/${stem}`))
    .map(({ file, stem }) => {
      const sourcePath = join(folder, file);
      const html = readFileSync(sourcePath, 'utf8');
      const quizPath = join(folder, `${stem}.quiz.js`);
      const hasQuiz = kind === 'lesson' && existsSync(quizPath);
      return {
        id: nodeId(kind, slug, stem),
        kind,
        topic: slug,
        stem,
        title: documentTitle(html),
        summary: documentSummary(html),
        sourcePath,
        path: `topics/${slug}/${sub}/${file}`,
        html,
        questions: hasQuiz ? readQuizFile(quizPath) : [],
        ...(hasQuiz ? { quizPath } : {}),
      };
    });
}

function listFiles(folder: string): string[] {
  if (!existsSync(folder)) return [];
  return readdirSync(folder, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => (entry.isDirectory() ? listFiles(join(folder, entry.name)) : [join(folder, entry.name)]));
}

function topicNodes(topic: Topic): GraphNode[] {
  const docNode = (d: Document): GraphNode => ({ id: d.id, kind: d.kind, topic: topic.slug, title: d.title, summary: d.summary, url: d.path });
  return [
    { id: topic.slug, kind: 'topic', topic: topic.slug, title: topic.title, summary: topic.summary, url: `topics/${topic.slug}/` },
    ...topic.lessons.map(docNode),
    ...topic.references.map(docNode),
  ];
}

function topicOutputs(topic: Topic): Output[] {
  const base = `topics/${topic.slug}`;
  return [
    { path: `${base}/index.html`, kind: 'topic' },
    ...topic.lessons.map((d): Output => ({ path: d.path, kind: 'lesson', source: d.sourcePath })),
    ...topic.lessons.filter((d) => d.quizPath).map((d): Output => ({ path: `${base}/lessons/${d.stem}.quiz.js`, kind: 'quiz', source: d.quizPath })),
    ...topic.references.map((d): Output => ({ path: d.path, kind: 'reference', source: d.sourcePath })),
    ...topic.assets.map((a): Output => ({ path: `${base}/${a}`, kind: 'asset', source: join(topic.dir, a) })),
  ];
}

/** Every question of every Published Lesson becomes a Review card, minus the Topic's review exclusions. */
function reviewCards(topic: Topic): ReviewCard[] {
  const excluded = new Set(topic.manifest.review.exclude);
  return topic.lessons
    .filter((lesson) => !excluded.has(lesson.stem))
    .flatMap((lesson) =>
      lesson.questions
        .filter((q) => !excluded.has(q.id))
        .map((q): ReviewCard => ({
          id: q.id,
          topic: topic.slug,
          topicTitle: topic.title,
          lesson: lesson.id,
          lessonTitle: lesson.title,
          lessonUrl: lesson.path,
          stem: q.stem,
          options: q.options,
          answer: q.answer,
          why: q.why,
        })),
    );
}
