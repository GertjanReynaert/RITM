# RITM

RITM will help you in managing your translations.
Hereby it will give you the current status of your translation, removing
translations that aren't used any longer, adding those that are missing, and
telling you what keys are still not translated.

You'll still need to update the translations manually in your json files, but
now you know what messages you still need to update.

## Installing

```
yarn add --dev ritm
```

or

```
npm i --save-dev ritm
```

## Setup

### Basic

This is an example of the most basic usage of this plugin, in the API documentation below you can find more options.

Create a script in your package.json

```json
{
  "scripts": {
    "manage:translations": "node manageTranslations.js"
  }
}
```

Create a file with your config you can run with the npm script

```js
// manageTranslations.js
const { manageTranslations } = require('ritm');

// es2015 import
// import { manageTranslations } from 'ritm';

manageTranslations({
  fileType: 'json',
  baseLanguage: 'en',
  translatedLanguages: ['nl'], // any language you want to enforce
  optionalLanguages: ['ja'], // any language you want info but not enforced
  translationsDirectory: 'src/i18n' // path to translations from project folder
});
```

Run the translation manager with your new npm script

```
npm run manage:translations
```

## Usage

Now you can check the status of your translations by just running the script. Then
you can change the missing translations in the translation files.

If you encounter messages that are identical in translation in a certain
language as in your default language (example: Dashboard (english) = Dashboard (dutch)),
then you can approve the translation-key in the language specific status
file. This will prevent the message from showing up as untranslated when
checking the translations status.

## API

### manageTranslations

This will maintain all translation files. Based on your config, you will get
per specified language the keys that are missing translations. This script will
also remove keys in language files if they aren't used anymore in the base
language file, and reversely, add keys to the language files that are missing
when compared to the base language file.

It will also maintain a status file per language
where you can specify translation keys where the translation is identical to
the default message. This way you can avoid untranslated message warnings for
these messages.

#### Status files

When you run manageTranslations a new status file will be created. Here you'll
find an object shaped like this:

```
{
  "approved": [],
  "pending": []
}
```

Every time untranslated keys are found they'll be added to pending. If that same
key get's translated it'll automatically be removed from pending.

In case you can't translate because the translation is identical, you can
manually move the key to approved. This way the key will no longer show up as
untranslated.

You'll notice that once a key is removed from the translations files, it will
automatically be removed from the `approved` list, and the `approved` list will
always be sorted based on the order keys appear in in your base translations file.

#### Config

- `fileType` (required),

  - extension of your translation files, both `json` and `yaml` are supported
  - options: 'json' | 'yaml' | 'yml'

- `baseLanguage` (string, required),

  - this is the language you're using as single source of truth
  - example: `en`

- `translatedLanguages` (Array<string>, required),

  - this is the list of languages you want to enforce translations for
  - example: `["nl", "fr"]`

- `optionalLanguages` (Array<string>, required),

  - this is the list of languages you want to maintain translation keys without
    blocking ci
  - example: `["ja"]`

- `translationsDirectory` (string, required),
  - this is the path to your translations starting from the project folder
  - example: `src/i18n`

# License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
