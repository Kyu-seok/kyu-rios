# kyu-rios Glossary

The language of a public second brain: a site that shows what its author has learned, how the pieces connect, and that helps readers keep the knowledge from fading.

## Content

**Topic**:
One subject learned as a whole (for example Kafka, or the Node.js event loop). A Topic owns a set of Lessons, Reference sheets and Learning records.
_Avoid_: workspace, course, folder

**Lesson**:
A single short, self-contained piece of teaching inside a Topic. The main unit of learning, and a node in the Graph.
_Avoid_: page, article, post

**Reference sheet**:
The compressed essence of one or more Lessons, written for quick lookup rather than first-time learning. A node in the Graph.
_Avoid_: cheat sheet, reference doc

**Learning record**:
A short note recording that something was understood, or that a prior belief was corrected. Not a node in the Graph.

**Quiz**:
The set of retrieval-practice questions that belong to one Lesson.

**Published**:
The state of a Topic or Lesson that the author has explicitly chosen to make public. Nothing is Published by default.
_Avoid_: live, visible

**About**:
A Topic's short, reader-facing description (`ABOUT.md`): what it covers and what a reader can do afterwards. Optional. Distinct from the Mission, which `/teach` writes about the learner and which is never Published.
_Avoid_: mission, why, intro

## Graph

**Graph**:
The picture of all Published Topics, Lessons and Reference sheets, and the Relationships between them.
_Avoid_: brain, map, network

**Node**:
One Topic, Lesson or Reference sheet shown in the Graph.

**Relationship**:
A directed, typed link between two Nodes stating how one idea bears on another (for example "requires" or "extends"). The kind of Relationship is its **Relationship type**.
_Avoid_: edge, connection, backlink, link

## Review

**Review card**:
One question taken from a Quiz that is scheduled for repeated recall over time.
_Avoid_: flashcard, question

**Review**:
A session in which a reader answers the Review cards that are due for them.
_Avoid_: revision, practice

**Progress**:
A single reader's record of how well they have recalled each Review card. Progress belongs to that reader alone.
