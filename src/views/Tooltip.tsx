import React, {
  FunctionComponent,
  useState,
  createRef,
  useEffect
} from 'react';
import styled from 'styled-components';
import {
  sendMessage,
  withAppContext,
  Content,
  TOOLTIP_DIRECTIONS,
  useDebounce
} from '../shared';

// components
import Header from '../components/Header';

const Colors = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  h4 {
    margin: 0 0 5px;
    p {
      color: #999;
      font-size: 12px;
      margin: 0;
      font-weight: normal;
    }
  }
`;
const PreviewWrapper = styled.div<{ hasSelection: boolean }>`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  opacity: ${p => (p.hasSelection ? 1 : 0.5)};
  pointer-events: ${p => (p.hasSelection ? 'initial' : 'none')};
  .box {
    height: 30px;
    border-radius: 3px;
    &.empty {
      background-color: #efefef;
      border: 1px dashed #ddd;
      cursor: pointer;
      &:hover {
        background-color: #ddd;
      }
    }
    &.element {
      background-color: #ddd;
      border: 1px solid #999;
    }
    &.tooltip {
      background-color: #17a0fb;
      cursor: pointer;
    }
  }
`;

const Tooltip: FunctionComponent = (props: any) => {
  const [directions, setDirections] = useState({
    horizontal: '',
    vertical: ''
  });
  const [area, setArea] = useState(-1);
  const selection = props.appData.selection;
  const hasSelection = selection.length > 0;
  const selectedElement = selection.length === 1 ? selection[0] : undefined;

  // settings
  const [inputs, setInputs] = useState({
    distance: 6,
    padding: 12,
    backgroundColor: '#ffffff',
    fontColor: '#000000',
    strokeColor: '#d0d0d0',
    strokeWidth: 1,
    fontSize: 12
  });

  const delayBgColor = useDebounce(inputs.backgroundColor, 100);
  const delayFontColor = useDebounce(inputs.fontColor, 100);
  const delayStrokeColor = useDebounce(inputs.strokeColor, 100);

  useEffect(() => {
    sendMessage('resize', {
      width: 200,
      height: 605
    });
  });

  useEffect(() => {
    if (props?.appData?.tooltipSettings) {
      setInputs({
        ...inputs,
        ...props.appData.tooltipSettings
      });
    }
  }, [props.appData.tooltipSettings]);

  useEffect(() => {
    if (selectedElement && directions.horizontal && directions.vertical) {
      sendMessage('tooltip', {
        horizontal: directions.horizontal,
        vertical: directions.vertical,
        ...inputs
      });
    }
  }, [
    delayBgColor,
    delayFontColor,
    delayStrokeColor,
    inputs.distance,
    inputs.padding,
    inputs.strokeWidth,
    inputs.fontSize
  ]);

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

  const setInput = e => {
    let value = e.target.value;
    if (e.target.type === 'range') {
      value = parseInt(value, 10);
    }

    setInputs({ ...inputs, [e.target.name]: value });
  };

  return (
    <>
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
                  ...inputs
                });
              }}
            />
          ))}
        </PreviewWrapper>
      </Content>
      <Content>
        <h4>Distance ({inputs.distance})</h4>
        <input
          type="range"
          min="0"
          max="300"
          name="distance"
          value={inputs.distance}
          onChange={setInput}
        />
      </Content>
      <Content>
        <h4>Padding ({inputs.padding})</h4>
        <input
          type="range"
          min="0"
          max="50"
          name="padding"
          value={inputs.padding}
          onChange={setInput}
        />
      </Content>
      <Content>
        <h4>Stroke ({inputs.strokeWidth})</h4>
        <input
          type="range"
          min="0"
          max="30"
          name="strokeWidth"
          value={inputs.strokeWidth}
          onChange={setInput}
        />
      </Content>
      <Content>
        <h4>Font-Size ({inputs.fontSize})</h4>
        <input
          type="range"
          min="8"
          max="70"
          name="fontSize"
          value={inputs.fontSize}
          onChange={setInput}
        />
      </Content>
      <hr />
      <Colors>
        <Content>
          <h4>
            Font <p>{inputs.fontColor}</p>
          </h4>
          <input
            type="color"
            name="fontColor"
            value={inputs.fontColor}
            onChange={setInput}
          />
        </Content>
        <Content>
          <h4>
            Background<p>{inputs.backgroundColor}</p>
          </h4>
          <input
            type="color"
            name="backgroundColor"
            value={inputs.backgroundColor}
            onChange={setInput}
          />
        </Content>
        <Content>
          <h4>
            Stroke<p>{inputs.strokeColor}</p>
          </h4>
          <input
            type="color"
            name="strokeColor"
            value={inputs.strokeColor}
            onChange={setInput}
          />
        </Content>
      </Colors>
    </>
  );
};

export default withAppContext(Tooltip);
