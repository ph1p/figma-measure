import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import EventEmitter from '../../../../../shared/EventEmitter';
import { NodeSelection } from '../../../../../shared/interfaces';
import { useStore } from '../../../../../store';

export const Spacing: FunctionComponent<{
  showSpacing: boolean;
  hasSpacing: boolean;
}> = observer((props) => {
  const store = useStore();

  const refreshSelection = () =>
    EventEmitter.ask('current selection').then((data: NodeSelection) =>
      store.setSelection(data.nodes),
    );

  const addSpacing = () => {
    if (store.selection.length > 1) {
      EventEmitter.emit('draw spacing', {
        color: store.color,
        labels: store.labels,
        strokeOffset: store.strokeOffset,
        labelsOutside: store.labelsOutside,
        labelPattern: store.labelPattern,
        strokeCap: store.strokeCap,
      });
      refreshSelection();
    }
  };

  const removeSpacing = () => {
    if (props.showSpacing) {
      EventEmitter.emit('remove spacing');
      refreshSelection();
    }
  };

  return (
    <Wrapper
      onClick={() => (props.hasSpacing ? removeSpacing() : addSpacing())}
      enabled={props.showSpacing ? props.showSpacing : undefined}
      active={props.hasSpacing ? props.hasSpacing : undefined}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </Wrapper>
  );
});

const ArrowTopBottom = css`
  left: calc(50% - 4.5px);

  &::after {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 3px solid var(--figma-color-bg-disabled);
  }
  &::before {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 3px solid var(--figma-color-bg-disabled);
    bottom: -9px;
  }
`;

const ArrowLeftRight = css`
  top: calc(50% - 4.5px);

  &::after {
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-right: 3px solid var(--figma-color-bg-disabled);
  }
  &::before {
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 3px solid var(--figma-color-bg-disabled);
    right: -9px;
  }
`;

const Wrapper = styled.div.attrs<{ enabled?: boolean; active?: boolean }>(
  (p) => ({
    className: `${p.enabled && 'enabled'} ${p.active && 'active'}`,
  }),
)<{ enabled?: boolean | string; active?: boolean | string }>`
  position: absolute;
  left: -15px;
  top: -15px;
  border: 9px solid transparent;
  margin: 3px;
  border-radius: 20px;
  width: 127px;
  height: 127px;
  opacity: 0;
  &.enabled {
    opacity: 1;
    cursor: pointer;
    &:hover {
      border-color: var(--figma-color-bg-hover);
    }
  }
  &::after {
    content: '';
    position: absolute;
    left: -5px;
    top: -5px;
    border: 1px dashed var(--figma-color-bg-disabled);
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    border-radius: 17px;
  }
  div {
    position: absolute;
    &::after,
    &::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
    }
  }
  div:nth-child(1) {
    ${ArrowTopBottom}
    top: -9px;
  }
  div:nth-child(2) {
    ${ArrowLeftRight}
    left: -9px;
  }
  div:nth-child(3) {
    ${ArrowTopBottom}
    bottom: 0px;
  }
  div:nth-child(4) {
    ${ArrowLeftRight}
    right: 0;
  }

  &.active {
    &::after {
      border-color: ${(props) => props.theme.color};
    }
    div:nth-child(1),
    div:nth-child(3) {
      &::after {
        border-bottom: 3px solid ${(props) => props.theme.color};
      }
      &::before {
        border-top: 3px solid ${(props) => props.theme.color};
      }
    }
    div:nth-child(2n) {
      &::after {
        border-right: 3px solid ${(props) => props.theme.color};
      }
      &::before {
        border-left: 3px solid ${(props) => props.theme.color};
      }
    }
  }
`;
