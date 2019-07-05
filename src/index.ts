// #!/usr/bin/env node

import { filePath, safeReadJson, safeReadYaml } from './fileReader';
import {
  logTitle,
  logSubtitle,
  logSpacer,
  logSuccess,
  printKeys
} from './printer';

var flatten = (obj: { [key: string]: any }): { [key: string]: any } => {
  if (typeof obj !== 'object') return obj;

  return Object.keys(obj).reduce((flatMap, key) => {
    if (typeof obj[key] === 'object') {
      const flatObject = flatten(obj[key]);

      const flattenedSubTree = Object.keys(flatObject).reduce(
        (subtreeFlatmap, flatKey) => ({
          ...subtreeFlatmap,
          [key + '.' + flatKey]: flatObject[flatKey]
        }),
        {}
      );

      return { ...flatMap, ...flattenedSubTree };
    }

    return { ...flatMap, [key]: obj[key] };
  }, {});
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

  // printKeys({ keys, level: 'warning', truncate: 1 });

  logTitle(title);

  //=====================================
  // UNNEEDED KEYS
  //=====================================
  logSubtitle('Unneeded keys');
  const unneededKeys = getUnneededKeys(
    baseLanguageFlatMap,
    translationsFlatMap
  );

  if (unneededKeys.length) {
    // Even for optional languages this can be done
    failCI = true;
    printKeys({ keys: unneededKeys, level: 'error' });
  } else {
    logSuccess('No unneeded keys');
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
