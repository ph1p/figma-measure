import React, { FunctionComponent, useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { sendMessage, TOOLTIP_DIRECTIONS } from '../../shared';

// components
import Header from '../../components/Header';
import ButtonLink from '../../components/ButtonLink';

import Settings from './Settings';
import { Content } from '../../shared/style';
import { useStore } from '../../store';

const PreviewWrapper = styled.div<{ hasSelection: boolean }>`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  pointer-events: ${(p) => (p.hasSelection ? 'initial' : 'none')};
  position: relative;
  &::after {
    ${(p) => (!p.hasSelection ? 'content: "Please select an element."' : '')};
    font-weight: bold;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .box {
    cursor: pointer;
    height: 40px;
    border-radius: 3px;
    opacity: ${(p) => (p.hasSelection ? 1 : 0.3)};
    background-color: #efefef;
    border: 1px dashed #ddd;
    &:hover {
      background-color: #ddd;
    }
    &.tooltip {
      cursor: pointer;
      background-color: #17a0fb;
      border: 0;
    }
  }
`;

const Wrapper = styled.div`
  position: relative;
  top: 0;
  .settings-link {
    width: 100%;
  }
`;

const Tooltip: FunctionComponent = () => {
  const tooltipSettings = {};

  const store = useStore();

  const hasSelection = store.selection.length > 0;
  const selectedElement =
    store.selection.length === 1 ? store.selection[0] : undefined;

  // state
  const [directions, setDirections] = useState({
    horizontal: '',
    vertical: '',
  });
  const [area, setArea] = useState(-1);

  useEffect(() => {
    sendMessage('resize', {
      width: 200,
      height: 275,
    });
  }, []);

  useEffect(() => {
    if (!hasSelection || !selectedElement?.tooltipData) {
      setDirections({
        horizontal: '',
        vertical: '',
      });
      setArea(-1);
    } else {
      if (selectedElement?.tooltipData) {
        setDirections({
          horizontal: selectedElement.tooltipData.directions.horizontal,
          vertical: selectedElement.tooltipData.directions.vertical,
        });
      }
    }
  }, [store.selection]);

  useEffect(() => {
    setArea(
      TOOLTIP_DIRECTIONS.indexOf(
        TOOLTIP_DIRECTIONS.find(
          ([h, v]) => h === directions.horizontal && v === directions.vertical
        )
      )
    );
  }, [directions]);

  return (
    <Wrapper>
      <Header backButton title="Tooltip" />
      <Content>
        <h4>Choose the direction</h4>
        <PreviewWrapper hasSelection={hasSelection}>
          {TOOLTIP_DIRECTIONS.map(([horizontal, vertical], areaIndex) => (
            <div
              key={horizontal + vertical}
              className={`box ${areaIndex === area ? 'tooltip' : ''}`}
              onClick={() => {
                setDirections({
                  horizontal,
                  vertical,
                });
                sendMessage('tooltip', {
                  horizontal,
                  vertical,
                  ...tooltipSettings,
                });
              }}
            />
          ))}
        </PreviewWrapper>
      </Content>
      <hr />
      <Content>
        <ButtonLink className="settings-link" to="/tooltip/settings">
          Settings
        </ButtonLink>
      </Content>

      <Route path="/tooltip/settings" exact={false}>
        <Settings directions={directions} />
      </Route>
    </Wrapper>
  );
};

export default Tooltip;
