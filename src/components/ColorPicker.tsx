import React, { FunctionComponent, useRef } from 'react';
import styled from 'styled-components';

interface Props {
  onChange: (color: string) => void;
  color: string;
  id: string;
}

const Wrapper = styled.div`
  position: relative;
  width: 90px;
  input[type='color'] {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    width: 25px;
    height: 100%;
    border: 0;
    opacity: 0;
  }
  input[type='text'] {
    border-radius: 3px;
    border: 1px solid #e6e6e6;
    outline: none;
    padding: 7px 10px 7px 30px;
    box-sizing: border-box;
    font-size: 12px;
    width: 100%;
    &:focus {
      border-color: var(--blue);
    }
  }
  .color {
    position: absolute;
    top: 7px;
    left: 7px;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    pointer-events: none;
    cursor: pointer;
  }
`;

export const ColorPicker: FunctionComponent<Props> = (props) => {
  const colorRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const checkColorAndSetValues = (color) => {
    props.onChange(color);
    colorInputRef.current.value = color;
    colorRef.current.value = color;
  };

  const onChange = (e) => {
    const color = e.currentTarget?.value;

    if (color && /^#[0-9A-F]{6}$/i.test(color)) {
      checkColorAndSetValues(color);
    }
  };

  const onBlur = (e) => {
    const color = e.currentTarget?.value;

    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      checkColorAndSetValues(props.color);
    }
  };

  return (
    <Wrapper>
      <div
        className="color"
        style={{
          backgroundColor: props.color,
        }}
      ></div>
      <input
        id={props.id}
        type="color"
        ref={colorRef}
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={props.color}
      />
      <input
        type="text"
        ref={colorInputRef}
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={props.color}
      />
    </Wrapper>
  );
};
