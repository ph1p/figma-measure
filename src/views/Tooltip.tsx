import React, {
  FunctionComponent,
  useState,
  createRef,
  useEffect
} from 'react';
import styled from 'styled-components';
import { sendMessage, withAppContext, Content } from '../shared';

// components
import Header from '../components/Header';
import Select from '../components/Select';

const Tooltip: FunctionComponent = (props: any) => {
  const [vertical, setVertical] = useState<string>('CENTER');
  const [horizontal, setHorizontal] = useState<string>('LEFT');

  useEffect(() => {
    sendMessage('resize', {
      width: 250,
      height: 400
    });
  }, []);

  return (
    <>
      <Header backButton title="Tooltip" />
      <Content>
        <h4>Tooltip</h4>
        <div
          className="align-icon tooltip"
          onClick={() =>
            props.appData.selection
              ? sendMessage('tooltip', {
                  vertical,
                  horizontal
                })
              : null
          }
        />
      </Content>
      <Content>
        <h4>Vertical</h4>

        {props.appData.selection.map((v, i) => {
          return <div key={i}>{v.type}</div>;
        })}

        <Select
          value={vertical}
          values={{
            TOP: 'top',
            CENTER: 'center',
            BOTTOM: 'bottom'
          }}
          onChange={v => setVertical(v)}
        />
      </Content>
      <Content>
        <h4>Horizontal</h4>
        <Select
          value={horizontal}
          values={{
            LEFT: 'left',
            CENTER: 'center',
            RIGHT: 'right'
          }}
          onChange={v => setHorizontal(v)}
        />
      </Content>
    </>
  );
};

export default withAppContext(Tooltip);
