// #!/usr/bin/env node

import { filePath, safeReadJson, safeReadYaml } from './fileReader';

type RITMConfigShape = {
  fileType: 'json' | 'yaml' | 'yml';
  baseLanguage: string;
  translatedLanguages: Array<string>;
  translationsDirectory: string;
};

const {
  fileType,
  baseLanguage,
  translatedLanguages,
  translationsDirectory
}: RITMConfigShape = safeReadJson('./package.json').RITM;

const baseLanguageFilePath = filePath(translationsDirectory)(
  `${baseLanguage}.${fileType}`
);
const baseLanguageFile =
  fileType === 'json'
    ? safeReadJson(baseLanguageFilePath)
    : safeReadYaml(baseLanguageFilePath);

console.log(baseLanguageFilePath);
console.log(baseLanguageFile);
