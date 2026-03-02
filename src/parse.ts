import matter from 'gray-matter';
import path from 'node:path';
import {
  dedupe,
  extractCodeBlocks,
  extractListItems,
  getColonSection,
  getFirstHeading,
  getFirstParagraph,
  getSection,
  normalizeList,
} from './markdown';
import type { SkillFormat, SkillModel } from './types';

function fallbackName(sourcePath: string): string {
  return path.basename(path.dirname(sourcePath)) || 'unnamed-skill';
}

function buildModel(
  format: SkillFormat,
  name: string,
  description: string,
  commands: string[],
  tools: string[],
  examples: string[],
): SkillModel {
  const warnings: string[] = [];

  if (!name.trim()) warnings.push('Missing skill name; using fallback name.');
  if (!description.trim()) warnings.push('Missing description.');

  return {
    format,
    name: name.trim() || 'unnamed-skill',
    description: description.trim(),
    commands: normalizeList(commands),
    tools: normalizeList(tools),
    examples: dedupe(examples.map((item) => item.trim()).filter(Boolean)),
    warnings,
  };
}

export function parseOpenClaw(content: string, sourcePath: string): SkillModel {
  const parsed = matter(content);
  const data = parsed.data as Record<string, unknown>;
  const body = parsed.content;

  const name =
    (typeof data.name === 'string' ? data.name : undefined) ??
    getFirstHeading(body) ??
    fallbackName(sourcePath);

  const description =
    (typeof data.description === 'string' ? data.description : undefined) ?? getFirstParagraph(body);

  const commandSection = getSection(body, ['commands', 'usage']);
  const toolSection = getSection(body, ['tools']);
  const exampleSection = getSection(body, ['examples', 'example']);

  const metaTools =
    (data.metadata as { openclaw?: { requires?: { anyBins?: string[] } } } | undefined)?.openclaw
      ?.requires?.anyBins ?? [];

  return buildModel(
    'openclaw',
    name,
    description,
    extractListItems(commandSection),
    [...extractListItems(toolSection), ...metaTools],
    [...extractCodeBlocks(exampleSection), ...extractListItems(exampleSection)],
  );
}

export function parseClaude(content: string, sourcePath: string): SkillModel {
  const parsed = matter(content);
  const data = parsed.data as Record<string, unknown>;
  const body = parsed.content;

  const heading = getFirstHeading(body);

  const nameFromHeading =
    heading && !/^(agents(\.md)?|claude(\.md)?|claude code)$/i.test(heading) ? heading : undefined;

  const descriptionSection = getSection(body, ['description']);

  const name =
    (typeof data.name === 'string' ? data.name : undefined) ??
    nameFromHeading ??
    fallbackName(sourcePath);

  const description =
    ((typeof data.description === 'string' ? data.description : undefined) ?? descriptionSection) ||
    getFirstParagraph(body);

  const commandSection = getSection(body, ['commands', 'command']);
  const toolSection = getSection(body, ['tools', 'tooling']);
  const exampleSection = getSection(body, ['examples', 'example']);

  return buildModel(
    'claude',
    name,
    description,
    extractListItems(commandSection),
    extractListItems(toolSection),
    [...extractCodeBlocks(exampleSection), ...extractListItems(exampleSection)],
  );
}

export function parseCursor(content: string, sourcePath: string): SkillModel {
  const parsed = matter(content);
  const data = parsed.data as Record<string, unknown>;
  const body = parsed.content;

  const heading = getFirstHeading(body);
  const name =
    (typeof data.name === 'string' ? data.name : undefined) ?? heading ?? fallbackName(sourcePath);

  const descriptionSection = getSection(body, ['description']);
  const description =
    ((typeof data.description === 'string' ? data.description : undefined) ?? descriptionSection) ||
    getFirstParagraph(body);

  const commandSection =
    getSection(body, ['commands', 'workflow']) || getColonSection(body, 'Commands');
  const toolSection = getSection(body, ['tools']) || getColonSection(body, 'Tools');
  const exampleSection = getSection(body, ['examples', 'example']) || getColonSection(body, 'Examples');

  return buildModel(
    'cursor',
    name,
    description,
    extractListItems(commandSection),
    extractListItems(toolSection),
    [...extractCodeBlocks(exampleSection), ...extractListItems(exampleSection)],
  );
}

export function parseByFormat(format: SkillFormat, content: string, sourcePath: string): SkillModel {
  switch (format) {
    case 'openclaw':
      return parseOpenClaw(content, sourcePath);
    case 'claude':
      return parseClaude(content, sourcePath);
    case 'cursor':
      return parseCursor(content, sourcePath);
    default:
      throw new Error(`Unsupported source format: ${format}`);
  }
}
