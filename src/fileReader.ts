const fs = require('fs');
const path = require('path');
const { safeLoad } = require('js-yaml');

const filePath = (defaultDirectory: string) => (
  fileName: string | Array<string>
) =>
  Array.isArray(fileName)
    ? path.join(defaultDirectory, ...fileName)
    : path.join(defaultDirectory, fileName);

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

// const config = {
//   translationLanguagesDirectory: 'examples'
// };

// const examplesPath = filePath(config.translationLanguagesDirectory);

// console.log(safeReadJson(examplesPath(['json', 'en.json'])));
// console.log(safeReadYaml(examplesPath(['yaml', 'en.yaml'])));
