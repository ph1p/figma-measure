import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Toggle } from '../../components/Toggle';

// components
import { useStore } from '../../store';
import { PreviewTooltip } from './components/PreviewTooltip';

const Tooltip: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <Wrapper>
      <Preview>
        <PreviewTooltip />
      </Preview>
      <Settings>
        <Toggle
          checked={store.tooltip.fontStyle}
          label="Font-Style"
          onChange={() => store.toggleTooltipSetting('fontStyle')}
        />
        <Toggle
          checked={store.tooltip.fontFamily}
          label="Font-Family"
          onChange={() => store.toggleTooltipSetting('fontFamily')}
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
      </Settings>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  position: relative;
  top: 0;
  .settings-link {
    width: 100%;
  }
`;

const Settings = styled.div`
  overflow: auto;
  height: 209px;
  padding: 12px;
  > div {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Preview = styled.div`
  background-color: #1745e8;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 275px;
`;

export default Tooltip;
