import { observer } from 'mobx-react';
import React, { FunctionComponent, useMemo } from 'react';
import styled, { css } from 'styled-components';

import EventEmitter from '../../../../../shared/EventEmitter';
import { useStore } from '../../../../../store';

export const Spacing: FunctionComponent = observer(() => {
  const store = useStore();

  const hasSpacing = useMemo(
    () => store.selection.some((selection) => selection.hasSpacing),
    [store.selection]
  );

  const refreshSelection = () =>
    EventEmitter.ask('current selection').then((data: string[]) =>
      store.setSelection(data)
    );

  const addSpacing = () => {
    EventEmitter.emit('draw spacing', {
      color: store.color,
      labels: store.labels,
      strokeOffset: store.strokeOffset,
      labelsOutside: store.labelsOutside,
      labelPattern: store.labelPattern,
    });
    refreshSelection();
  };

  const removeSpacing = () => {
    if (hasSpacing) {
      EventEmitter.emit('remove spacing');
      refreshSelection();
    }
  };

  return (
    <Wrapper
      onClick={() => (hasSpacing ? removeSpacing() : addSpacing())}
      enabled={store.selection.length === 2 || hasSpacing}
      active={hasSpacing}
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
    border-bottom: 3px solid ${(props) => props.theme.softColor};
  }
  &::before {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 3px solid ${(props) => props.theme.softColor};
    bottom: -9px;
  }
`;

const ArrowLeftRight = css`
  top: calc(50% - 4.5px);

  &::after {
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-right: 3px solid ${(props) => props.theme.softColor};
  }
  &::before {
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 3px solid ${(props) => props.theme.softColor};
    right: -9px;
  }
`;

const Wrapper = styled.div.attrs<{ enabled?: boolean; active?: boolean }>(
  (p) => ({
    className: `${p.enabled && 'enabled'} ${p.active && 'active'}`,
  })
)<{ enabled?: boolean; active?: boolean }>`
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
      border-color: ${(props) => props.theme.hoverColor};
    }
  }
  &::after {
    content: '';
    position: absolute;
    left: -5px;
    top: -5px;
    border: 1px dashed ${(props) => props.theme.softColor};
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
