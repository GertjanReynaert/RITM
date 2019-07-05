const { log } = console;

export const logSpacer = () => console.log(' ');

export const logTitle = (language: string) => {
  const titleLine =
    '++============================================================================++';
  const spacesPadding = (titleLine.length - 4 - language.length) / 2;
  const paddedTitle = language
    .padStart(spacesPadding + language.length, ' ')
    .padEnd(spacesPadding * 2 + language.length, ' ');

  log(titleLine);
  log(`||${paddedTitle}||`);
  log(titleLine);
  logSpacer();
};

export const logSubtitle = (subtitle: string) => {
  log(subtitle);
  log('---------------------------------------');
  logSpacer();
};

export const logSuccess = (message: string) => {
  log('✅ ', message);
};

export const printKeys = ({
  keys,
  level,
  truncate
}: {
  keys: Array<string>;
  level: 'error' | 'warning';
  truncate?: number;
}) => {
  const keysToPrint = truncate ? keys.slice(0, truncate) : keys;
  const sign = level === 'error' ? '🚫' : '⚠️ ';

  keysToPrint.forEach(key => log(sign, key));

  const amountOfExtraKeys = keys.length - keysToPrint.length;

  if (amountOfExtraKeys > 0) {
    logSpacer();

    const keyString = amountOfExtraKeys === 1 ? 'key' : 'keys';
    log(sign, `${amountOfExtraKeys} extra ${keyString} found`);
  }
};
