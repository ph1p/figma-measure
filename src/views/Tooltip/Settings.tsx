import React, { FunctionComponent, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  sendMessage,
  withAppContext,
  Content,
  useDebounce,
  setStorage,
  TOOLTIP_DEFAULT_SETTINGS
} from '../../shared';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '../../components/ui';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;
const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const swipeIn = keyframes`
  from {
    transform: translateX(180px);
  }

  to {
    transform: translateX(0);
  }
`;

const swipeOut = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(180px);
  }
`;

const Wrapper = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    animation: ${p => (p.show ? fadeIn : fadeOut)} 0.3s forwards;
  }
  .window {
    width: 180px;
    position: absolute;
    overflow: auto;
    top: 0;
    right: 0;
    background-color: #fff;
    height: 100%;
    transform: translateX(180px);
    animation: ${p => (p.show ? swipeIn : swipeOut)} 0.3s forwards;
    border-left: 1px solid #e5e5e5;
    h4 {
      margin: 0 0 12px;
    }
    input[type='range'] {
      margin-bottom: 12px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const Colors = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 10px;

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    input {
      margin-right: 5px;
    }
    div {
      p {
        color: #999;
        font-size: 11px;
        margin: 0;
        font-weight: normal;
      }
    }
  }
`;

const CloseButton = styled(Icon)`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
`;

const Settings: FunctionComponent = (props: any) => {
  const {
    appData: { selection, tooltipSettings, setTooltipSettings },
    directions
  } = props;

  const history = useHistory();
  const [show, setShow] = useState(false);

  const selectedElement = selection.length === 1 ? selection[0] : undefined;

  const delayBgColor = useDebounce(tooltipSettings.backgroundColor, 100);
  const delayFontColor = useDebounce(tooltipSettings.fontColor, 100);
  const delayStrokeColor = useDebounce(tooltipSettings.strokeColor, 100);

  // animation
  useEffect(() => setShow(true), []);

  const onAnimationEnd = () => {
    if (!show) {
      history.replace('/tooltip');
    }
  };

  useEffect(() => {
    if (selectedElement && directions.horizontal && directions.vertical) {
      sendMessage('tooltip', {
        ...directions,
        ...tooltipSettings
      });
    } else {
      setStorage('tooltip-settings', {
        ...tooltipSettings
      });
    }
  }, [
    delayBgColor,
    delayFontColor,
    delayStrokeColor,
    tooltipSettings.distance,
    tooltipSettings.horizontalPadding,
    tooltipSettings.verticalPadding,
    tooltipSettings.strokeWidth,
    tooltipSettings.fontSize,
    tooltipSettings.cornerRadius
  ]);

  const setInput = e => {
    let value = e.target.value;
    if (e.target.type === 'range') {
      value = parseInt(value, 10);
    }

    setTooltipSettings({ ...tooltipSettings, [e.target.name]: value });
  };

  return (
    <Wrapper onAnimationEnd={onAnimationEnd} show={show}>
      <div className="overlay" onClick={() => setShow(false)} />
      <div className="window">
        <CloseButton onClick={() => setShow(false)} icon="close" button />
        <Content>
          <h4>Corner Radius ({tooltipSettings.cornerRadius})</h4>
          <input
            type="range"
            min="0"
            max="300"
            name="cornerRadius"
            value={tooltipSettings.cornerRadius}
            onChange={setInput}
          />

          <h4>Distance ({tooltipSettings.distance})</h4>
          <input
            type="range"
            min="0"
            max="300"
            name="distance"
            value={tooltipSettings.distance}
            onChange={setInput}
          />

          <h4>Vertical Padding ({tooltipSettings.verticalPadding})</h4>
          <input
            type="range"
            min="0"
            max="50"
            name="verticalPadding"
            value={tooltipSettings.verticalPadding}
            onChange={setInput}
          />

          <h4>Horizontal Padding ({tooltipSettings.horizontalPadding})</h4>
          <input
            type="range"
            min="0"
            max="50"
            name="horizontalPadding"
            value={tooltipSettings.horizontalPadding}
            onChange={setInput}
          />

          <h4>Stroke ({tooltipSettings.strokeWidth})</h4>
          <input
            type="range"
            min="0"
            max="30"
            name="strokeWidth"
            value={tooltipSettings.strokeWidth}
            onChange={setInput}
          />

          <h4>Font-Size ({tooltipSettings.fontSize})</h4>
          <input
            type="range"
            min="8"
            max="70"
            name="fontSize"
            value={tooltipSettings.fontSize}
            onChange={setInput}
          />
        </Content>
        <hr />
        <Colors>
          <div>
            <label htmlFor="fontColor">
              <input
                type="color"
                name="fontColor"
                id="fontColor"
                value={tooltipSettings.fontColor}
                onChange={setInput}
              />
              <div>
                Font <p>{tooltipSettings.fontColor}</p>
              </div>
            </label>
          </div>
          <div>
            <label htmlFor="backgroundColor">
              <input
                type="color"
                name="backgroundColor"
                id="backgroundColor"
                value={tooltipSettings.backgroundColor}
                onChange={setInput}
              />
              <div>
                Fill<p>{tooltipSettings.backgroundColor}</p>
              </div>
            </label>
          </div>
          <div>
            <label htmlFor="strokeColor">
              <input
                type="color"
                name="strokeColor"
                id="strokeColor"
                value={tooltipSettings.strokeColor}
                onChange={setInput}
              />
              <div>
                Stroke<p>{tooltipSettings.strokeColor}</p>
              </div>
            </label>
          </div>
        </Colors>
        <hr />
        <Content>
          <Button
            full
            variant="secondary"
            onClick={() => setTooltipSettings(TOOLTIP_DEFAULT_SETTINGS)}
          >
            Reset to default
          </Button>
        </Content>
      </div>
    </Wrapper>
  );
};

export default withAppContext(Settings);
