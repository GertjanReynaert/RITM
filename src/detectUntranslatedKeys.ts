import { TranslationsShape } from './index';

export const detectUntranslatedKeys = (
  baseTranslations: TranslationsShape,
  translations: TranslationsShape,
  ignoreKeysList: Array<string>,
  keyPrefix: string = ''
): Array<string> =>
  Object.keys(baseTranslations).reduce((acc: Array<string>, key) => {
    const baseValue = baseTranslations[key];
    const value = translations[key];

    if (typeof baseValue === 'object' && typeof value === 'object') {
      const untranslatedKeys = detectUntranslatedKeys(
        baseValue,
        value,
        ignoreKeysList,
        keyPrefix === '' ? `${key}.` : `${keyPrefix}${key}.`
      );

      return [...acc, ...untranslatedKeys];
    }

    const flatKey = `${keyPrefix}${key}`;

    if (baseValue === value && ignoreKeysList.includes(flatKey) === false) {
      return [...acc, flatKey];
    }

    return acc;
  }, []);
