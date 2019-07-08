import { TranslationsShape } from './index';

export const detectUntranslatedKeys = (
  baseTranslations: TranslationsShape,
  translations: TranslationsShape,
  ignoreKeysList: Array<string>,
  keyPrefix: string = ''
): {
  untranslatedKeys: Array<string>;
  cleanedIgnoreKeysList: Array<string>;
} =>
  Object.keys(baseTranslations).reduce(
    (
      acc: {
        untranslatedKeys: Array<string>;
        cleanedIgnoreKeysList: Array<string>;
      },
      key
    ) => {
      const baseValue = baseTranslations[key];
      const value = translations[key];

      if (typeof baseValue === 'object' && typeof value === 'object') {
        const {
          untranslatedKeys,
          cleanedIgnoreKeysList
        } = detectUntranslatedKeys(
          baseValue,
          value,
          ignoreKeysList,
          keyPrefix === '' ? `${key}.` : `${keyPrefix}${key}.`
        );

        return {
          ...acc,
          untranslatedKeys: [...acc.untranslatedKeys, ...untranslatedKeys],
          cleanedIgnoreKeysList: [
            ...acc.cleanedIgnoreKeysList,
            ...cleanedIgnoreKeysList
          ]
        };
      }

      const flatKey = `${keyPrefix}${key}`;

      if (ignoreKeysList.includes(flatKey) === true) {
        return {
          ...acc,
          cleanedIgnoreKeysList: [...acc.cleanedIgnoreKeysList, flatKey]
        };
      }

      // Here the key isn't in ignoreKeysList since we already checked it above
      if (baseValue === value) {
        return { ...acc, untranslatedKeys: [...acc.untranslatedKeys, flatKey] };
      }

      return acc;
    },
    {
      untranslatedKeys: [],
      cleanedIgnoreKeysList: []
    }
  );
