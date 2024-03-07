import { reaction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Link,
  LinkProps,
  Route,
  MemoryRouter as Router,
  Routes,
  useMatch,
  useResolvedPath,
} from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import EventEmitter from './shared/EventEmitter';
import { Alignments, NodeSelection, PluginNodeData } from './shared/interfaces';
import { StoreProvider, getStoreFromMain, trunk, useStore } from './store';
import {
  DEFAULT_COLOR,
  GlobalStyle,
  getColorByTypeAndSolidColor,
  theme,
} from './style';
import About from './views/About';
import Home from './views/Home';
import Settings from './views/Settings';

import './ui.css';

const CustomLink = ({ children, to, ...props }: LinkProps) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link className={match ? 'active' : ''} to={to} {...props}>
      {children}
    </Link>
  );
};

const App: FunctionComponent = observer(() => {
  const store = useStore();

  useEffect(() => {
    // check selection
    EventEmitter.ask('current selection').then((data: NodeSelection) =>
      store.setSelection(data.nodes),
    );

    EventEmitter.on('selection', (data: NodeSelection) => {
      store.setSelection(data.nodes);
    });

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
              const data: Partial<PluginNodeData> = selection[0]?.data || null;

              if (data && !store.detached) {
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
                    data.surrounding[`${direction.toLowerCase()}Padding`] =
                      false;
                  }
                }

                if (data?.labelFontSize) {
                  store.setLabelFontSize(data?.labelFontSize, true);
                }

                if (Object.keys(data?.surrounding).length > 0) {
                  store.setSurrounding(data.surrounding, true);
                } else {
                  store.resetSurrounding();
                }

                store.setAllNodeMeasurementData(data);
              }
            } catch {
              store.resetSurrounding();
            }
          } else {
            store.resetSurrounding();
          }
        },
      ),
    [],
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
        <Navigation>
          <ul>
            <li>
              <CustomLink to="/">Measurement</CustomLink>
            </li>
            <li>
              <CustomLink to="/settings">Settings</CustomLink>
            </li>
            <li>
              <CustomLink to="/about">About</CustomLink>
            </li>
          </ul>
        </Navigation>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Main>
    </ThemeProvider>
  );
});

const elementRoot = createRoot(document.getElementById('app'));

getStoreFromMain().then((store) =>
  trunk.init(store).then(() =>
    elementRoot.render(
      <StoreProvider>
        <Router>
          <App />
        </Router>
      </StoreProvider>,
    ),
  ),
);

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Navigation = styled.nav`
  position: sticky;
  top: 0px;
  z-index: 30;
  overflow: hidden;
  height: 42px;
  border-width: 0px 0px 1px;
  border-color: var(--figma-color-bg-secondary);
  border-style: solid;
  width: 100%;
  padding: 0px 12px;
  font-size: 11px;
  background: var(--figma-color-bg);
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    li {
      align-self: center;
      a {
        color: var(--figma-color-text-tertiary);
        text-decoration: none;
        &:hover {
          color: var(--figma-color-text-secondary);
        }
        &.active {
          color: var(--figma-color-text);
        }
      }
      &:last-child {
        margin-left: auto;
      }
      &:first-child {
        margin-right: 21px;
      }
    }
  }
`;
