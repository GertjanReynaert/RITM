import { mkdirSync } from 'fs';

export const createDirectory = (path: string) =>
  mkdirSync(path, { recursive: true });
