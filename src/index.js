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
  componentDidMount() {
    this.refs.textbox.focus()
  }

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
      >
        <box width="100%" height={1} >
          <text>No translation found for:</text>
        </box>
        <box width="100%" height={1} >
          <text align="center">conversations.planning.addQuestion</text>
        </box>
        <box
          width="100%"
          height="100%-3"
          class={stylesheet.bordered}
        >
          <textbox  ref="textbox" inputOnFocus/>
        </box>
        <box
          width="50%"
          height={1}
          top="100%-1"
        >
          <button style={{bg:'blue'}}>Mark as identical</button>
        </box>
        <box
          width="50%"
          height={1}
          left="50%"
          top="100%-1"
        >
          <button style={{bg:'red'}}>Save</button>
        </box>
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
