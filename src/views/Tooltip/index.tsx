import React, { FunctionComponent, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  sendMessage,
  withAppContext,
  Content,
  TOOLTIP_DIRECTIONS
} from '../../shared';

// components
import Header from '../../components/Header';
import ButtonLink from '../../components/ButtonLink';
import Settings from './Settings';

const PreviewWrapper = styled.div<{ hasSelection: boolean }>`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  pointer-events: ${p => (p.hasSelection ? 'initial' : 'none')};
  position: relative;
  &::after {
    ${p => (!p.hasSelection ? 'content: "Please select an element."' : '')};
    font-weight: bold;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .box {
    height: 40px;
    border-radius: 3px;
    opacity: ${p => (p.hasSelection ? 1 : 0.3)};
    &.empty {
      background-color: #efefef;
      border: 1px dashed #ddd;
      cursor: pointer;
      &:hover {
        background-color: #ddd;
      }
    }
    &.element {
      /* background-color: #ddd; */
      /* border: 1px solid #999; */
    }
    &.tooltip {
      background-color: #17a0fb;
      cursor: pointer;
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

const Tooltip: FunctionComponent = (props: any) => {
  const {
    appData: { selection, tooltipSettings }
  } = props;

  const [directions, setDirections] = useState({
    horizontal: '',
    vertical: ''
  });
  const [area, setArea] = useState(-1);

  const hasSelection = selection.length > 0;
  const selectedElement = selection.length === 1 ? selection[0] : undefined;

  useEffect(() => {
    sendMessage('resize', {
      width: 200,
      height: 430
    });
  }, []);

  useEffect(() => {
    if (!hasSelection) {
      setDirections({
        horizontal: '',
        vertical: ''
      });
      setArea(-1);
    } else {
      if (selectedElement?.tooltipData) {
        const {
          tooltipData: {
            directions: { horizontal, vertical }
          }
        } = selectedElement;

        setDirections({ horizontal, vertical });
      } else {
        setArea(-1);
      }
    }
  }, [selection]);

  useEffect(() => {
    setArea(
      TOOLTIP_DIRECTIONS.indexOf(
        TOOLTIP_DIRECTIONS.find(
          ([h, v]) => h === directions.horizontal && v === directions.vertical
        )
      )
    );
  }, [directions]);

  const generateClassName = areaIndex => {
    let names = ['box'];
    if (areaIndex === 4) {
      names.push('element');
    }

    if (areaIndex === area) {
      names.push('tooltip');
    } else {
      names.push('empty');
    }

    return names.join(' ');
  };

  return (
    <Wrapper>
      <Header backButton title="Tooltip" />
      <Content>
        <h4>Choose the direction</h4>
        <PreviewWrapper hasSelection={hasSelection}>
          {TOOLTIP_DIRECTIONS.map(([horizontal, vertical], areaIndex) => (
            <div
              key={horizontal + vertical}
              className={generateClassName(areaIndex)}
              onClick={() => {
                setDirections({
                  horizontal,
                  vertical
                });
                sendMessage('tooltip', {
                  horizontal,
                  vertical,
                  ...tooltipSettings
                });
              }}
            />
          ))}
        </PreviewWrapper>
      </Content>

      <Content>
        <ButtonLink
          className="settings-link"
          to="/tooltip/settings"
          label="Settings"
        />
      </Content>

      <Route path="/tooltip/settings" exact={false}>
        <Settings directions={directions} />
      </Route>
    </Wrapper>
  );
};

export default withAppContext(Tooltip);
