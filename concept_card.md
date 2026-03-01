# Skill Porter

**One-line pitch:** Migrate agent skills between HuggingFace, superpowers, Claude, and OpenClaw formats

**Score:** 8.20 (Rank #5)

## Problem → Solution

Agent skills are platform-locked. Developers want to port HF skills to OpenClaw, convert superpowers to Claude Code, or publish one skill to multiple platforms. Current approach: manual rewriting.

**Skill Porter** detects source format, parses structure, converts to target platform with proper conventions, validates output, and generates platform-specific extras.

## Demo Instructions

```bash
npm install -g skill-porter

# Convert HF skill to OpenClaw
skill-porter convert ~/.cache/huggingface/skills/text-summary.py openclaw
# → Detected: HuggingFace Python skill
# → ✓ Converted: text-summary/SKILL.md
# → ✓ Generated: package.json, README

# Convert OpenClaw to Cursor
skill-porter convert ~/.openclaw/skills/github/SKILL.md cursor
# → ✓ Converted: .cursorrules
# → ⚠ Note: 'nodes' tool not available in Cursor (skipped)

# Batch convert
skill-porter convert ./skills/*.md claude-code --output ./claude-skills/
# → ✓ 10 converted, ✗ 2 failed (missing fields)
```

## Stats

- **Stack:** TypeScript, gray-matter, js-yaml, remark
- **Completion:** 0% (PRD ready, build not started)
- **Working features:** PRD complete
- **Stubbed features:** parsers (5 formats), converters (5 targets), validators

## Morning Action

**VERDICT: KEEP BUILDING**

- Enables cross-platform publishing (HF 6.7K stars, 711 today)
- Solves skill portability pain
- Solo-buildable in 55 min
- Needs 2-3 format pairs working before ship (e.g., OpenClaw ↔ Claude, HF → OpenClaw)

Build parsers for OpenClaw + Claude, test bidirectional conversion, then ship v0.1.
