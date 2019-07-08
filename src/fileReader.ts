import fs from 'fs';
import { safeLoad } from 'js-yaml';
import { filePath } from './filePath';

export const safeReadJson = (path: string) => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    return undefined;
  }
};

export const safeReadYaml = (path: string) => {
  try {
    return safeLoad(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    return undefined;
  }
};
