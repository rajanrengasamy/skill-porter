import path from 'node:path';
import matter from 'gray-matter';
import type { SkillFormat } from './types';

export function detectFormat(sourcePath: string, content: string): SkillFormat {
  const base = path.basename(sourcePath).toLowerCase();

  if (base === 'skill.md') return 'openclaw';
  if (base === 'agents.md' || base === 'claude.md') return 'claude';
  if (base === '.cursorrules') return 'cursor';

  const parsed = matter(content);
  const data = parsed.data as Record<string, unknown>;

  if (typeof data.name === 'string' && typeof data.description === 'string') {
    if ('metadata' in data || /openclaw/i.test(content)) return 'openclaw';
  }

  if (/\bclaude code\b/i.test(content) || /\bagents\.md\b/i.test(content)) {
    return 'claude';
  }

  if (/\bcursor\b/i.test(content) && /\brules\b/i.test(content)) {
    return 'cursor';
  }

  if (/^#{1,3}\s*tools\b/im.test(content) && /^#{1,3}\s*commands\b/im.test(content)) {
    return 'claude';
  }

  if (/^[-*]\s*(always|never|prefer)\b/im.test(content)) {
    return 'cursor';
  }

  throw new Error(`Unable to detect skill format for: ${sourcePath}`);
}
