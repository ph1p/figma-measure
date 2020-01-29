import React, {
  FunctionComponent,
  useEffect
} from 'react';
import { sendMessage, withAppContext, Content } from '../shared';
import Header from '../components/Header';

const Presets: FunctionComponent = (props: any) => {
  useEffect(() => {
    sendMessage('resize', {
      width: 150,
      height: 90
    });
  }, []);

  return (
    <>
      <Header backButton title="Angle" />
      <Content>
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
