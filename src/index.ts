// #!/usr/bin/env node

import { filePath } from './filePath';
import { safeReadJson, safeReadYaml } from './fileReader';
import { safeWriteJson, safeWriteYaml } from './fileWriter';
import {
  logTitle,
  logSubtitle,
  logSpacer,
  logSuccess,
  printKeys
} from './printer';
import { cleanUnneededKeys } from './cleanUnneededKeys';
import { addMissingKeys } from './addMissingKeys';

export type TranslationsShape = {
  [key: string]: string | TranslationsShape;
};

type RITMConfigShape = {
  fileType: 'json' | 'yaml' | 'yml';
  baseLanguage: string;
  translatedLanguages: Array<string>;
  optionalLanguages: Array<string>;
  translationsDirectory: string;
};

const {
  fileType,
  baseLanguage,
  translatedLanguages,
  optionalLanguages,
  translationsDirectory
}: RITMConfigShape = safeReadJson('./package.json').RITM;

const fileReader = fileType === 'json' ? safeReadJson : safeReadYaml;

const fileWriter = fileType === 'json' ? safeWriteJson : safeWriteYaml;

const baseLanguageFilePath = filePath(translationsDirectory)(
  `${baseLanguage}.${fileType}`
);
const baseLanguageFile = fileReader(baseLanguageFilePath);

let failCI = false;

[...translatedLanguages, ...optionalLanguages].forEach(languageName => {
  const optionalLanguage = optionalLanguages.includes(languageName);
  const title = languageName.toUpperCase();

  const languageFilePath = filePath(translationsDirectory)(
    `${languageName}.${fileType}`
  );
  const translations = fileReader(languageFilePath);

  const { cleannedTranslations, keysRemoved } = cleanUnneededKeys(
    baseLanguageFile,
    translations
  );

  logTitle(title);

  //=====================================
  // UNNEEDED KEYS
  //=====================================
  logSubtitle('Unneeded keys');
  if (keysRemoved === 0) {
    logSuccess('No unneeded keys found');
  } else if (keysRemoved === 1) {
    logSuccess('1 unneeded key removed');
  } else {
    logSuccess(`${keysRemoved} unneeded keys removed`);
  }

  logSpacer();

  //=====================================
  // MISSING KEYS
  //=====================================

  const { cleanedTranslations, keysAdded } = addMissingKeys(
    baseLanguageFile,
    translations
  );

  if (keysAdded.length === 0) {
    logSubtitle('Missing keys');
    logSuccess('No missing keys');
  } else {
    logSubtitle('Missing keys (auto-added)');
    keysAdded.map(({ key }) => key).forEach(logSuccess);
  }
  logSpacer();

  fileWriter(languageFilePath, cleanedTranslations);
});

process.exit(failCI ? 1 : 0);
