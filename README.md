# skill-porter

Convert agent skills between **OpenClaw**, **Claude Code**, and **Cursor**.

## What works in this MVP

- `skill-porter convert <source-path> <target-format>`
- Auto-detect source format:
  - OpenClaw `SKILL.md`
  - Claude `AGENTS.md` / `CLAUDE.md`
  - Cursor `.cursorrules`
- Parse + map core fields:
  - name
  - description
  - commands
  - tools
  - examples
- Target output generation for:
  - OpenClaw (`SKILL.md`)
  - Claude (`AGENTS.md`)
  - Cursor (`.cursorrules`)
- `--dry-run` preview mode
- `--output <dir>` output directory control

## Install

```bash
npm install
npm run build
```

Run locally:

```bash
node dist/index.js --help
```

Or with tsx during development:

```bash
npx tsx src/index.ts --help
```

## CLI usage

```bash
skill-porter convert <source-path> <target-format> [--dry-run] [--output <dir>]
```

Target formats:

- `openclaw`
- `claude`
- `cursor`

## Real examples

### 1) OpenClaw → Cursor

```bash
node dist/index.js convert ./examples/openclaw-skill/SKILL.md cursor --output ./examples/out
```

Expected console output:

```text
Detected source format: openclaw
Target format: cursor
✓ Converted skill written to .../examples/out/.cursorrules
```

Example generated file (`.cursorrules`):

```md
# github-helper

Assist with GitHub issue triage

## Rules
- Follow project conventions
- Keep responses actionable and concise

## Commands
- gh issue list --limit 10
- gh pr list --state open

## Tools
- gh
- jq
```

### 2) Cursor → Claude (dry run)

```bash
node dist/index.js convert ./examples/cursor-skill/.cursorrules claude --dry-run
```

This prints the converted `AGENTS.md` content to stdout without writing files.

## Project scripts

```bash
npm run build   # compile TypeScript to dist/
npm test        # basic parser + conversion tests
npm run dev -- convert ./path/to/SKILL.md cursor
```

## Development notes

- Runtime: Node.js
- Language: TypeScript
- Parsing libraries:
  - `gray-matter` (frontmatter)
  - `js-yaml` (YAML generation)
- Conversion is fully local (no network calls)

## Current limitations

- This MVP focuses on OpenClaw, Claude, and Cursor only.
- Additional targets (HuggingFace, Superpowers) are planned next.
- Section mapping is best-effort when source files are loosely structured.
