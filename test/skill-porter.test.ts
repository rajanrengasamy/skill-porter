import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { convertSkillFile, parseTargetFormat, writeConversion } from '../src/core';
import { detectFormat } from '../src/detect';
import { parseOpenClaw } from '../src/parse';

const openClawFixture = `---
name: github-helper
description: Assist with GitHub issue triage
---

# github-helper

Assist with GitHub issue triage

## Commands

- gh issue list --limit 10
- gh pr list --state open

## Tools

- gh
- jq

## Examples

\`\`\`bash
gh issue list --label bug --limit 5
\`\`\`
`;

test('detectFormat detects OpenClaw SKILL.md', () => {
  const format = detectFormat('/tmp/my-skill/SKILL.md', openClawFixture);
  assert.equal(format, 'openclaw');
});

test('parseOpenClaw extracts key skill fields', () => {
  const skill = parseOpenClaw(openClawFixture, '/tmp/my-skill/SKILL.md');
  assert.equal(skill.name, 'github-helper');
  assert.equal(skill.description, 'Assist with GitHub issue triage');
  assert.deepEqual(skill.commands, ['gh issue list --limit 10', 'gh pr list --state open']);
  assert.deepEqual(skill.tools, ['gh', 'jq']);
  assert.equal(skill.examples.length, 1);
});

test('convertSkillFile converts OpenClaw to Cursor and writes output', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'skill-porter-'));
  const sourcePath = path.join(tempDir, 'SKILL.md');
  await fs.writeFile(sourcePath, openClawFixture, 'utf8');

  const result = await convertSkillFile(sourcePath, parseTargetFormat('cursor'), tempDir);

  assert.equal(result.sourceFormat, 'openclaw');
  assert.equal(path.basename(result.outputPath), '.cursorrules');
  assert.match(result.outputContent, /# github-helper/);
  assert.match(result.outputContent, /## Commands/);
  assert.match(result.outputContent, /gh issue list --limit 10/);

  await writeConversion(result);
  const written = await fs.readFile(result.outputPath, 'utf8');
  assert.match(written, /## Tools/);
});
