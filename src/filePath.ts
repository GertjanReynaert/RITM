import path from 'path';

export const filePath = (defaultDirectory: string) => (
  fileName: string | Array<string>
) =>
  Array.isArray(fileName)
    ? path.join(defaultDirectory, ...fileName)
    : path.join(defaultDirectory, fileName);
