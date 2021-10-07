import { reaction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'preact/hooks';
import React, { FunctionComponent } from 'react';
import * as ReactDOM from 'react-dom';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import EventEmitter from './shared/EventEmitter';
import { Alignments, PluginNodeData } from './shared/interfaces';
import { getStoreFromMain, StoreProvider, trunk, useStore } from './store';
import {
  DEFAULT_COLOR,
  getColorByTypeAndSolidColor,
  GlobalStyle,
  theme,
} from './style';
import Home from './views/Home';
import Tooltip from './views/Tooltip';

import './ui.css';

const App: FunctionComponent = observer(() => {
  const store = useStore();

  const [menu, setMenu] = useState(1);
  const history = useHistory();

  useEffect(() => {
    // check visibility
    EventEmitter.ask('get visibility').then((visibility: boolean) => {
      store.setVisibility(visibility);
    });

    // check selection
    EventEmitter.ask('current selection').then((data: string[]) =>
      store.setSelection(data)
    );

    EventEmitter.on('selection', (data) => store.setSelection(data));

    EventEmitter.on('set visibility', (data) => store.setVisibility(data));

    return () => EventEmitter.remove('selection');
  }, []);

  // set data from selection
  useEffect(
    () =>
      reaction(
        () => store.selection.slice(),
        () => {
          const selection = toJS(store.selection);
          if (selection.length > 0) {
            try {
              const padding = selection[0]?.padding || {};
              const data: PluginNodeData = selection[0]?.data || {};

              // padding
              if (Object.keys(padding).length > 0) {
                if (!data.surrounding) {
                  // @ts-expect-error it filled afterwarts
                  data.surrounding = {};
                }

                for (const direction of Object.keys(Alignments)) {
                  data.surrounding[`${direction.toLowerCase()}Padding`] =
                    !!padding[direction];
                }
              } else {
                for (const direction of Object.keys(Alignments)) {
                  data.surrounding[`${direction.toLowerCase()}Padding`] = false;
                }
              }

              if (Object.keys(data?.surrounding).length > 0) {
                store.setSurrounding(data.surrounding, true);
              } else {
                store.resetSurrounding();
              }
            } catch {
              store.resetSurrounding();
            }
          } else {
            store.resetSurrounding();
          }
        }
      ),
    []
  );

  return (
    <ThemeProvider
      theme={{
        color: store?.color || DEFAULT_COLOR,
        softColor: getColorByTypeAndSolidColor(store.color, 'soft'),
        hoverColor: getColorByTypeAndSolidColor(store.color, 'hover'),
        ...theme,
      }}
    >
      <GlobalStyle />

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
    </ThemeProvider>
  );
});

getStoreFromMain().then((store) =>
  trunk.init(store).then(() =>
    ReactDOM.render(
      <StoreProvider>
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
  display: flex;
  position: relative;
  overflow: hidden;
  height: 42px;
  border-width: 1px 0 0;
  border-color: #eee;
  border-style: solid;
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
