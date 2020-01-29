import React, { FunctionComponent, useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import Home from './views/Home';
import Tooltip from './views/Tooltip';
import Angle from './views/Angle';
import Lines from './views/Lines';

import {
  sendMessage,
  AppProvider,
  withAppContext,
  AppContextProps
} from './shared';

import './figma-ui/main.min.css';
import './ui.css';
import { GlobalStyle } from './style';

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

sendMessage('init');

const App: FunctionComponent<{ appData: AppContextProps }> = props => {
  useEffect(() => {
    // check selection

    window.onmessage = event => {
      if (event.data.pluginMessage.type === 'selection') {
        props.appData.setSelection(event.data.pluginMessage.data);
      }
      if (event.data.pluginMessage.type === 'tooltip-settings') {
        props.appData.setTooltipSettings(event.data.pluginMessage.data);
      }
    };
  }, []);

  return (
    <Router>
      <Main selection={props.appData.selection.length > 0}>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/tooltip">
            <Tooltip />
          </Route>
          <Route path="/angle" exact>
            <Angle />
          </Route>
          <Route path="/lines" exact>
            <Lines />
          </Route>
        </Switch>
      </Main>
    </Router>
  );
};

window.onmessage = event => {
  if (event.data.pluginMessage.type === 'init') {
    const { selection, tooltipSettings } = event.data.pluginMessage;

    const Component = withAppContext(App);

    ReactDOM.render(
      <AppProvider selection={selection} tooltipSettings={tooltipSettings}>
        <GlobalStyle />
        <Component />
      </AppProvider>,
      document.getElementById('app')
    );
  }
};
