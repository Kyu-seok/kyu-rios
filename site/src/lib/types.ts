/** Vocabulary follows GLOSSARY.md: Topic, Lesson, Reference sheet, Node, Relationship, Review card. */

export const RELATIONSHIP_TYPES = ['requires', 'extends', 'contrasts-with', 'applies', 'mentions'] as const;
export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

/** The four types an author may write in topic.yaml. `mentions` is derived by the build. */
export const AUTHORED_RELATIONSHIP_TYPES = RELATIONSHIP_TYPES.filter((t) => t !== 'mentions') as RelationshipType[];

export type NodeKind = 'topic' | 'lesson' | 'reference';

/** Node ids: `<topic>` for a Topic, `<topic>/<stem>` for a Lesson, `<topic>/reference/<stem>` for a Reference sheet. */
export function nodeId(kind: 'lesson' | 'reference', topic: string, stem: string): string {
  return kind === 'lesson' ? `${topic}/${stem}` : `${topic}/reference/${stem}`;
}

/** The workspace folder a document kind lives in. */
export function docFolder(kind: 'lesson' | 'reference'): 'lessons' | 'reference' {
  return kind === 'lesson' ? 'lessons' : 'reference';
}

export interface TopicManifest {
  title: string;
  summary: string;
  published: boolean;
  exclude: string[];
  relationships: Array<{ from: string; to: string; type: string }>;
  review: { exclude: string[] };
}

export interface Question {
  id: string;
  stem: string;
  options: string[];
  answer: number;
  why: string;
  /** Which mount point inside the Lesson this question belongs to, when a Lesson has several. */
  section?: string;
}

export interface Document {
  id: string;
  kind: 'lesson' | 'reference';
  topic: string;
  stem: string;
  title: string;
  summary: string;
  /** Absolute path of the source HTML file. */
  sourcePath: string;
  /** Site-relative output path, e.g. `topics/kafka/lessons/0001-where.html`. */
  path: string;
  html: string;
  /** Lessons only: the questions of this Lesson's Quiz, in order. */
  questions: Question[];
  /** Lessons only: absolute path of the `.quiz.js` file, when present. */
  quizPath?: string;
}

export interface Topic {
  slug: string;
  title: string;
  summary: string;
  mission: string;
  /** Absolute path of the Topic directory. */
  dir: string;
  lessons: Document[];
  references: Document[];
  /** Asset files relative to the Topic directory, e.g. `assets/style.css`. */
  assets: string[];
  manifest: TopicManifest;
}

export interface GraphNode {
  id: string;
  kind: NodeKind;
  topic: string;
  title: string;
  summary: string;
  /** Site-relative URL (no base prefix), e.g. `topics/kafka/lessons/0001-where.html`. */
  url: string;
}

export interface Relationship {
  from: string;
  to: string;
  type: RelationshipType;
}

export interface GraphData {
  nodes: GraphNode[];
  relationships: Relationship[];
}

export interface ReviewCard {
  id: string;
  topic: string;
  topicTitle: string;
  lesson: string;
  lessonTitle: string;
  lessonUrl: string;
  stem: string;
  options: string[];
  answer: number;
  why: string;
}

export interface ReviewData {
  cards: ReviewCard[];
}

export type OutputKind = 'home' | 'topic' | 'lesson' | 'reference' | 'asset' | 'quiz' | 'review' | 'data';

export interface Output {
  /** Site-relative path of the emitted file, e.g. `topics/kafka/index.html`. */
  path: string;
  kind: OutputKind;
  /** Absolute source path for files copied verbatim (assets, quiz files). */
  source?: string;
}

export interface Site {
  topics: Topic[];
  graph: GraphData;
  review: ReviewData;
  outputs: Output[];
}

export class BuildError extends Error {
  override name = 'BuildError';
}
