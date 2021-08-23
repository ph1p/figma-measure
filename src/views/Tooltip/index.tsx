import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { Toggle } from '../../components/Toggle';
import { useStore } from '../../store';

import { PreviewTooltip } from './components/PreviewTooltip';

const Tooltip: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <Wrapper>
      <Preview>
        <PreviewTooltip />
      </Preview>
      <Header>
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
      </Header>
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
          label="Color"
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
    </Wrapper>
  );
});

const Header = styled.div`
  position: relative;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 14px;
  border-bottom: 1px solid #e6e6e6;
  label {
    font-weight: bold;
    margin-right: 10px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  top: 0;
`;

const ToggleInputs = styled.div`
  overflow: auto;
  height: 186px;
  padding: 12px;
  > div {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Preview = styled.div`
  background-color: ${(props) => props.theme.color};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 275px;
`;

export default Tooltip;
