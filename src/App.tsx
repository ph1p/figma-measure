import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import styled from 'styled-components';

import Home from './views/Home';
import Tooltip from './views/Tooltip';
import Angle from './views/Angle';
import Lines from './views/Lines';

import './figma-ui/main.min.css';
import './ui.css';
import { GlobalStyle } from './style';
import { getStoreFromMain, StoreProvider, trunk, useStore } from './store';
import FigmaMessageEmitter from './shared/FigmaMessageEmitter';

// sendMessage('init');

const App: FunctionComponent = observer(() => {
  const store = useStore();

  const [menu, setMenu] = useState(1);
  const history = useHistory();

  useEffect(() => {
    // check selection

    // window.onmessage = (event) => {
    //   if (event.data.pluginMessage.type === 'selection') {
    //     props.appData.setSelection(event.data.pluginMessage.data);
    //   }
    //   if (event.data.pluginMessage.type === 'tooltip-settings') {
    //     props.appData.setTooltipSettings(event.data.pluginMessage.data);
    //   }
    // };
    FigmaMessageEmitter.on('selection', (data) => {
      console.log(data);
      store.setSelection(data);
    });

    return () => FigmaMessageEmitter.remove('selection');
  }, []);

  return (
    <Main>
      <div>
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
      </div>
      <ViewSwitch menu={menu}>
        <div
          onClick={() => {
            setMenu(1);
            history.push('/');
          }}
        >
          Redlines
        </div>
        <div
          onClick={() => {
            setMenu(2);
            history.push('/tooltip');
          }}
        >
          Tooltip
        </div>
      </ViewSwitch>
    </Main>
  );
});

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

getStoreFromMain().then((store) => {
  console.log(store);
  return trunk.init(store).then(() => {
    // const { selection, tooltipSettings } = event.data.pluginMessage;

    ReactDOM.render(
      <StoreProvider>
        <GlobalStyle />
        <Router>
          <App />
        </Router>
      </StoreProvider>,
      document.getElementById('app')
    );
  });
});

const ViewSwitch = styled.div<{ menu: number }>`
  border: 1px solid #e6e6e6;
  border-radius: 43px;
  display: flex;
  position: relative;
  margin: 0 12px 12px 12px;
  div {
    transition: color 0.3s;
    position: relative;
    z-index: 2;
    flex: 1;
    text-align: center;
    padding: 12px 0;
    user-select: none;
    cursor: pointer;
    font-weight: bold;
    &:nth-child(${(p) => p.menu}) {
      color: #fff;
    }
  }
  &::before {
    content: '';
    transition: transform 0.3s;
    position: absolute;
    flex: 1;
    border-radius: 43px;
    width: 50%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #000;
    transform: translateX(${(p) => (p.menu === 1 ? 0 : 100)}%);
  }
`;
