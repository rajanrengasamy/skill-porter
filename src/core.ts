import fs from 'node:fs/promises';
import path from 'node:path';
import { convertTo, outputFileName } from './convert';
import { detectFormat } from './detect';
import { parseByFormat } from './parse';
import type { SkillFormat, SkillModel } from './types';

export interface ConversionResult {
  sourceFormat: SkillFormat;
  targetFormat: SkillFormat;
  skill: SkillModel;
  outputContent: string;
  outputPath: string;
}

export function parseTargetFormat(target: string): SkillFormat {
  const normalized = target.trim().toLowerCase();

  if (normalized === 'openclaw') return 'openclaw';
  if (normalized === 'claude' || normalized === 'claude-code' || normalized === 'claudecode') return 'claude';
  if (normalized === 'cursor') return 'cursor';

  throw new Error(`Unsupported target format: ${target}. Supported: openclaw, claude, cursor.`);
}

export async function convertSkillFile(
  sourcePath: string,
  targetFormat: SkillFormat,
  outputDir?: string,
): Promise<ConversionResult> {
  const absoluteSource = path.resolve(sourcePath);
  const content = await fs.readFile(absoluteSource, 'utf8');

  const sourceFormat = detectFormat(absoluteSource, content);
  const parsedSkill = parseByFormat(sourceFormat, content, absoluteSource);
  const outputContent = convertTo(targetFormat, parsedSkill);

  const baseOutputDir = outputDir ? path.resolve(outputDir) : path.dirname(absoluteSource);
  const outputPath = path.join(baseOutputDir, outputFileName(targetFormat));

  return {
    sourceFormat,
    targetFormat,
    skill: parsedSkill,
    outputContent,
    outputPath,
  };
}

export async function writeConversion(result: ConversionResult): Promise<void> {
  await fs.mkdir(path.dirname(result.outputPath), { recursive: true });
  await fs.writeFile(result.outputPath, result.outputContent, 'utf8');
}
