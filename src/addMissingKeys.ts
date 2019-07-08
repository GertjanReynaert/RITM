import { TranslationsShape } from './index';
// TODO: get rid of keysRemoved and collect added key value pairs
import { getKeyCount } from './getKeyCount';

export const addMissingKeys = (
  baseTranslations: TranslationsShape,
  translations: TranslationsShape
): { cleannedTranslations: TranslationsShape; keysRemoved: number } =>
  Object.keys(baseTranslations).reduce(
    (acc, key) => {
      const baseValue = baseTranslations[key];
      const value = translations[key];

      if (value === undefined) {
        return {
          cleannedTranslations: {
            ...acc.cleannedTranslations,
            [key]: baseValue
          },
          keysRemoved:
            acc.keysRemoved +
            (typeof value === 'object' ? getKeyCount(value) : 1)
        };
      }

      if (typeof baseValue === 'object' && typeof value === 'object') {
        const { cleannedTranslations, keysRemoved } = addMissingKeys(
          baseValue,
          value
        );

        return {
          cleannedTranslations: {
            ...acc.cleannedTranslations,
            [key]: cleannedTranslations
          },
          keysRemoved: acc.keysRemoved + keysRemoved
        };
      }

      return {
        ...acc,
        cleannedTranslations: { ...acc.cleannedTranslations, [key]: value }
      };
    },
    { cleannedTranslations: {}, keysRemoved: 0 }
  );
