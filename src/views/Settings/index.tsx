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
      <Group>
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
      </Group>
      <Group>
        <InputContainer>
          <Input
            label="Pattern"
            description="($##/2.5) unit"
            value={store.labelPattern}
            onChange={(e) => store.setLabelPattern(e.currentTarget.value)}
          />
        </InputContainer>
      </Group>
      <Title>General</Title>
      <Group>
        <InputContainer>
          <label htmlFor="color">Color</label>
          <Colors
            colors={theme.colors}
            onChange={(color) => store.setColor(color)}
            color={store.color}
          />
        </InputContainer>
      </Group>
    </Wrapper>
  );
});

const Title = styled.h3``;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 3px 0 3px;
`;

const Group = styled.div`
  padding: 7px 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
  margin-top: 10px;
`;

const Wrapper = styled.div`
  position: relative;
  top: 0;
  overflow: auto;
  height: 358px;
  padding: 12px 8px 12px 14px;
  h3 {
    margin: 20px 0 5px;
    &:first-child {
      margin: 0 0 5px;
    }
  }
`;

export default Settings;
