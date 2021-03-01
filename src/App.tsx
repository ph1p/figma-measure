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
    FigmaMessageEmitter.ask('current selection').then((data: string[]) =>
      store.setSelection(data)
    );
    FigmaMessageEmitter.on('selection', (data) => store.setSelection(data));

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

getStoreFromMain().then((store) =>
  trunk.init(store).then(() =>
    ReactDOM.render(
      <StoreProvider>
        <GlobalStyle />
        <Router>
          <App />
        </Router>
      </StoreProvider>,
      document.getElementById('app')
    )
  )
);

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const ViewSwitch = styled.div<{ menu: number }>`
  border-top: 1px solid #e6e6e6;
  display: flex;
  position: relative;
  overflow: hidden;
  height: 42px;
  div {
    transition: font-weight 0.3s;
    position: relative;
    z-index: 2;
    flex: 1;
    text-align: center;
    padding: 12px 0;
    user-select: none;
    cursor: pointer;
    font-weight: normal;
    &::before {
      content: '';
      transition: transform 0.3s;
      position: absolute;
      flex: 1;
      border-radius: 6px 6px 0 0;
      width: 60%;
      height: 4px;
      left: 50%;
      bottom: 0;
      background-color: #000;
      transform: translate(-50%, 5px);
    }
    &:nth-child(${(p) => p.menu}) {
      font-weight: bold;
      &::before {
        transform: translate(-50%, 0);
      }
    }
  }
`;
