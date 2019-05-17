"use strict";

var _react = _interopRequireWildcard(require("react"));

var _neoBlessed = _interopRequireDefault(require("neo-blessed"));

var _reactBlessed = require("react-blessed");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const render = (0, _reactBlessed.createBlessedRenderer)(_neoBlessed.default);
const stylesheet = {
  bordered: {
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'blue'
      }
    }
  }
}; // Rendering a simple centered box

class App extends _react.Component {
  render() {
    return _react.default.createElement("element", null, _react.default.createElement("box", {
      label: "Default language",
      width: "40%",
      height: 3,
      class: stylesheet.bordered
    }, "en.json"), _react.default.createElement("box", {
      width: "40%",
      height: "100%-3",
      top: 3,
      class: stylesheet.bordered,
      label: "Summary"
    }, _react.default.createElement("listtable", {
      align: "left",
      pad: 2,
      rows: [['Language', 'Status'], [], ["nl.json"], ["  - Unneeded keys", "✅"], ["  - Missing keys", "✅"], ["  - Untranslated keys", "✅"], ["  - Altered keys", "✅"], [" "], ["fr.json"], ["  - Unneeded keys", "✅"], ["  - Missing keys", "✅"], ["  - Untranslated keys", "🚫"], ["  - Altered keys", "✅"], [" "], ["ja.json (optional)"], ["  - Unneeded keys", "✅"], ["  - Missing keys", "✅"], ["  - Untranslated keys", "⚠️"], ["  - Altered keys", "⏳"]]
    })), _react.default.createElement("box", {
      label: "Interactive editor",
      left: "40%",
      width: "60%",
      height: "100%",
      class: stylesheet.bordered
    }, _react.default.createElement("layout", {
      width: "90%",
      height: "90%",
      layout: "grid"
    }, _react.default.createElement("text", null, "Hello World!"), _react.default.createElement("button", null, "Mark as identical"), _react.default.createElement("button", null, "save"))));
  }

} // Creating our screen


const screen = _neoBlessed.default.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'RITM 2'
}); // Adding a way to quit the program


screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
}); // Rendering the React app using our screen

const component = render(_react.default.createElement(App, null), screen);