# skill-porter

Convert agent skills between ecosystem formats (OpenClaw, Claude-style docs, HuggingFace-style skills, and others).

## Current status

**Pre-MVP scaffold (not feature-complete yet).**

This repository currently contains:
- a product/implementation plan in `PRD.md`
- a minimal TypeScript entrypoint in `src/index.ts`
- concept artifacts (`concept_card.*`)

What is implemented right now:
- `node src/index.ts` runs and prints a placeholder message

What is **not** implemented yet:
- skill format detection
- parsing/conversion logic
- validators
- packaged CLI (`skill-porter convert ...`)

If you are evaluating this project today, treat it as an early foundation with a clear build plan, not a finished tool.

## Why this project exists

Skill definitions are currently fragmented across tools and platforms. Moving a skill from one ecosystem to another is mostly manual and error-prone. `skill-porter` is intended to provide a single, reliable conversion workflow.

## Quick start (works today)

### Prerequisites
- Node.js (tested with **v25.6.1**)

### Run current scaffold
```bash
git clone https://github.com/rajanrengasamy/skill-porter.git
cd skill-porter
node src/index.ts
```

Expected output:
```text
TODO: implement project logic
```

Alternative runtime (also verified):
```bash
npx --yes tsx src/index.ts
```

## Repository layout

```text
skill-porter/
├── src/
│   └── index.ts          # current scaffold entrypoint
├── PRD.md                # implementation plan and scope
├── concept_card.md       # concept summary
├── concept_card.html
└── concept_card.png
```

## Planned direction

Near-term implementation focus:
1. Build a normalized internal skill model (AST-like structure)
2. Implement first parser/converter path end-to-end (OpenClaw ↔ Claude-style format)
3. Add validation + warnings for unsupported features
4. Introduce a real CLI surface (`convert`, `--dry-run`, `--output`)
5. Add tests and release packaging

## Contributing

Contributions are welcome, especially around:
- parser design
- conversion edge cases
- test fixtures for real-world skills

Please open an issue first if you want to propose a major format mapping or CLI behavior change.
