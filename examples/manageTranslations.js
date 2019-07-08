const { manageTranslations } = require('RITM');

manageTranslations({
  fileType: 'json',
  baseLanguage: 'en',
  translatedLanguages: ['nl'],
  optionalLanguages: ['ja'],
  translationsDirectory: 'json'
});
