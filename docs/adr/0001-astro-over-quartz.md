---
status: accepted
---

# Build the site with Astro and a custom graph, not Quartz

Quartz is the obvious tool for an Obsidian-style public second brain, but two facts work against it here: the Lessons produced by `/teach` are complete HTML documents, and Quartz is built around Markdown; and the Graph needs typed Relationships (requires, extends, contrasts-with, applies) and type filters, which Quartz's graph plugin does not model. We would have replaced Quartz's graph and worked around its content pipeline, keeping little of what it offers. Astro imports the HTML Lessons as-is, builds the Graph from `topic.yaml` data at build time, and deploys to GitHub Pages with its official workflow.

## Considered options

- **Quartz v5**: Markdown-first, untyped link graph. Rejected: Lessons are HTML and Relationships need types.
- **Plain HTML and JS, no framework**: rejected because it does not scale past a few dozen Lessons.
- **Next.js with a backend** (what careerhackeralex.com/memory uses): rejected because version one must run on GitHub Pages with no server.

## Consequences

- Search and backlinks, which Quartz provides for free, must be built if wanted.
- Lessons stay verbatim; the build only injects site navigation and the local Graph before `</body>`.
