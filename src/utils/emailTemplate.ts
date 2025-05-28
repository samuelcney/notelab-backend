import { readFileSync } from 'fs';
import { join } from 'path';

interface TemplateData {
  [key: string]: string;
}

export function renderEmailTemplate(
  templateName: string,
  data: TemplateData,
): string {
  const filePath = join(
    process.cwd(),
    'src',
    'templates',
    `${templateName}.html`,
  );

  let template = readFileSync(filePath, 'utf8');

  for (const key in data) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    template = template.replace(regex, data[key]);
  }

  return template;
}
