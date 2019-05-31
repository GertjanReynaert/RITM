'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.safeReadYaml = exports.safeReadJson = void 0;

const fs = require('fs');

const path = require('path');

const { safeLoad } = require('js-yaml');

const filePath = defaultDirectory => fileName =>
  Array.isArray(fileName)
    ? path.join(defaultDirectory, ...fileName)
    : path.join(defaultDirectory, fileName);

const safeReadJson = path => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    return undefined;
  }
};

exports.safeReadJson = safeReadJson;

const safeReadYaml = path => {
  try {
    return safeLoad(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    return undefined;
  }
}; // const config = {
//   translationLanguagesDirectory: 'examples'
// };
// const examplesPath = filePath(config.translationLanguagesDirectory);
// console.log(safeReadJson(examplesPath(['json', 'en.json'])));
// console.log(safeReadYaml(examplesPath(['yaml', 'en.yaml'])));

exports.safeReadYaml = safeReadYaml;