import React, { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  label {
    font-weight: bold;
    user-select: none;
    cursor: pointer;
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
        background-color: #1745e8;
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
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
> = (props) => {
  const { label, children, ...rest } = props;

  const id = useMemo<string>(() => label.toLowerCase().replace(/\s/g, '-'), [
    label,
  ]);

  return (
    <Wrapper>
      {label && <label htmlFor={id}>{label}</label>}
      <InputWrapper>
        <input id={id} {...rest} type="checkbox" />
        <span></span>
      </InputWrapper>
    </Wrapper>
  );
};
