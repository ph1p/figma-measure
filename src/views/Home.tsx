import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import { ColorPicker } from '../components/ColorPicker';
import { Toggle } from '../components/Toggle';

import Viewer from '../components/Viewer';

import FigmaMessageEmitter from '../shared/FigmaMessageEmitter';
import { useStore } from '../store';
import CenterChooser from './components/CenterChooser';
import LineChooser from './components/LineChooser';

const Home: FunctionComponent = observer(() => {
  const store = useStore();

  useEffect(() => {
    FigmaMessageEmitter.emit('resize', {
      width: 285,
      height: 539,
    });
  }, []);

  return (
    <>
      <ViewerContainer>
        <Viewer />

        <Spacing
          onClick={() => {
            if (store.selection.length === 2) {
              FigmaMessageEmitter.emit('draw spacing', {
                color: store.color,
                labels: store.labels,
                unit: store.unit,
              });
            } else {
              alert('Please select 2 element to measure the distance');
            }
          }}
        >
          <svg
            width="30"
            height="29"
            viewBox="0 0 30 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="29"
              height="28"
              rx="9.5"
              stroke="#E8E8E8"
            />
            <line x1="9" y1="14.5" x2="21" y2="14.5" stroke={store.color} />
            <line
              x1="12"
              y1="14.5"
              x2="18"
              y2="14.5"
              stroke={store.color}
              strokeWidth="3"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M26 7.5C26 7.22386 25.7761 7 25.5 7H24.5C23.6716 7 23 7.67157 23 8.5V20.5C23 21.3284 23.6716 22 24.5 22H25.5C25.7761 22 26 21.7761 26 21.5C26 21.2239 25.7761 21 25.5 21H25C24.4477 21 24 20.5523 24 20V9C24 8.44772 24.4477 8 25 8H25.5C25.7761 8 26 7.77614 26 7.5Z"
              fill="black"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 7.5C4 7.22386 4.22386 7 4.5 7H5.5C6.32843 7 7 7.67157 7 8.5V20.5C7 21.3284 6.32843 22 5.5 22H4.5C4.22386 22 4 21.7761 4 21.5C4 21.2239 4.22386 21 4.5 21H5C5.55228 21 6 20.5523 6 20V9C6 8.44772 5.55228 8 5 8H4.5C4.22386 8 4 7.77614 4 7.5Z"
              fill="black"
            />
          </svg>
        </Spacing>
      </ViewerContainer>

      <LineChooser />
      <CenterChooser />

      <InputContainer>
        <label htmlFor="color">Color</label>
        <ColorPicker
          id="base-color"
          onChange={(color) => store.setColor(color)}
          color={store.color}
        />
      </InputContainer>

      <InputContainer style={{ paddingTop: 0 }}>
        <Toggle
          checked={store.labels}
          label="Labels"
          onChange={(e) => store.setLabels(e.currentTarget.checked)}
        />
        <div className="input" style={{ width: 55, marginLeft: 12 }}>
          <input
            type="text"
            value={store.unit}
            onChange={(e) => store.setUnit(e.currentTarget.value)}
          />
        </div>
      </InputContainer>
    </>
  );
});

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  align-items: center;
  label {
    font-weight: bold;
  }
`;

const Spacing = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  cursor: pointer;
`;

const ViewerContainer = styled.div`
  position: relative;
  height: 271px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    user-select: none;
    g {
      cursor: pointer;
    }
  }
`;

// const Version = styled.div`
//   text-align: center;
//   padding: 5px 8px;
//   a {
//     color: #999;
//     text-decoration: none;
//     font-size: 10px;
//     &:hover {
//       text-decoration: underline;
//     }
//   }
// `;

export default Home;
