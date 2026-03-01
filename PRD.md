# Skill Porter - PRD

**Build ID:** 2026-02-27-005  
**Status:** PRD Ready  
**Build Type:** Tool (CLI, npm-publishable)  
**Inspiration:** huggingface/skills (GitHub Trending, 6.7K stars, 711 today)

## Problem

Agent skills are platform-locked:
- HuggingFace skills (Python, transformers-based)
- superpowers skills (Shell, markdown conventions)
- Claude Code AGENTS.md (specific formatting)
- OpenClaw SKILL.md (YAML frontmatter, skill-specific structure)
- Cursor .cursorrules (rule-based syntax)

Developers want to:
- Port a HuggingFace skill to OpenClaw
- Convert superpowers skills to Claude Code format
- Publish one skill to multiple platforms (cursor.directory, ClawHub, HF Hub)

Current approach: manual rewriting (error-prone, time-consuming).

## Solution

`skill-porter` migrates agent skills between platforms:
1. Detects source skill format and platform
2. Parses skill structure (name, description, commands, examples)
3. Converts to target platform format with proper conventions
4. Validates output for target platform compatibility
5. Generates platform-specific extras (README, install script, examples)

## Target Users

- Skill authors publishing to multiple platforms
- Developers porting existing skills to new agent frameworks
- Platform maintainers building skill ecosystems

## Architecture

```
skill-porter/
├── bin/
│   └── skill-porter.js           # CLI entry point
├── src/
│   ├── parsers/
│   │   ├── huggingface.ts        # Parse HF skills (Python-based)
│   │   ├── superpowers.ts        # Parse superpowers skills
│   │   ├── claude-code.ts        # Parse AGENTS.md / CLAUDE.md
│   │   ├── openclaw.ts           # Parse SKILL.md
│   │   ├── cursor.ts             # Parse .cursorrules
│   │   └── generic.ts            # Generic skill AST
│   ├── converters/
│   │   ├── to-huggingface.ts
│   │   ├── to-superpowers.ts
│   │   ├── to-claude-code.ts
│   │   ├── to-openclaw.ts
│   │   └── to-cursor.ts
│   ├── validators/
│   │   ├── format-validator.ts   # Validate converted skill
│   │   └── compatibility.ts      # Check cross-platform compat
│   ├── templates/
│   │   ├── openclaw-skill-template.md
│   │   ├── claude-code-template.md
│   │   └── cursor-template.txt
│   └── publisher.ts              # Optional: publish to platform repos
├── package.json
└── README.md
```

**Tech Stack:**
- TypeScript
- gray-matter (frontmatter parsing)
- js-yaml (YAML manipulation)
- Markdown AST libraries (remark/unified)

## MVP Scope (Night-Buildable)

### Working Features
- `skill-porter convert <source> <target-platform>` → converts skill file
- Supported platforms: huggingface, superpowers, claude-code, openclaw, cursor
- Automatic format detection (no need to specify source platform)
- Conversion logic:
  - Maps skill name, description, triggers
  - Converts command syntax (bash → Python → bash)
  - Adapts examples to target platform conventions
  - Generates target-specific frontmatter/headers
- Validation: checks converted skill against target platform schema
- Dry-run mode: preview conversion without writing files
- `--output <dir>` flag: write converted skill to directory

### Stubbed/Future
- Bidirectional: detect missing fields and prompt for input
- Batch conversion: convert entire skill collections
- Publisher integration: push to cursor.directory, ClawHub, HF Hub
- Conflict resolution: handle platform-specific features that don't translate
- Skill composition: merge multiple skills into one

## Demo Commands

```bash
# Install
npm install -g skill-porter

# Convert HuggingFace skill to OpenClaw
skill-porter convert ~/.cache/huggingface/skills/text-summary.py openclaw
# → Detected: HuggingFace Python skill
# → Converting to OpenClaw SKILL.md format...
# → ✓ Converted: text-summary/SKILL.md
# → ✓ Generated: text-summary/package.json
# → ✓ Generated: text-summary/README.md

# Convert OpenClaw skill to Cursor rules
skill-porter convert ~/.openclaw/skills/github/SKILL.md cursor
# → Detected: OpenClaw SKILL.md
# → Converting to Cursor .cursorrules format...
# → ✓ Converted: .cursorrules
# → ⚠ Note: OpenClaw 'nodes' tool not available in Cursor (skipped)

# Batch convert superpowers skills
skill-porter convert ./superpowers-skills/*.md claude-code --output ./claude-skills/
# → Converting 12 skills...
# → ✓ 10 converted successfully
# → ✗ 2 failed (missing required fields)

# Dry-run preview
skill-porter convert skill.md openclaw --dry-run
# → Preview:
# → [SKILL.md frontmatter]
# → name: my-skill
# → description: ...
```

## Success Metrics

- Converts 5+ platform formats with 90%+ accuracy
- README examples for each platform pair (5x5 = 25 combos, focus on top 10)
- npm downloads > 80/week
- Mentioned in HuggingFace skills, superpowers, or ClawHub docs

## Constraints

- Lossless conversion when possible (preserve all metadata)
- Clear warnings when features don't translate
- Fast: convert typical skill in < 1 second
- No network calls (all conversion local)

## Risk Mitigation

- **Platform feature gaps:** Some platforms have unique features (e.g., OpenClaw nodes, HF datasets). Document limitations, provide fallbacks or skip with warnings.
- **Syntax translation errors:** Command syntax varies (bash vs Python). Use AST-based translation when possible, fallback to string templates.
- **Schema drift:** Platforms evolve. Make validators pluggable for easy updates.

## Build Notes

**Estimated time:** 55 min  
**Complexity:** Medium-High (multi-format parsing, conversion logic)  
**Demo-ability:** High (before/after comparison, show cross-platform skill)  
**Publishability:** High (npm, targets multi-platform skill authors)

## Open Questions

1. Should we support inline code execution transformation (Python → bash)?
2. Publishing: integrate with platform APIs or just generate files?
3. How to handle version differences within platforms (e.g., OpenClaw 0.x vs 1.x)?

---

_This PRD solves skill portability pain. Immediate value: convert existing skills to new platforms without manual rewriting. Complements HF skills by enabling cross-platform publishing._
