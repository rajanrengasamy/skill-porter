import yaml from 'js-yaml';
import type { SkillFormat, SkillModel } from './types';

function renderList(items: string[]): string {
  if (!items.length) return '- _none detected_';
  return items.map((item) => `- ${item}`).join('\n');
}

function renderExamples(examples: string[]): string {
  if (!examples.length) return 'No examples detected in source skill.';

  return examples
    .map((example) => {
      if (example.startsWith('```')) return example;
      return `- ${example}`;
    })
    .join('\n\n');
}

export function outputFileName(format: SkillFormat): string {
  switch (format) {
    case 'openclaw':
      return 'SKILL.md';
    case 'claude':
      return 'AGENTS.md';
    case 'cursor':
      return '.cursorrules';
    default:
      throw new Error(`Unsupported target format: ${format}`);
  }
}

export function toOpenClaw(skill: SkillModel): string {
  const frontmatter = yaml.dump({
    name: skill.name,
    description: skill.description,
  });

  return `---\n${frontmatter}---\n\n# ${skill.name}\n\n${skill.description}\n\n## Commands\n\n${renderList(skill.commands)}\n\n## Tools\n\n${renderList(skill.tools)}\n\n## Examples\n\n${renderExamples(skill.examples)}\n`;
}

export function toClaude(skill: SkillModel): string {
  return `# ${skill.name}\n\n${skill.description}\n\n## Commands\n\n${renderList(skill.commands)}\n\n## Tools\n\n${renderList(skill.tools)}\n\n## Examples\n\n${renderExamples(skill.examples)}\n`;
}

export function toCursor(skill: SkillModel): string {
  return `# ${skill.name}\n\n${skill.description}\n\n## Rules\n- Follow project conventions\n- Keep responses actionable and concise\n\n## Commands\n${renderList(skill.commands)}\n\n## Tools\n${renderList(skill.tools)}\n\n## Examples\n${renderExamples(skill.examples)}\n`;
}

export function convertTo(format: SkillFormat, skill: SkillModel): string {
  switch (format) {
    case 'openclaw':
      return toOpenClaw(skill);
    case 'claude':
      return toClaude(skill);
    case 'cursor':
      return toCursor(skill);
    default:
      throw new Error(`Unsupported target format: ${format}`);
  }
}
