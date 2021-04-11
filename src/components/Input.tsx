import React, { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';

export const Input: FunctionComponent<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    description?: string;
  }
> = (props) => {
  const id = useMemo<string>(
    () => props.label.toLowerCase().replace(/\s/g, '-'),
    [props.label]
  );

  return (
    <InputWrapper>
      {props.label && (
        <label htmlFor={id}>
          {props.label}
          {props.description && <p>{props.description}</p>}
        </label>
      )}

      <input
        id={id}
        type={props.type || 'text'}
        value={props.value}
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
  justify-content: space-between;
  width: 100%;
  align-items: center;
  label {
    p {
      color: #999;
      font-size: 11px;
      font-weight: normal;
      margin: 0;
    }
  }
  input {
    width: 30%;
  }
`;