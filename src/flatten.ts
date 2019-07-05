const flatten = (obj: { [key: string]: any }): { [key: string]: any } => {
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

export default flatten;
