export type SkillFormat = 'openclaw' | 'claude' | 'cursor';

export interface SkillModel {
  format: SkillFormat;
  name: string;
  description: string;
  commands: string[];
  tools: string[];
  examples: string[];
  warnings: string[];
}

export interface ConvertOptions {
  dryRun?: boolean;
  outputDir?: string;
}
