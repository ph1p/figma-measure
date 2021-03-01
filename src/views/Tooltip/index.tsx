import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import { Toggle } from '../../components/Toggle';
import { sendMessage } from '../../shared';

// components
import { useStore } from '../../store';
import { PreviewTooltip } from './components/PreviewTooltip';

// const PreviewWrapper = styled.div<{ hasSelection: boolean }>`
//   display: grid;
//   gap: 10px;
//   grid-template-columns: repeat(3, 1fr);
//   grid-template-rows: repeat(3, 1fr);
//   pointer-events: ${(p) => (p.hasSelection ? 'initial' : 'none')};
//   position: relative;
//   &::after {
//     ${(p) => (!p.hasSelection ? 'content: "Please select an element."' : '')};
//     font-weight: bold;
//     position: absolute;
//     left: 50%;
//     top: 50%;
//     transform: translate(-50%, -50%);
//     text-align: center;
//   }
//   .box {
//     cursor: pointer;
//     height: 40px;
//     border-radius: 3px;
//     opacity: ${(p) => (p.hasSelection ? 1 : 0.3)};
//     background-color: #efefef;
//     border: 1px dashed #ddd;
//     &:hover {
//       background-color: #ddd;
//     }
//     &.tooltip {
//       cursor: pointer;
//       background-color: #17a0fb;
//       border: 0;
//     }
//   }
// `;

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

const Tooltip: FunctionComponent = observer(() => {
  const store = useStore();

  // const hasSelection = store.selection.length > 0;
  // const selectedElement =
  //   store.selection.length === 1 ? store.selection[0] : undefined;

  // state
  // const [directions, setDirections] = useState({
  //   horizontal: '',
  //   vertical: '',
  // });
  // const [area, setArea] = useState(-1);

  useEffect(() => {
    sendMessage('resize', {
      width: 200,
      height: 275,
    });
  }, []);

  // useEffect(() => {
  //   if (!hasSelection || !selectedElement?.tooltipData) {
  //     setDirections({
  //       horizontal: '',
  //       vertical: '',
  //     });
  //     setArea(-1);
  //   } else {
  //     if (selectedElement?.tooltipData) {
  //       setDirections({
  //         horizontal: selectedElement.tooltipData.directions.horizontal,
  //         vertical: selectedElement.tooltipData.directions.vertical,
  //       });
  //     }
  //   }
  // }, [store.selection]);

  // useEffect(() => {
  //   setArea(
  //     TOOLTIP_DIRECTIONS.indexOf(
  //       TOOLTIP_DIRECTIONS.find(
  //         ([h, v]) => h === directions.horizontal && v === directions.vertical
  //       )
  //     )
  //   );
  // }, [directions]);

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
      {/* <Header backButton title="Tooltip" />
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
      </Route> */}
    </Wrapper>
  );
});

export default Tooltip;
