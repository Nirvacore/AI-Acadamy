# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is
This is a **content-only repository** — a Thai-language AI course ("AI-Acadamy"). It contains
only Markdown lessons and YAML curriculum data under `content/`, plus `README.md`. There is
**no application code, no build system, no test suite, no linter, and no dependency manifest**
(`package.json`, `requirements.txt`, `Makefile`, Dockerfile, etc.). Nothing needs to be
compiled or served; "development" here means authoring and keeping the content self-consistent.

### Data model (the "core functionality")
- `content/schema.yaml` — the curriculum: modules → lessons, each pointing at a `content`,
  `lab`, and `script` file path, plus the list of available `tracks`.
- `content/tracks/*.yaml` — per-vendor adapters (`cursor`, `claude`, `openai`, `copilot`).
  Each `concepts[].conceptId` is expected to match a lesson `id` in `schema.yaml`.
- `content/core/`, `content/labs/`, `content/scripts/th/` — the Markdown lessons/labs/scripts,
  cross-linked with relative Markdown links (e.g. `[..](../glossary/th.md)`).

### Toolchain (already present on the VM base image)
- Python 3 with PyYAML (`import yaml`) — used to parse/validate the YAML curriculum.
- Node.js is also available, but the repo does not use it.

### How to validate content (this repo's stand-in for lint/test/build)
Since there is no committed tooling, validate consistency with a short Python script using
PyYAML that: (1) parses every `content/**/*.yaml`, (2) confirms every path referenced by
`schema.yaml` exists, (3) checks each track `conceptId` maps to a schema lesson `id`, and
(4) resolves relative Markdown links inside `content/`. Rendering the outline from
`schema.yaml` (modules → lessons + referenced files) is the natural "build/run" step.

### Known pre-existing issue (not an environment problem)
`content/tracks/cursor.yaml` and `content/tracks/copilot.yaml` do **not** parse with a strict
YAML loader: a `uiLabel` value begins with a double-quoted scalar and then has trailing
unquoted text on the same line (e.g. `uiLabel: "@" mentions, ...` and `uiLabel: "#file" / ...`).
Wrapping the whole value in quotes fixes it. Left unchanged here because fixing content is out
of scope for environment setup; flag it if you touch those files.
