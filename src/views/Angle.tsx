import React, {
  FunctionComponent,
  useState,
  createRef,
  useEffect
} from 'react';
import { sendMessage, withAppContext, Content } from '../shared';
import Header from '../components/Header';

const Presets: FunctionComponent = (props: any) => {
  useEffect(() => {
    sendMessage('resize', {
      width: 250,
      height: 400
    });
  }, []);

  return (
    <>
      <Header backButton title="Angle" />
      <Content>
        <h4>Angle</h4>
        <div
          className="align-icon angle"
          onClick={() =>
            props.appData.selection ? sendMessage('angle') : null
          }
        />
      </Content>
    </>
  );
};

export default withAppContext(Presets);
