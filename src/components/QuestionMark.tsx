import React, { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

import Tooltip from './Tooltip';

interface Props {
  hover?: boolean;
}

export const QuestionMark: FunctionComponent<PropsWithChildren<Props>> = (
  props,
) => (
  <Tooltip
    hover={props.hover}
    handler={React.forwardRef<HTMLDivElement, unknown>((_, ref) => (
      <Handle ref={ref}>?</Handle>
    ))}
  >
    <Description>{props.children}</Description>
  </Tooltip>
);

const Description = styled.div`
  width: 200px;
  strong {
    background-color: #fff;
    border-radius: 3px;
    padding: 1px 3px;
    color: #000;
    display: inline-block;
  }
  h3 {
    margin: 5px 0 8px;
  }
`;

const Handle = styled.div`
  background-color: var(--figma-color-bg-hover);
  position: relative;
  width: 16px;
  height: 16px;
  line-height: 16px;
  border-radius: 4px;
  color: var(--figma-color-bg-inverse);
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.color};
    color: ${(props) => props.theme.hoverColor};
  }
`;
