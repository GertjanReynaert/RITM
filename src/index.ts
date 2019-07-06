// #!/usr/bin/env node

import { filePath, safeReadJson, safeReadYaml } from './fileReader';
import {
  logTitle,
  logSubtitle,
  logSpacer,
  logSuccess,
  printKeys
} from './printer';
import flatten from './flatten';
import { cleanUnneededKeys } from './cleanUnneededKeys';

export type TranslationsShape = {
  [key: string]: string | TranslationsShape;
};

const getMissingKeys = (
  baseLanguage: { [key: string]: string },
  translatedLanguage: { [key: string]: string }
) =>
  Object.keys(baseLanguage).filter(
    key => translatedLanguage[key] === undefined
  );

const getUntranslatedKeys = (
  baseLanguage: { [key: string]: string },
  translatedLanguage: { [key: string]: string }
) =>
  Object.keys(baseLanguage).filter(
    key => baseLanguage[key] === translatedLanguage[key]
  );

const getUnneededKeys = (
  baseLanguage: { [key: string]: string },
  translatedLanguage: { [key: string]: string }
) => getMissingKeys(translatedLanguage, baseLanguage);

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

const baseLanguageFilePath = filePath(translationsDirectory)(
  `${baseLanguage}.${fileType}`
);
const baseLanguageFile =
  fileType === 'json'
    ? safeReadJson(baseLanguageFilePath)
    : safeReadYaml(baseLanguageFilePath);
const baseLanguageFlatMap = flatten(baseLanguageFile);

let failCI = false;

[...translatedLanguages, ...optionalLanguages].forEach(languageName => {
  const optionalLanguage = optionalLanguages.includes(languageName);
  const title = languageName.toUpperCase();

  const languageFilePath = filePath(translationsDirectory)(
    `${languageName}.${fileType}`
  );
  const translations =
    fileType === 'json'
      ? safeReadJson(languageFilePath)
      : safeReadYaml(languageFilePath);
  const translationsFlatMap = flatten(translations);

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
  logSubtitle('Missing keys');
  const missingKeys = getMissingKeys(baseLanguageFlatMap, translationsFlatMap);

  if (missingKeys.length) {
    // Even for optional languages this can be done
    failCI = true;
    printKeys({ keys: missingKeys, level: 'error' });
  } else {
    logSuccess('No missing keys');
  }
  logSpacer();
});

process.exit(failCI ? 1 : 0);
