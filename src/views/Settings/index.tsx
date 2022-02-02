import { observer } from 'mobx-react';
import { useEffect, useState } from 'preact/hooks';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { Toggle } from '../../components/Toggle';
import EventEmitter from '../../shared/EventEmitter';
import { useStore } from '../../store';

const DebugModal: FunctionComponent<{ close: () => void }> = observer(
  (props) => {
    const [isLoading, setLoading] = useState(true);
    const [activeNodeId, setActiveNodeId] = useState('');
    const [measurements, setMeasurements] = useState([]);

    useEffect(() => {
      EventEmitter.ask('file measurements').then((data: any[]) => {
        setMeasurements(data);
        setLoading(false);
      });
    }, []);

    return (
      <>
        <DebugOverlay onClick={props.close} />
        <DebugWrapper>
          <DebugClose onClick={props.close}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="https://www.w3.org/2000/svg"
            >
              <path
                d="M13.4099 12.0002L19.7099 5.71019C19.8982 5.52188 20.004 5.26649 20.004 5.00019C20.004 4.73388 19.8982 4.47849 19.7099 4.29019C19.5216 4.10188 19.2662 3.99609 18.9999 3.99609C18.7336 3.99609 18.4782 4.10188 18.2899 4.29019L11.9999 10.5902L5.70994 4.29019C5.52164 4.10188 5.26624 3.99609 4.99994 3.99609C4.73364 3.99609 4.47824 4.10188 4.28994 4.29019C4.10164 4.47849 3.99585 4.73388 3.99585 5.00019C3.99585 5.26649 4.10164 5.52188 4.28994 5.71019L10.5899 12.0002L4.28994 18.2902C4.19621 18.3831 4.12182 18.4937 4.07105 18.6156C4.02028 18.7375 3.99414 18.8682 3.99414 19.0002C3.99414 19.1322 4.02028 19.2629 4.07105 19.3848C4.12182 19.5066 4.19621 19.6172 4.28994 19.7102C4.3829 19.8039 4.4935 19.8783 4.61536 19.9291C4.73722 19.9798 4.86793 20.006 4.99994 20.006C5.13195 20.006 5.26266 19.9798 5.38452 19.9291C5.50638 19.8783 5.61698 19.8039 5.70994 19.7102L11.9999 13.4102L18.2899 19.7102C18.3829 19.8039 18.4935 19.8783 18.6154 19.9291C18.7372 19.9798 18.8679 20.006 18.9999 20.006C19.132 20.006 19.2627 19.9798 19.3845 19.9291C19.5064 19.8783 19.617 19.8039 19.7099 19.7102C19.8037 19.6172 19.8781 19.5066 19.9288 19.3848C19.9796 19.2629 20.0057 19.1322 20.0057 19.0002C20.0057 18.8682 19.9796 18.7375 19.9288 18.6156C19.8781 18.4937 19.8037 18.3831 19.7099 18.2902L13.4099 12.0002Z"
                fill="black"
              />
            </svg>
          </DebugClose>
          <Headline>Debug</Headline>
          <DebugList>
            {isLoading && (
              <div className="loading">
                loading elements ...
                <br />
                (this could take a while)
              </div>
            )}
            {!isLoading && measurements.length === 0 && (
              <div className="empty">no elements found</div>
            )}
            {measurements.length > 0 && (
              <ul>
                {measurements.map((element) => (
                  <li
                    onClick={() => {
                      setActiveNodeId(
                        element.id === activeNodeId ? '' : element.id
                      );
                      EventEmitter.emit('focus node', element);
                    }}
                  >
                    {element.name}
                  </li>
                ))}
              </ul>
            )}
          </DebugList>
        </DebugWrapper>
      </>
    );
  }
);

const DebugClose = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  cursor: pointer;
`;

const DebugOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 31;
  height: 100%;
  width: 100%;
`;

const DebugList = styled.div`
  padding: 14px;
  .loading,
  .empty {
    text-align: center;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      cursor: pointer;
      padding: 5px 10px;
      font-size: 11px;
      background-color: #eee;
      border-radius: 5px;
      margin-bottom: 7px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const DebugWrapper = styled.div`
  position: fixed;
  background-color: #fff;
  top: 14px;
  left: 14px;
  right: 14px;
  max-height: 60%;
  z-index: 32;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  overflow: auto;
`;

const Settings: FunctionComponent = observer(() => {
  const store = useStore();
  const [showDebug, setShowDebug] = useState(false);

  const removeAllMeasurements = async () => {
    if (confirm('Would your really remove all measurements?')) {
      await EventEmitter.ask('remove all measurements');
      alert('All measurements removed');
    }
  };

  return (
    <>
      {showDebug && <DebugModal close={() => setShowDebug(false)} />}
      <Wrapper>
        <Headline>Labels</Headline>
        <DistanceSetting>
          <label htmlFor="label-font-size">Font-Size</label>
          <div className="input icon" style={{ width: 75 }}>
            <input
              type="number"
              id="label-font-size"
              value={store.labelFontSize}
              onChange={(e) => store.setLabelFontSize(+e.currentTarget.value)}
            />
            <div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="https://www.w3.org/2000/svg"
              >
                <path
                  d="M13.1797 9.69922H12.0625V9.625C12.0703 8.17578 12.5 7.73438 13.2266 7.28906C13.6914 7 14.0547 6.58984 14.0547 6.00781C14.0547 5.31641 13.5156 4.875 12.8516 4.875C12.2539 4.875 11.6641 5.23828 11.6172 6.06641H10.4297C10.4805 4.66016 11.5352 3.89062 12.8516 3.89062C14.2852 3.89062 15.2461 4.75 15.2461 6.01953C15.2461 6.89844 14.8164 7.49219 14.1172 7.91406C13.4531 8.32422 13.1953 8.72656 13.1797 9.625V9.69922Z"
                  fill="#8C8C8C"
                />
                <path
                  d="M13.4336 11.293C13.4336 11.7266 13.0781 12.0742 12.6523 12.0742C12.2227 12.0742 11.8711 11.7266 11.8711 11.293C11.8711 10.8672 12.2227 10.5156 12.6523 10.5156C13.0781 10.5156 13.4336 10.8672 13.4336 11.293Z"
                  fill="#8C8C8C"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2 12L5.11111 4H6.19622L9.30733 12H8.23438L7.4566 10L3.85073 10L3.07296 12H2ZM5.65367 5.36389L7.06771 9L4.23962 9L5.65367 5.36389Z"
                  fill="#8C8C8C"
                />
              </svg>
            </div>
          </div>
        </DistanceSetting>

        <Seperator />

        <Headline>Groups</Headline>
        <LockSettings>
          <Toggle
            checked={store.lockAttachedGroup}
            label="Lock attached groups"
            onChange={() => store.toggleLockAttachedGroup()}
          />
          <Toggle
            checked={store.lockDetachedGroup}
            label="Lock detached groups"
            onChange={() => store.toggleLockDetachedGroup()}
          />
        </LockSettings>
        <Seperator />
        <Headline>Tooltips</Headline>
        <DistanceSetting>
          <label htmlFor="tooltip-distance">Distance</label>
          <div className="input icon" style={{ width: 75 }}>
            <input
              type="number"
              id="tooltip-distance"
              value={store.tooltipOffset}
              onChange={(e) => store.setTooltipOffset(+e.currentTarget.value)}
            />
            <div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="https://www.w3.org/2000/svg"
              >
                <path d="M0 11H8L8 8.5L9.5 7L8 5.5V3H0V11Z" fill="#BBBBBB" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13 12.5L14 12.5L14 13.5L13 13.5C12.1716 13.5 11.5 12.8284 11.5 12L11.5 2C11.5 1.17157 12.1716 0.5 13 0.5L14 0.5L14 1.5L13 1.5C12.7239 1.5 12.5 1.72386 12.5 2L12.5 12C12.5 12.2761 12.7239 12.5 13 12.5Z"
                  fill="#BBBBBB"
                />
              </svg>
            </div>
          </div>
        </DistanceSetting>

        <Seperator />

        <ToggleInputs>
          <Toggle
            checked={store.tooltip.name}
            label="Name"
            onChange={() => store.toggleTooltipSetting('name')}
          />
          <Toggle
            checked={store.tooltip.fontName}
            label="Font"
            onChange={() => store.toggleTooltipSetting('fontName')}
          />
          <Toggle
            checked={store.tooltip.fontSize}
            label="Font-Size"
            onChange={() => store.toggleTooltipSetting('fontSize')}
          />
          <Toggle
            checked={store.tooltip.width}
            label="Width"
            onChange={() => store.toggleTooltipSetting('width')}
          />
          <Toggle
            checked={store.tooltip.height}
            label="Height"
            onChange={() => store.toggleTooltipSetting('height')}
          />
          <Toggle
            checked={store.tooltip.color}
            label="Fills"
            onChange={() => store.toggleTooltipSetting('color')}
          />
          <Toggle
            checked={store.tooltip.opacity}
            label="Opacity"
            onChange={() => store.toggleTooltipSetting('opacity')}
          />
          <Toggle
            checked={store.tooltip.stroke}
            label="Stroke"
            onChange={() => store.toggleTooltipSetting('stroke')}
          />
          <Toggle
            checked={store.tooltip.cornerRadius}
            label="Corner-Radius"
            onChange={() => store.toggleTooltipSetting('cornerRadius')}
          />
          <Toggle
            checked={store.tooltip.points}
            label="Points"
            onChange={() => store.toggleTooltipSetting('points')}
          />
        </ToggleInputs>

        <Seperator />
        <Headline>Dangerzone</Headline>
        <DangerZone>
          <p>
            This section lets you remove and find all measured nodes. This could
            take a while in large files.
          </p>
          <RemoveButton onClick={removeAllMeasurements}>
            Remove all measurements
          </RemoveButton>
          <DebugButton onClick={() => setShowDebug(true)}>
            All measured elements (debug)
          </DebugButton>
        </DangerZone>
      </Wrapper>
    </>
  );
});

const DangerZone = styled.div`
  padding: 14px;
  p {
    margin-top: 0;
    color: #999;
  }
`;
const Button = styled.button`
  display: block;
  border: 0;
  padding: 10px 12px;
  font-size: 11px;
  border-radius: 4px;
  width: 100%;
  text-align: center;
`;

const RemoveButton = styled(Button)`
  margin-bottom: 14px;
  color: #fff;
  background-color: #c85555;
`;

const DebugButton = styled(Button)``;

const Headline = styled.h2`
  font-size: 15px;
  margin: 14px 14px 0;
`;

const Seperator = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgb(238, 238, 238);
`;

const LockSettings = styled.div`
  padding: 14px 5px 14px 14px;
  div:first-child {
    margin-bottom: 10px;
  }
`;

const DistanceSetting = styled.div`
  padding: 14px 5px 14px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  overflow: auto;
  top: 0;
`;

const ToggleInputs = styled.div`
  padding: 12px 5px 12px 14px;
  > div {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default Settings;
