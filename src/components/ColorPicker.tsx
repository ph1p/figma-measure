import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useStore } from '../store';
import { theme } from '../style';

const ColorItem = styled.div<{ color: string; active: boolean }>`
  position: absolute;
  left: 4px;
  top: 4px;
  z-index: 0;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background-color: ${(props) => props.color};
  cursor: pointer;
  transition: all 0.3s;
`;

const ColorsWrapper = styled.div`
  position: absolute;
  display: flex;
  left: 12px;
  bottom: 12px;
  top: initial;
  opacity: 1;
  z-index: 4;

  .active-color {
    position: relative;
    z-index: 1;
    border: 1px solid var(--figma-color-bg-disabled);

    background-color: var(--figma-color-bg-hover);
    /* background-color: #fff;
    border: 1px solid #e8e8e8; */
    padding: 3px;
    border-radius: 10px;
    transition: all 0.3s;
    width: 30px;
    div {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      transition: all 0.3s;
      background-color: ${(p) => p.theme.color};
      z-index: 1;
    }
  }

  ${ColorItem} {
    opacity: 0;
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }

  &:hover {
    width: 196px;
    .active-color {
      width: 196px;
    }
    ${ColorItem} {
      opacity: 1;
      z-index: 2;
      &:nth-child(2) {
        transform: translate(35px, 0);
      }
      &:nth-child(3) {
        transform: translate(61px, 0);
      }
      &:nth-child(4) {
        transform: translate(87px, 0);
      }
      &:nth-child(5) {
        transform: translate(113px, 0);
      }
      &:nth-child(6) {
        transform: translate(139px, 0);
      }
      &:nth-child(7) {
        transform: translate(165px, 0);
      }
    }
  }
`;

export const Colors: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <ColorsWrapper>
      <div className="active-color">
        <div></div>
      </div>
      {theme.colors
        .filter((c) => c !== store.color)
        .map((color, i) => (
          <ColorItem
            key={i}
            color={color}
            active={color === store.color}
            onClick={() => color !== store.color && store.setColor(color)}
          />
        ))}
    </ColorsWrapper>
  );
});
