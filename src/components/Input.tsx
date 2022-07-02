import React, { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';

import { QuestionMark } from './QuestionMark';

export const Input: FunctionComponent<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    description?: string | JSX.Element;
    width?: number;
  }
> = (props) => {
  const id = useMemo<string>(
    () => props.label.toLowerCase().replace(/\s/g, '-'),
    [props.label]
  );

  return (
    <InputWrapper>
      {props.label && <label htmlFor={id}>{props.label}</label>}
      {props.description && <QuestionMark>{props.description}</QuestionMark>}

      <input
        id={id}
        type={props.type || 'text'}
        value={props.value}
        style={{ width: props.width || 60 }}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </InputWrapper>
  );
};

const InputWrapper = styled.div.attrs(() => ({
  className: 'input',
}))`
  display: flex;
  width: 100%;
  align-items: center;
  label {
    margin-right: 10px;
    font-weight: 500;
    color: var(--figma-color-text);
    p {
      color: var(--figma-color-text-onbrand-secondary);
      font-size: 11px;
      font-weight: normal;
      margin: 0;
    }
  }
  input {
    margin-left: auto;
    width: 60px;
    background-color: transparent;
    border-color: var(--figma-color-bg-tertiary);
    color: var(--figma-color-text);
  }
`;
