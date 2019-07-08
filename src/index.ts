// #!/usr/bin/env node

import { filePath } from './filePath';
import { createDirectory } from './createDirectory';
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
import { detectUntranslatedKeys } from './detectUntranslatedKeys';

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

const getFilePath = filePath(translationsDirectory);
const baseLanguageFilePath = getFilePath(`${baseLanguage}.${fileType}`);
const baseLanguageFile = fileReader(baseLanguageFilePath);

let failCI = false;

//=====================================
// SETUP OF ARTIFACTS FILE STRUCTURE
//=====================================
const artifactsDirectory = '.translations_manager';
const statusFilesDirectory = 'status_files';

createDirectory(getFilePath(artifactsDirectory));
createDirectory(getFilePath([artifactsDirectory, statusFilesDirectory]));

//=====================================
// RUN OVER ALL LANGUAGES
//=====================================

[...translatedLanguages, ...optionalLanguages].forEach(languageName => {
  const optionalLanguage = optionalLanguages.includes(languageName);
  const title = languageName.toUpperCase();

  const languageFileName = `${languageName}.${fileType}`;
  const languageFilePath = filePath(translationsDirectory)(languageFileName);
  const translations = fileReader(languageFilePath);

  const statusFilePath = getFilePath([
    artifactsDirectory,
    statusFilesDirectory,
    languageFileName
  ]);
  const statusFile = safeReadJson(statusFilePath) || {
    approved: [],
    pending: []
  };

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

  //=====================================
  // UNTRANSLATED KEYS
  //=====================================
  logSubtitle('Untranslated keys');

  const untranslatedKeys = detectUntranslatedKeys(
    baseLanguageFile,
    cleanedTranslations,
    statusFile.approved
  );

  const draftStatusFile = { ...statusFile, pending: untranslatedKeys };

  if (untranslatedKeys.length) {
    if (optionalLanguage === false) {
      failCI = true;
    }

    printKeys({
      keys: untranslatedKeys,
      level: optionalLanguage ? 'warning' : 'error',
      truncate: 10
    });
  } else {
    logSuccess('No untranslated keys');
  }
  logSpacer();

  fileWriter(languageFilePath, cleanedTranslations);
  safeWriteJson(statusFilePath, draftStatusFile);
});

process.exit(failCI ? 1 : 0);
