import { observer } from 'mobx-react';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components';

import { Colors } from '../../components/ColorPicker';
import { Input } from '../../components/Input';
import { Toggle } from '../../components/Toggle';
import EventEmitter from '../../shared/EventEmitter';
import { useStore } from '../../store';

const Settings: FunctionComponent = observer(() => {
  const theme = useContext(ThemeContext);
  const store = useStore();

  useEffect(() => {
    EventEmitter.emit('resize', {
      width: 250,
      height: 400,
    });
  }, []);

  return (
    <Wrapper>
      <Title>Labels</Title>
      <InputContainer>
        <Toggle
          checked={store.labelsOutside}
          label="Show next to line"
          onChange={(e) => store.setLabelsOutside(e.currentTarget.checked)}
        />
      </InputContainer>
      <InputContainer>
        <Toggle
          checked={store.labels}
          label="Show label"
          onChange={(e) => store.setLabels(e.currentTarget.checked)}
        />
      </InputContainer>
      <InputContainer>
        <Input
          label="Measurment unit"
          description='cm, mm, dp, pt, " or custom'
          value={store.unit}
          onChange={(e) => store.setUnit(e.currentTarget.value)}
        />
      </InputContainer>
      <InputContainer>
        <Input
          label="Multiplicator"
          placeholder="1"
          description="if > 1, then no auto calculation"
          type="number"
          defaultValue={store.multiplicator}
          onChange={(e) => store.setMultiplicator(+e.currentTarget.value)}
        />
      </InputContainer>
      <InputContainer>
        <Input
          label="Precision"
          placeholder="0"
          description="e. g. 2 -> (xx.xx)"
          type="number"
          defaultValue={store.precision}
          onChange={(e) => store.setPrecesion(+e.currentTarget.value)}
        />
      </InputContainer>

      <Title>General</Title>
      <InputContainer>
        <label htmlFor="color">Color</label>
        <Colors
          colors={theme.colors}
          onChange={(color) => store.setColor(color)}
          color={store.color}
        />
      </InputContainer>
    </Wrapper>
  );
});

const Title = styled.h3``;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 3px 0 6px;
`;

const Wrapper = styled.div`
  position: relative;
  top: 0;
  overflow: auto;
  height: 358px;
  padding: 12px 14px;
  h3 {
    margin: 20px 0 5px;
    &:first-child {
      margin: 0 0 5px;
    }
  }
`;

export default Settings;
