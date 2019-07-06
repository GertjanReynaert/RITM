import { TranslationsShape } from './index';
import { getKeyCount } from './getKeyCount';

export const cleanUnneededKeys = (
  baseTranslations: TranslationsShape,
  translations: TranslationsShape
): { cleannedTranslations: TranslationsShape; keysRemoved: number } =>
  Object.keys(translations).reduce(
    (acc, key) => {
      const baseValue = baseTranslations[key];
      const value = translations[key];

      if (baseValue === undefined) {
        // TODO: get correct number of keys by doing a deep count into value if value is an object
        return {
          ...acc,
          keysRemoved:
            acc.keysRemoved +
            (typeof value === 'object' ? getKeyCount(value) : 1)
        };
      }

      if (typeof baseValue === 'object' && typeof value === 'object') {
        const { cleannedTranslations, keysRemoved } = cleanUnneededKeys(
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
