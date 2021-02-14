import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { sendMessage } from '../shared';
// import pkg from '../../package.json';
import { withAppContext } from '../shared/AppContext';
import Viewer from '../components/Viewer';

import FigmaMessageEmitter from '../shared/FigmaMessageEmitter';
import CenterChooser from './components/CenterChooser';
import LineChooser from './components/LineChooser';

const Home: FunctionComponent = () => {
  const [color, setColor] = useState<string>('#1745E8');
  const [labels, setLabels] = useState<boolean>(false);
  const [center, setCenter] = useState<
    'dashed' | 'filled' | 'stroke' | 'fill-stroke'
  >('stroke');
  const [lineEnding, setLineEnding] = useState<
    'normal' | 'none' | 'arrow' | 'arrow-filled'
  >('normal');

  useEffect(() => {
    FigmaMessageEmitter.emit('set-measurements', {
      lineEnding,
    });
  }, [lineEnding]);

  useEffect(() => {
    sendMessage('resize', {
      width: 285,
      height: 450,
    });
  }, []);

  return (
    <>
      <ViewerContainer>
        <Viewer
          color={color}
          labels={labels}
          center={center}
          lineEnding={lineEnding}
        />
      </ViewerContainer>

      <LineChooser
        value={lineEnding}
        onChange={(value) => setLineEnding(value)}
      />
      <CenterChooser value={center} onChange={(value) => setCenter(value)} />

      <InputContainer>
        <label htmlFor="color">Color</label>
        <input
          id="color"
          type="color"
          onChange={(e) => setColor(e.currentTarget.value)}
          value={color}
        />
      </InputContainer>
      <InputContainer>
        <label htmlFor="labels">Labels</label>
        <input
          id="labels"
          type="checkbox"
          onChange={(e) => setLabels(e.currentTarget.checked)}
          checked={labels}
        />
      </InputContainer>

      {/* <Version>
        <a
          target="_blank"
          href="https://github.com/ph1p/figma-measure/releases"
        >
          v{pkg.version}
        </a>
      </Version> */}
    </>
  );
};

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px;
  align-items: center;
  label {
    font-weight: bold;
  }
`;

const ViewerContainer = styled.div`
  text-align: center;
  margin: 20px 0;
  svg {
    display: inline-block;
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

export default withAppContext(Home);
