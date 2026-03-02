#!/usr/bin/env node

import { convertSkillFile, parseTargetFormat, writeConversion } from './core';

interface CliOptions {
  dryRun: boolean;
  outputDir?: string;
}

function usage(): string {
  return `skill-porter

Usage:
  skill-porter convert <source-path> <target-format> [--dry-run] [--output <dir>]

Target formats:
  openclaw | claude | cursor

Examples:
  skill-porter convert ./SKILL.md cursor
  skill-porter convert ./AGENTS.md openclaw --output ./converted
  skill-porter convert ./.cursorrules claude --dry-run
`;
}

function parseOptions(args: string[]): { options: CliOptions; rest: string[] } {
  const options: CliOptions = { dryRun: false };
  const rest: string[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--output') {
      const value = args[i + 1];
      if (!value) {
        throw new Error('Missing value for --output');
      }
      options.outputDir = value;
      i += 1;
      continue;
    }

    rest.push(arg);
  }

  return { options, rest };
}

async function run(): Promise<void> {
  const args = process.argv.slice(2);

  if (!args.length || args.includes('--help') || args.includes('-h')) {
    console.log(usage());
    return;
  }

  const command = args[0];

  if (command !== 'convert') {
    throw new Error(`Unknown command: ${command}`);
  }

  const { options, rest } = parseOptions(args.slice(1));

  if (rest.length < 2) {
    throw new Error('convert requires <source-path> and <target-format>');
  }

  const sourcePath = rest[0];
  const targetFormat = parseTargetFormat(rest[1]);

  const result = await convertSkillFile(sourcePath, targetFormat, options.outputDir);

  console.log(`Detected source format: ${result.sourceFormat}`);
  console.log(`Target format: ${result.targetFormat}`);

  if (result.skill.warnings.length) {
    for (const warning of result.skill.warnings) {
      console.warn(`Warning: ${warning}`);
    }
  }

  if (options.dryRun) {
    console.log('\n--- Dry Run Preview ---\n');
    console.log(result.outputContent);
    return;
  }

  await writeConversion(result);
  console.log(`✓ Converted skill written to ${result.outputPath}`);
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
