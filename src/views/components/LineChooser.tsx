import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { withAppContext } from '../../shared/AppContext';

interface Props {
  value: 'normal' | 'none' | 'arrow' | 'arrow-filled';
  onChange: (line: 'normal' | 'none' | 'arrow' | 'arrow-filled') => void;
}

const LineChooser: FunctionComponent<Props> = (props: Props) => {
  return (
    <Container>
      <Icons>
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={props.value === 'arrow-filled' ? 'active' : ''}
          onClick={() => props.onChange('arrow-filled')}
        >
          <rect
            x="0.5"
            y="0.5"
            width="29"
            height="29"
            rx="9.5"
            stroke="#E8E8E8"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13 18.5L8 15.6132L13 12.7265V15.1132H18V12.7265L23 15.6132L18 18.5V16.1132H13V18.5Z"
            fill="#A1A1A1"
          />
        </svg>

        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={props.value === 'none' ? 'active' : ''}
          onClick={() => props.onChange('none')}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21 16H9V15H21V16Z"
            fill="#A1A1A1"
          />
          <rect
            x="0.5"
            y="0.5"
            width="29"
            height="29"
            rx="9.5"
            stroke="#E8E8E8"
          />
        </svg>

        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={props.value === 'arrow' ? 'active' : ''}
          onClick={() => props.onChange('arrow')}
        >
          <rect
            x="0.5"
            y="0.5"
            width="29"
            height="29"
            rx="9.5"
            stroke="#E8E8E8"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.14645 15.8536C7.95118 15.6583 7.95118 15.3417 8.14645 15.1464L11.3284 11.9645C11.5237 11.7692 11.8403 11.7692 12.0355 11.9645C12.2308 12.1597 12.2308 12.4763 12.0355 12.6716L9.70711 15L20.2929 15L17.9645 12.6716C17.7692 12.4763 17.7692 12.1597 17.9645 11.9645C18.1597 11.7692 18.4763 11.7692 18.6716 11.9645L21.8536 15.1464C22.0488 15.3417 22.0488 15.6583 21.8536 15.8536L18.6716 19.0355C18.4763 19.2308 18.1597 19.2308 17.9645 19.0355C17.7692 18.8403 17.7692 18.5237 17.9645 18.3284L20.2929 16L9.70711 16L12.0355 18.3284C12.2308 18.5237 12.2308 18.8403 12.0355 19.0355C11.8403 19.2308 11.5237 19.2308 11.3284 19.0355L8.14645 15.8536Z"
            fill="#A1A1A1"
          />
        </svg>

        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={props.value === 'normal' ? 'active' : ''}
          onClick={() => props.onChange('normal')}
        >
          <rect
            x="0.5"
            y="0.5"
            width="29"
            height="29"
            rx="9.5"
            stroke="#E8E8E8"
          />
          <path
            d="M9 18V13H10L10 15H20V13H21V18H20V16H10L10 18H9Z"
            fill="#A1A1A1"
          />
        </svg>
      </Icons>
      <div>
        <input type="text" name="" id="" />
      </div>
    </Container>
  );
};

const Icons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 135px;
`;

const Container = styled.div`
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-width: 1px 0;
  border-color: #eee;
  border-style: solid;
  input {
    width: 75px;
    padding: 5px 10px;
    box-sizing: border-box;
  }
  svg {
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
    &:hover,
    &.active {
      rect {
        stroke: #1745e8;
      }
      path {
        fill: #1745e8;
      }
    }
  }
`;

export default withAppContext(LineChooser);
