import { observer } from 'mobx-react';
import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { Input } from '../../components/Input';
import { Toggle } from '../../components/Toggle';
import EventEmitter from '../../shared/EventEmitter';
import { useStore } from '../../store';

import { DebugModal, OverlayStyle } from './components/DebugModal';

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

const Loading = styled(DebugWrapper)`
  padding: 20px;
  & + div::after {
    content: '';
    ${OverlayStyle}
  }
`;

const Settings: FunctionComponent = observer(() => {
  const store = useStore();
  const [showDebug, setShowDebug] = useState(false);
  const [loading, setLoading] = useState(false);

  const removeAllMeasurements = async () => {
    if (confirm('Would your really remove all measurements?')) {
      setLoading(true);
      await EventEmitter.ask('remove all measurements');
      setLoading(false);
      alert('All measurements removed');
    }
  };

  return (
    <>
      {loading && (
        <Loading>
          Removing measurements...
          <br />
          <br /> This could take a while in large files. Just wait little bit 🫖
        </Loading>
      )}
      {showDebug && <DebugModal close={() => setShowDebug(false)} />}
      <Wrapper>
        <Headline>Labels</Headline>
        <DistanceSetting>
          <label htmlFor="label-font-size">Font size</label>
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
                  fillRule="evenodd"
                  clipRule="evenodd"
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
            checked={store.isGlobalGroup}
            label="Use one global group"
            description="All measurements are moved to a global group. Added at the top hierarchy level per page. Could be slow and is not ideal if you want to export individual measurements."
            onChange={() => store.toggleIsGlobalGroup()}
          />
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
          <label htmlFor="tooltip-distance">Distance from element</label>
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
            checked={store.tooltip.variants}
            label="Variants"
            description="Displays all variants if the element has any"
            onChange={() => store.toggleTooltipSetting('variants')}
          />
          <GroupSeperator />

          <Toggle
            checked={store.tooltip.fontName}
            label="Font"
            onChange={() => store.toggleTooltipSetting('fontName')}
          />
          <Toggle
            checked={store.tooltip.fontSize}
            label="Font size"
            description={'Works only if "Font" is active'}
            onChange={() => store.toggleTooltipSetting('fontSize')}
          />

          <Input
            width={140}
            label="Units"
            placeholder="($)px, ($##*2.1), cm..."
            description={
              <>
                You can write a "complex" pattern like this{' '}
                <strong>($###*2.5)</strong> or a simple one <strong>($)</strong>
                <p>
                  <strong>$</strong> represents the value, after that you can
                  add a multiplier or divider (<strong>*</strong> or{' '}
                  <strong>/</strong>) the repetition of the <strong>#</strong>{' '}
                  symbol indicates the number of digits after the decimal point.
                  <br /> You can also fill the field with only one unit of
                  measurement and everything will be automatically calculated
                  based on 72dpi. (cm,mm,px,pt,dp,",in)
                </p>
                <h3>Example</h3>
                <p>
                  Imagine your base unit is 8px=1x. So when a square is 64px the
                  measurement will be 8x as the result.
                </p>
                <strong>($###/8)x</strong>
              </>
            }
            value={store.fontPattern}
            onChange={(e) => store.setFontPattern(e.currentTarget.value)}
          />

          <GroupSeperator />

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

          <GroupSeperator />

          <Toggle
            checked={store.tooltip.color}
            label="Fills"
            onChange={() => store.toggleTooltipSetting('color')}
          />
          <Toggle
            checked={store.tooltip.opacity}
            label="Overall opacity"
            onChange={() => store.toggleTooltipSetting('opacity')}
          />
          <Toggle
            checked={store.tooltip.stroke}
            label="Stroke"
            description="Shows stroke width, direction and fills"
            onChange={() => store.toggleTooltipSetting('stroke')}
          />
          <Toggle
            checked={store.tooltip.cornerRadius}
            label="Corner radius"
            onChange={() => store.toggleTooltipSetting('cornerRadius')}
          />
          <Toggle
            checked={store.tooltip.points}
            label="Points"
            description="Shows points of your element, e.g. from a star"
            onChange={() => store.toggleTooltipSetting('points')}
          />

          <GroupSeperator />

          <Toggle
            checked={store.tooltip.effects}
            label="Effects"
            onChange={() => store.toggleTooltipSetting('effects')}
          />

          <Toggle
            checked={store.tooltip.onlyEffectStyle}
            label="Show effect name only"
            onChange={() => store.toggleTooltipSetting('onlyEffectStyle')}
          />
        </ToggleInputs>

        <Seperator />
        <Headline>Dangerzone</Headline>
        <DangerZone>
          <p>
            This section lets you remove or display all measured elements. This
            could take a while in large files.
          </p>
          <RemoveButton onClick={removeAllMeasurements}>
            Remove all measurements
          </RemoveButton>
          <DebugButton onClick={() => setShowDebug(true)}>
            All measured elements
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
    color: var(--figma-color-text-tertiary);
  }
`;

const GroupSeperator = styled.div`
  height: 1px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px !important;
  background-color: var(--figma-color-bg-secondary);
`;

const Button = styled.button`
  display: block;
  border: 0;
  padding: 10px 12px;
  font-size: 12px;
  border-radius: 4px;
  width: 100%;
  text-align: center;
`;

const RemoveButton = styled(Button)`
  margin-bottom: 7px;
  color: #fff;
  background-color: #e03e1a;
`;

const DebugButton = styled(Button)`
  background-color: var(--figma-color-bg-hover);
  color: var(--figma-color-bg-inverse);
`;

const Headline = styled.h3`
  font-size: 13px;
  font-weight: 500;
  margin: 14px 14px 0;
  color: var(--figma-color-text);
`;

const Seperator = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--figma-color-bg-secondary);
`;

const LockSettings = styled.div`
  padding: 10px 5px 5px 14px;
  div:first-child {
    margin-bottom: 7px;
  }
`;

const DistanceSetting = styled.div`
  padding: 10px 5px 14px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  overflow: auto;
  top: 0;
  height: 520px;
  font-size: 11px;
  color: var(--figma-color-text);
`;

const ToggleInputs = styled.div`
  padding: 12px 5px 12px 14px;
  > div {
    margin-bottom: 7px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default Settings;
