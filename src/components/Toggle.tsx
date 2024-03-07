import React, { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';

import { QuestionMark } from './QuestionMark';

export const Toggle: FunctionComponent<
  React.InputHTMLAttributes<HTMLInputElement> & {
    description?: string;
    label?: string;
    inline?: boolean;
  }
> = (props) => {
  const inputProps = {
    ...props,
  };
  delete inputProps.label;
  delete inputProps.children;
  delete inputProps.inline;

  const id = useMemo<string>(
    () => props.label.toLowerCase().replace(/\s/g, '-'),
    [props.label],
  );

  return (
    <Wrapper>
      <Flex inline={props.inline}>
        {props.label && <label htmlFor={id}>{props.label}</label>}
        {props.description && (
          <QuestionMark hover>{props.description}</QuestionMark>
        )}
        <InputWrapper>
          <input id={id} {...inputProps} type="checkbox" />
          <span></span>
        </InputWrapper>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  p {
    font-size: 10px;
    color: #999;
    margin: 0;
  }
`;

const Flex = styled.div<{ inline?: boolean }>`
  display: flex;
  align-items: center;
  width: ${(props) => (props.inline ? 'auto' : '100%')};

  label {
    font-weight: normal;
    user-select: none;
    cursor: pointer;
    margin-right: ${(props) => (props.inline ? 5 : 10)}px;
  }
`;

const InputWrapper = styled.div`
  width: 34px;
  height: 21px;
  box-sizing: border-box;
  position: relative;
  margin-left: auto;
  input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    &:checked {
      & + span {
        background-color: ${(props) => props.theme.color};
        &:before {
          content: '';
          transform: translateX(12px);
        }
      }
    }
    + span {
      transition: background-color 0.3s;
      display: block;
      pointer-events: none;
      position: absolute;
      height: 100%;
      width: 100%;
      content: '';
      background-color: var(--figma-color-bg-hover);
      /* background-color: var(--figma-color-bg-disabled); */
      border-radius: 14px;
      &:before {
        content: '';
        transition: all 0.2s;
        position: absolute;
        background-color: #fff;
        border-radius: 100%;
        height: 13px;
        width: 13px;
        top: 4px;
        left: 4px;
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.4);
      }
    }
  }
`;
