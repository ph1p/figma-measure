import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

// import pkg from '../../package.json';
import Viewer from '../components/Viewer';

import FigmaMessageEmitter from '../shared/FigmaMessageEmitter';
import CenterChooser from './components/CenterChooser';
import LineChooser from './components/LineChooser';

const Home: FunctionComponent = observer(() => {
  const [color, setColor] = useState<string>('#1745E8');
  const [labels, setLabels] = useState<boolean>(false);

  useEffect(() => {
    FigmaMessageEmitter.emit('resize', {
      width: 285,
      height: 530,
    });
  }, []);

  return (
    <>
      <ViewerContainer>
        <Viewer color={color} labels={labels} />
      </ViewerContainer>

      <LineChooser />
      <CenterChooser />

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
});

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

export default Home;
