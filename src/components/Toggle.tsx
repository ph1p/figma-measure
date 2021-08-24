import React, { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ inline?: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.inline ? 'initial' : 'space-between')};
  align-items: center;
  width: ${(props) => (props.inline ? 'auto' : '100%')};
  label {
    font-weight: normal;
    user-select: none;
    cursor: pointer;
    margin-right: ${(props) => (props.inline ? 5 : 0)}px;
  }
`;

const InputWrapper = styled.div`
  width: 34px;
  height: 21px;
  box-sizing: border-box;
  position: relative;
  input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    margin: 0;
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
      background-color: #c0c6d9;
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

export const Toggle: FunctionComponent<
  React.InputHTMLAttributes<HTMLInputElement> & {
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
    [props.label]
  );

  return (
    <Wrapper inline={props.inline}>
      {props.label && <label htmlFor={id}>{props.label}</label>}
      <InputWrapper>
        <input id={id} {...inputProps} type="checkbox" />
        <span></span>
      </InputWrapper>
    </Wrapper>
  );
};
