// #!/usr/bin/env node

import { filePath, safeReadJson, safeReadYaml } from './fileReader';
import {
  logTitle,
  logSubtitle,
  logSpacer,
  logSuccess,
  printKeys
} from './printer';

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

const keys = Object.keys(baseLanguageFile);

logTitle(baseLanguage);
logSubtitle('test');
logSpacer();
logSuccess('success');
printKeys({ keys, level: 'warning', truncate: 1 });
