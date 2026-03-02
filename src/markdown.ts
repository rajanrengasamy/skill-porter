export function getFirstHeading(markdown: string): string | undefined {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim();
}

export function getFirstParagraph(markdown: string): string {
  const lines = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (const line of lines) {
    if (line.startsWith('#')) continue;
    if (/^[-*]\s+/.test(line)) continue;
    if (/^\d+\.\s+/.test(line)) continue;
    if (line.startsWith('```')) continue;
    return line;
  }

  return '';
}

export function getSection(markdown: string, names: string[]): string {
  const targetNames = names.map((name) => name.toLowerCase());
  const lines = markdown.split(/\r?\n/);
  let inSection = false;
  const buffer: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);

    if (headingMatch) {
      const heading = headingMatch[1].trim().toLowerCase();
      if (targetNames.some((name) => heading === name || heading.startsWith(`${name} `))) {
        inSection = true;
        continue;
      }

      if (inSection) {
        break;
      }
    }

    if (inSection) {
      buffer.push(line);
    }
  }

  return buffer.join('\n').trim();
}

export function getColonSection(text: string, label: string): string {
  const pattern = new RegExp(
    `(?:^|\\n)${label}\\s*:\\s*([\\s\\S]*?)(?=\\n[A-Za-z][A-Za-z\\s]+\\s*:\\s*|\\n#{1,6}\\s|$)`,
    'i',
  );

  const match = text.match(pattern);
  return match?.[1]?.trim() ?? '';
}

export function extractListItems(text: string): string[] {
  const items = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim())
    .filter(Boolean);

  return dedupe(items);
}

export function extractCodeBlocks(text: string): string[] {
  const matches = text.match(/```[\s\S]*?```/g) ?? [];
  const cleaned = matches.map((block) => block.trim());
  return dedupe(cleaned);
}

export function dedupe<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function normalizeList(items: string[]): string[] {
  return dedupe(
    items
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => item.replace(/\s+/g, ' ')),
  );
}
