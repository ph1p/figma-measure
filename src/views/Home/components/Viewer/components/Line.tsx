import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  labels?: boolean;
  labelsOutside?: boolean;
}

const Horizontal: FunctionComponent<Props> = (props) => (
  <HorizontalLine {...props}>
    <div></div>
  </HorizontalLine>
);

const Vertical: FunctionComponent<Props> = (props) => (
  <VerticalLine {...props}>
    <div></div>
  </VerticalLine>
);

const Corner: FunctionComponent<Props> = (props) => (
  <CornerLine {...props}>
    <div></div>
  </CornerLine>
);

const VerticalLine = styled.div.attrs<Props>((props) => ({
  className: props.active ? 'active' : '',
}))<Props>`
  background-color: transparent;
  border-radius: 5px;
  width: 11px;
  height: 60px;
  position: relative;
  cursor: pointer;
  margin: auto 0;
  z-index: 10;
  &:hover {
    z-index: 4;
    background-color: ${(props) => props.theme.hoverColor};
  }
  div {
    position: absolute;
    top: 5px;
    left: 5px;
    height: calc(100% - 10px);
    width: 1px;
    background-color: ${(props) => props.theme.softColor};
    &::after {
      content: '';
      display: ${(props) => (props.labels ? 'block' : 'none')};
      position: absolute;
      background-color: ${(props) => props.theme.softColor};
      width: 3px;
      left: ${(props) => (props.labelsOutside ? 3 : -1)};
      height: 29%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  &::after,
  &::before {
    content: '';
    position: absolute;
    width: 5px;
    height: 1px;
    left: 3px;
    background-color: ${(props) => props.theme.softColor};
  }
  &::after {
    top: 5px;
  }
  &::before {
    bottom: 5px;
  }

  &.active {
    &::after,
    &::before,
    div,
    div::after {
      background-color: ${(props) => props.theme.color};
    }
  }
`;

const HorizontalLine = styled(VerticalLine).attrs<Props>((props) => ({
  className: props.active ? 'active' : '',
}))<Props>`
  border-radius: 5px;
  height: 11px;
  width: 60px;
  margin: 0 auto;
  div {
    height: 1px;
    width: calc(100% - 10px);
    &::after {
      height: 3px;
      top: ${(props) => (props.labelsOutside ? 3 : -1)};
      width: 29%;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &::after,
  &::before {
    height: 5px;
    width: 1px;
    left: inherit;
    top: 3px;
  }
  &::after {
    left: 5px;
  }
  &::before {
    right: 5px;
  }
`;

const CornerLine = styled.div.attrs<Props>((props) => ({
  className: props.active ? 'active' : '',
}))<Props>`
  width: 17px;
  height: 17px;
  padding: 8px;
  position: relative;
  cursor: pointer;
  &:hover::after,
  &:hover div::after {
    background-color: rgb(232, 236, 253);
  }
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    left: 4px;
    top: 4px;
    height: 9px;
    z-index: -1;
    border-radius: 7px 5px 5px 0;
  }
  div {
    width: 9px;
    height: 9px;
    position: absolute;
    border-top-left-radius: 5px;
    border-width: 1px 0 0 1px;
    border-style: solid;
    border-color: ${(props) => props.theme.softColor};
    &::after {
      content: '';
      display: 'block';
      position: absolute;
      left: -5px;
      width: 9px;
      height: 14px;
      z-index: -1;
      top: -1px;
      border-radius: 0 0 4px 4px;
    }
  }
  &[data-direction='top-left'] {
  }
  &[data-direction='top-right'] {
    transform: rotate(90deg);
  }
  &[data-direction='right-bottom'] {
    transform: rotate(180deg);
  }
  &[data-direction='left-bottom'] {
    transform: rotate(-90deg);
  }

  &.active {
    div {
      border-color: ${(props) => props.theme.color};
    }
  }
`;

export default {
  Horizontal,
  Vertical,
  Corner,
};
