import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import { ColorPicker } from '../components/ColorPicker';
import { Toggle } from '../components/Toggle';

// import pkg from '../../package.json';
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
      height: 530,
    });
  }, []);

  return (
    <>
      <ViewerContainer>
        <Viewer />
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
  padding: 12px;
  align-items: center;
  label {
    font-weight: bold;
  }
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
