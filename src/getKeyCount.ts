import { TranslationsShape } from './index';

export const getKeyCount = (obj: TranslationsShape): number =>
  Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (typeof value === 'object') {
      // count the actual container key + all contained keys
      return acc + 1 + getKeyCount(value);
    }

    return acc + 1;
  }, 0);
