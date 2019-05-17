import React, {Component} from 'react';
import blessed from 'neo-blessed';
import {createBlessedRenderer} from 'react-blessed';

const render = createBlessedRenderer(blessed);

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
};

// Rendering a simple centered box
class App extends Component {
  render() {
    return (
      <element>
        <box
          label="Default language"
          width="40%"
          height={3}
          class={stylesheet.bordered}
        >
          en.json
        </box>

        <box
          width="40%"
          height="100%-3"
          top={3}
          class={stylesheet.bordered}
          label="Summary"
        >
          <listtable align="left" pad={2} rows={[
            ['Language', 'Status'],
            [],
            ["nl.json"],
            ["  - Unneeded keys", "✅"],
            ["  - Missing keys", "✅"],
            ["  - Untranslated keys", "✅"],
            ["  - Altered keys", "✅"],
            [" "],
            ["fr.json"],
            ["  - Unneeded keys", "✅"],
            ["  - Missing keys", "✅"],
            ["  - Untranslated keys","🚫" ],
            ["  - Altered keys", "✅"],
            [" "],
            ["ja.json (optional)"],
            ["  - Unneeded keys", "✅"],
            ["  - Missing keys", "✅"],
            ["  - Untranslated keys", "⚠️"],
            ["  - Altered keys", "⏳"],
          ]}/>
        </box>

        <box
          label="Interactive editor"
          left="40%"
          width="60%"
          height="100%"
          class={stylesheet.bordered}
        >
      <layout
          width="90%"
          height="90%"
          layout="grid"
      >
          <text>Hello World!</text>
          <button>Mark as identical</button>
          <button>save</button>
      </layout>
        </box>
      </element>
    );
  }
}

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'RITM 2',
});

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Rendering the React app using our screen
const component = render(<App />, screen);
