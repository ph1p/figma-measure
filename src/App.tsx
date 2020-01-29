import React, { FunctionComponent, useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import Home from './views/Home';
import Tooltip from './views/Tooltip';
import Angle from './views/Angle';
import Presets from './views/Presets';

import { sendMessage, AppProvider } from './shared';

import './figma-ui/main.min.css';
import './ui.css';

const Main = styled.div<{ selection: boolean }>`
  position: relative;

  .align-icon,
  .align-icon::after,
  .align-icon::before {
    pointer-events: none;
    opacity: 0.5;
  }
  ${p =>
    p.selection
      ? `.align-icon,
  .align-icon::after,
  .align-icon::before {
    pointer-events: all;
    cursor: pointer;
    opacity: 1;
  }`
      : ''}
`;

const App: FunctionComponent = () => {
  const [selection, setSelection] = useState<[]>([]);
  const [tooltipSettings, setTooltipSettings] = useState({});

  useEffect(() => {
    // check selection
    sendMessage('init');

    window.onmessage = event => {
      if (event.data.pluginMessage.type === 'selection') {
        setSelection(event.data.pluginMessage.data);
      }
      if (event.data.pluginMessage.type === 'tooltip-settings') {
        setTooltipSettings(event.data.pluginMessage.data);
      }
    };
  }, []);

  return (
    <Router>
      <AppProvider selection={selection} tooltipSettings={tooltipSettings}>
        <Main selection={Boolean(selection.length)}>
          <Switch>
            <Route path="/" exact>
              <Tooltip />
            </Route>
            <Route path="/tooltip" exact>
              <Home />
            </Route>
            <Route path="/angle" exact>
              <Angle />
            </Route>
            <Route path="/presets" exact>
              <Presets />
            </Route>
          </Switch>
        </Main>
      </AppProvider>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
