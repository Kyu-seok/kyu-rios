import { buildSite, renderDocument } from '../src/lib/build';
import { lessonHtml, manifest, quizJs, topicsTree } from './helpers';

describe('publishing', () => {
  it('an unpublished Topic contributes nothing', () => {
    const dir = topicsTree({
      'kafka/topic.yaml': manifest({ title: 'Kafka', published: false }),
      'kafka/MISSION.md': '# Mission\n',
      'kafka/lessons/0001-where.html': lessonHtml({ title: 'Where' }),
      'kafka/lessons/0001-where.quiz.js': quizJs([{ id: 'kafka/1/q1', stem: 'S?', options: ['a', 'b'], answer: 0, why: 'w' }]),
    });
    const site = buildSite(dir);
    expect(site.graph.nodes).toEqual([]);
    expect(site.review.cards).toEqual([]);
    expect(site.outputs.filter((o) => o.path.startsWith('topics/'))).toEqual([]);
  });

  it('a Published Topic emits its pages, assets and quiz files, and never its private files', () => {
    const dir = topicsTree({
      'kafka/topic.yaml': manifest({ title: 'Kafka', summary: 'Pass CCDAK.', published: true }),
      'kafka/MISSION.md': '# Mission: Pass CCDAK\n\n## Why\nEarn it.\n',
      'kafka/NOTES.md': 'private teacher notes',
      'kafka/RESOURCES.md': 'private resources',
      'kafka/book.epub': 'binary',
      'kafka/index.html': '<html>course index</html>',
      'kafka/learning-records/0001-start.md': 'private',
      'kafka/assets/style.css': 'body{}',
      'kafka/assets/quiz.js': 'const Quiz = {};',
      'kafka/lessons/0001-where.html': lessonHtml({ title: 'Where does an event land?', lede: 'Keys pick partitions.' }),
      'kafka/lessons/0001-where.quiz.js': quizJs([{ id: 'kafka/1/q1', stem: 'S?', options: ['a', 'b'], answer: 0, why: 'w' }]),
      'kafka/lessons/0002-who.html': lessonHtml({ title: 'Who reads which partition?' }),
      'kafka/reference/keys.html': lessonHtml({ title: 'Keys and partitions', lede: 'Cheat sheet.' }),
    });
    const site = buildSite(dir);
    expect(site.outputs.map((o) => o.path).sort()).toEqual(
      [
        'index.html',
        'review/index.html',
        'graph.json',
        'review.json',
        'topics/kafka/index.html',
        'topics/kafka/assets/style.css',
        'topics/kafka/assets/quiz.js',
        'topics/kafka/lessons/0001-where.html',
        'topics/kafka/lessons/0001-where.quiz.js',
        'topics/kafka/lessons/0002-who.html',
        'topics/kafka/reference/keys.html',
      ].sort(),
    );
    expect(site.graph.nodes).toEqual([
      { id: 'kafka', kind: 'topic', topic: 'kafka', title: 'Kafka', summary: 'Pass CCDAK.', url: 'topics/kafka/' },
      { id: 'kafka/0001-where', kind: 'lesson', topic: 'kafka', title: 'Where does an event land?', summary: 'Keys pick partitions.', url: 'topics/kafka/lessons/0001-where.html' },
      { id: 'kafka/0002-who', kind: 'lesson', topic: 'kafka', title: 'Who reads which partition?', summary: '', url: 'topics/kafka/lessons/0002-who.html' },
      { id: 'kafka/reference/keys', kind: 'reference', topic: 'kafka', title: 'Keys and partitions', summary: 'Cheat sheet.', url: 'topics/kafka/reference/keys.html' },
    ]);
    expect(site.topics[0]!.mission).toContain('## Why');
  });

  it('an excluded Lesson is absent from the pages, the Graph and the Review', () => {
    const dir = topicsTree({
      'kafka/topic.yaml': manifest({ title: 'Kafka', published: true, exclude: ['0002-who', 'reference/keys'] }),
      'kafka/lessons/0001-where.html': lessonHtml({ title: 'Where' }),
      'kafka/lessons/0001-where.quiz.js': quizJs([{ id: 'kafka/1/q1', stem: 'S?', options: ['a', 'b'], answer: 0, why: 'w' }]),
      'kafka/lessons/0002-who.html': lessonHtml({ title: 'Who' }),
      'kafka/lessons/0002-who.quiz.js': quizJs([{ id: 'kafka/2/q1', stem: 'T?', options: ['a', 'b'], answer: 1, why: 'w' }]),
      'kafka/reference/keys.html': lessonHtml({ title: 'Keys' }),
    });
    const site = buildSite(dir);
    expect(site.outputs.map((o) => o.path).filter((p) => p.includes('0002') || p.includes('keys'))).toEqual([]);
    expect(site.graph.nodes.map((n) => n.id)).toEqual(['kafka', 'kafka/0001-where']);
    expect(site.review.cards.map((c) => c.id)).toEqual(['kafka/1/q1']);
  });
});

describe('quiz data', () => {
  it('extracts question ids as written and turns every question into a Review card', () => {
    const dir = topicsTree({
      'kafka/topic.yaml': manifest({ title: 'Kafka', published: true }),
      'kafka/lessons/0001-where.html': lessonHtml({ title: 'Where' }),
      'kafka/lessons/0001-where.quiz.js': `// comment\nwindow.QUIZ = [\n  { id: "kafka/1/q7", stem: "Same key, same partition?", options: ["Yes", "No"], answer: 0, why: \`Hash <code>mod</code> n\` },\n  { id: "kafka/1/q2", stem: 'Two', options: ['a', 'b', 'c'], answer: 2, why: 'w2' },\n];\n`,
    });
    const site = buildSite(dir);
    expect(site.review.cards).toEqual([
      { id: 'kafka/1/q7', topic: 'kafka', topicTitle: 'Kafka', lesson: 'kafka/0001-where', lessonTitle: 'Where', lessonUrl: 'topics/kafka/lessons/0001-where.html', stem: 'Same key, same partition?', options: ['Yes', 'No'], answer: 0, why: 'Hash <code>mod</code> n' },
      { id: 'kafka/1/q2', topic: 'kafka', topicTitle: 'Kafka', lesson: 'kafka/0001-where', lessonTitle: 'Where', lessonUrl: 'topics/kafka/lessons/0001-where.html', stem: 'Two', options: ['a', 'b', 'c'], answer: 2, why: 'w2' },
    ]);
  });

  it('review exclusions remove cards by Lesson stem or question id', () => {
    const dir = topicsTree({
      'kafka/topic.yaml': manifest({ title: 'Kafka', published: true, reviewExclude: ['0002-who', 'kafka/1/q2'] }),
      'kafka/lessons/0001-where.html': lessonHtml({ title: 'Where' }),
      'kafka/lessons/0001-where.quiz.js': quizJs([
        { id: 'kafka/1/q1', stem: 'S?', options: ['a', 'b'], answer: 0, why: 'w' },
        { id: 'kafka/1/q2', stem: 'T?', options: ['a', 'b'], answer: 0, why: 'w' },
      ]),
      'kafka/lessons/0002-who.html': lessonHtml({ title: 'Who' }),
      'kafka/lessons/0002-who.quiz.js': quizJs([{ id: 'kafka/2/q1', stem: 'U?', options: ['a', 'b'], answer: 1, why: 'w' }]),
    });
    expect(buildSite(dir).review.cards.map((c) => c.id)).toEqual(['kafka/1/q1']);
  });

  it('fails the build on a quiz file with a missing or duplicate id', () => {
    const dir = topicsTree({
      'kafka/topic.yaml': manifest({ title: 'Kafka', published: true }),
      'kafka/lessons/0001-where.html': lessonHtml({ title: 'Where' }),
      'kafka/lessons/0001-where.quiz.js': quizJs([
        { id: 'kafka/1/q1', stem: 'S?', options: ['a', 'b'], answer: 0, why: 'w' },
        { id: 'kafka/1/q1', stem: 'T?', options: ['a', 'b'], answer: 0, why: 'w' },
      ]),
    });
    expect(() => buildSite(dir)).toThrow(/0001-where\.quiz\.js.*kafka\/1\/q1/);
  });
});

describe('relationships', () => {
  it('derives mentions from links between Lessons and Reference sheets, once per pair', () => {
    const dir = topicsTree({
      'kafka/topic.yaml': manifest({ title: 'Kafka', published: true }),
      'kafka/lessons/0001-where.html': lessonHtml({
        title: 'Where',
        body: `<a href="../reference/keys.html">keys</a> <a href="../reference/keys.html#rules">again</a> <a href="0002-who.html">next</a>
               <a href="https://kafka.apache.org/">external</a> <a href="../index.html">home</a> <a href="../assets/style.css">css</a> <a href="0001-where.html">self</a>`,
      }),
      'kafka/lessons/0002-who.html': lessonHtml({ title: 'Who', body: '<a href="../lessons/0001-where.html">back</a>' }),
      'kafka/reference/keys.html': lessonHtml({ title: 'Keys', body: '<a href="../lessons/0002-who.html">who</a>' }),
    });
    expect(buildSite(dir).graph.relationships).toEqual([
      // The Topic page links to each of its Lessons and Reference sheets.
      { from: 'kafka', to: 'kafka/0001-where', type: 'mentions' },
      { from: 'kafka', to: 'kafka/0002-who', type: 'mentions' },
      { from: 'kafka', to: 'kafka/reference/keys', type: 'mentions' },
      // Links inside the documents.
      { from: 'kafka/0001-where', to: 'kafka/reference/keys', type: 'mentions' },
      { from: 'kafka/0001-where', to: 'kafka/0002-who', type: 'mentions' },
      { from: 'kafka/0002-who', to: 'kafka/0001-where', type: 'mentions' },
      { from: 'kafka/reference/keys', to: 'kafka/0002-who', type: 'mentions' },
    ]);
  });

  it('passes typed Relationships through, resolving bare stems inside the Topic', () => {
    const dir = topicsTree({
      'kafka/topic.yaml': manifest({
        title: 'Kafka',
        published: true,
        relationships: [
          { from: '0002-who', to: '0001-where', type: 'requires' },
          { from: '0001-where', to: 'reference/keys', type: 'extends' },
          { from: 'kafka/0002-who', to: 'git/0001-branches', type: 'contrasts-with' },
          { from: 'kafka', to: 'git', type: 'applies' },
        ],
      }),
      'kafka/lessons/0001-where.html': lessonHtml({ title: 'Where', body: '<a href="../reference/keys.html">keys</a>' }),
      'kafka/lessons/0002-who.html': lessonHtml({ title: 'Who' }),
      'kafka/reference/keys.html': lessonHtml({ title: 'Keys' }),
      'git/topic.yaml': manifest({ title: 'Git', published: true }),
      'git/lessons/0001-branches.html': lessonHtml({ title: 'Branches' }),
    });
    const relationships = buildSite(dir).graph.relationships;
    expect(relationships.filter((r) => r.type !== 'mentions')).toEqual([
      { from: 'kafka/0002-who', to: 'kafka/0001-where', type: 'requires' },
      { from: 'kafka/0001-where', to: 'kafka/reference/keys', type: 'extends' },
      { from: 'kafka/0002-who', to: 'git/0001-branches', type: 'contrasts-with' },
      { from: 'kafka', to: 'git', type: 'applies' },
    ]);
    // The link from 0001-where to keys is still a mention alongside the authored `extends`: one pair may carry several types.
    expect(relationships.filter((r) => r.from === 'kafka/0001-where' && r.to === 'kafka/reference/keys').map((r) => r.type)).toEqual(['extends', 'mentions']);
  });

  it('fails the build on an unknown Relationship type', () => {
    const dir = topicsTree({
      'kafka/topic.yaml': manifest({ title: 'Kafka', published: true, relationships: [{ from: '0001-where', to: '0002-who', type: 'inspires' }] }),
      'kafka/lessons/0001-where.html': lessonHtml({ title: 'Where' }),
      'kafka/lessons/0002-who.html': lessonHtml({ title: 'Who' }),
    });
    expect(() => buildSite(dir)).toThrow(/kafka\/topic\.yaml.*"inspires".*requires, extends, contrasts-with, applies/);
  });

  it('fails the build on a Relationship whose endpoint is not a Published Node', () => {
    const dir = topicsTree({
      'kafka/topic.yaml': manifest({ title: 'Kafka', published: true, relationships: [{ from: '0001-where', to: 'draft/0001-x', type: 'requires' }] }),
      'kafka/lessons/0001-where.html': lessonHtml({ title: 'Where' }),
      'draft/topic.yaml': manifest({ title: 'Draft', published: false }),
      'draft/lessons/0001-x.html': lessonHtml({ title: 'X' }),
    });
    expect(() => buildSite(dir)).toThrow(/kafka\/topic\.yaml.*"draft\/0001-x".*not a Published Node/);
  });

  it('fails the build on a malformed manifest', () => {
    const dir = topicsTree({
      'kafka/topic.yaml': 'title: Kafka\npublished: yes please\n',
    });
    expect(() => buildSite(dir)).toThrow(/kafka\/topic\.yaml.*"published"/);
    const dir2 = topicsTree({ 'kafka/topic.yaml': 'title: [unclosed\n' });
    expect(() => buildSite(dir2)).toThrow(/kafka\/topic\.yaml/);
  });
});

describe('Lesson pages', () => {
  const dir = topicsTree({
    'kafka/topic.yaml': manifest({ title: 'Kafka', published: true }),
    'kafka/lessons/0001-where.html': lessonHtml({ title: 'Where', body: '<p>Verbatim <b>content</b></p>' }),
    'kafka/lessons/0002-who.html': lessonHtml({ title: 'Who' }),
    'kafka/lessons/0003-when.html': lessonHtml({ title: 'When' }),
    'kafka/reference/keys.html': lessonHtml({ title: 'Keys' }),
  });

  it('serves the Lesson verbatim with a header linking to its Topic and the previous and next Lessons', () => {
    const site = buildSite(dir);
    const page = renderDocument(site, 'kafka/0002-who', '/kyu-rios/');
    const original = site.topics[0]!.lessons[1]!.html;
    const header = page.slice(page.indexOf('<body>') + '<body>'.length, page.indexOf('<main>'));
    expect(header).toContain('href="/kyu-rios/topics/kafka/"');
    expect(header).toContain('href="/kyu-rios/topics/kafka/lessons/0001-where.html"');
    expect(header).toContain('href="/kyu-rios/topics/kafka/lessons/0003-when.html"');
    expect(header).toContain('Kafka');
    const graph = page.slice(page.lastIndexOf('</script>') + '</script>'.length, page.indexOf('</body>'));
    expect(graph).toContain('src="/kyu-rios/embed/graph/?focus=kafka%2F0002-who"');
    // Everything of the original document is still there, in order.
    const injected = /\n<(nav|section) class="rios-[\s\S]*?<\/\1>\n/g;
    expect(page.replace(injected, '')).toBe(original);
  });

  it('omits the previous link on the first Lesson and the next link on the last', () => {
    const site = buildSite(dir);
    const first = renderDocument(site, 'kafka/0001-where', '/kyu-rios/');
    expect(first).not.toContain('rel="prev"');
    expect(first).toContain('rel="next"');
    const last = renderDocument(site, 'kafka/0003-when', '/kyu-rios/');
    expect(last).toContain('rel="prev"');
    expect(last).not.toContain('rel="next"');
  });

  it('a Reference sheet page links back to its Topic and has no previous or next Lesson', () => {
    const page = renderDocument(buildSite(dir), 'kafka/reference/keys', '/kyu-rios/');
    expect(page).toContain('href="/kyu-rios/topics/kafka/"');
    expect(page).not.toContain('rel="prev"');
    expect(page).not.toContain('rel="next"');
    expect(page).toContain('focus=kafka%2Freference%2Fkeys');
  });
});
