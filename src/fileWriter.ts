import fs from 'fs';
import { safeDump } from 'js-yaml';

import { filePath } from './filePath';

import { TranslationsShape } from './index';

const writeFile = (path: string, content: string) =>
  fs.writeFileSync(path, `${content}\n`);

export const safeWriteJson = (path: string, content: Object) => {
  const contentString = JSON.stringify(content, null, 2);
  writeFile(path, contentString);
};

export const safeWriteYaml = (path: string, content: TranslationsShape) => {
  const contentString = safeDump(content);
  writeFile(path, contentString);
};
