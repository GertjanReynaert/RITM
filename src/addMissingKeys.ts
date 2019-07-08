import { TranslationsShape } from './index';

export const addMissingKeys = (
  baseTranslations: TranslationsShape,
  translations: TranslationsShape,
  keyPrefix: string = ''
): {
  cleanedTranslations: TranslationsShape;
  keysAdded: Array<{ key: string; value: string }>;
} =>
  Object.keys(baseTranslations).reduce(
    (
      acc: {
        cleanedTranslations: TranslationsShape;
        keysAdded: Array<{ key: string; value: string }>;
      },
      key
    ) => {
      const baseValue = baseTranslations[key];
      const value = translations[key];

      if (value === undefined) {
        return {
          cleanedTranslations: {
            ...acc.cleanedTranslations,
            [key]: baseValue
          },
          keysAdded: [
            ...acc.keysAdded,
            ...(typeof baseValue === 'object'
              ? [{ key: `${keyPrefix}${key}`, value: '' }]
              : [{ key: `${keyPrefix}${key}`, value: baseValue }])
          ]
        };
      }

      if (typeof baseValue === 'object' && typeof value === 'object') {
        const { cleanedTranslations, keysAdded } = addMissingKeys(
          baseValue,
          value,
          keyPrefix === '' ? `${key}.` : `${keyPrefix}${key}.`
        );

        return {
          cleanedTranslations: {
            ...acc.cleanedTranslations,
            [key]: cleanedTranslations
          },
          keysAdded: [...acc.keysAdded, ...keysAdded]
        };
      }

      return {
        ...acc,
        cleanedTranslations: { ...acc.cleanedTranslations, [key]: value }
      };
    },
    { cleanedTranslations: {}, keysAdded: [] }
  );
