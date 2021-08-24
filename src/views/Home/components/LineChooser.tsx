import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useStore } from '../../../store';

const LineChooser: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <Container>
      <Icons>
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="https://www.w3.org/2000/svg"
          className={store.strokeCap === 'ARROW_EQUILATERAL' ? 'active' : ''}
          onClick={() => store.setStrokeCap('ARROW_EQUILATERAL')}
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
          xmlns="https://www.w3.org/2000/svg"
          className={store.strokeCap === 'NONE' ? 'active' : ''}
          onClick={() => store.setStrokeCap('NONE')}
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
          xmlns="https://www.w3.org/2000/svg"
          className={store.strokeCap === 'ARROW_LINES' ? 'active' : ''}
          onClick={() => store.setStrokeCap('ARROW_LINES')}
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
          xmlns="https://www.w3.org/2000/svg"
          className={store.strokeCap === 'STANDARD' ? 'active' : ''}
          onClick={() => store.setStrokeCap('STANDARD')}
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
      <div className="input icon" style={{ width: 75 }}>
        <input
          type="number"
          value={store.strokeOffset}
          onChange={(e) => store.setStrokeOffset(+e.currentTarget.value)}
        />
        <div>
          <svg
            width="13"
            height="14"
            viewBox="0 0 13 14"
            fill="none"
            xmlns="https://www.w3.org/2000/svg"
          >
            <path
              d="M0.999999 10L0.999999 13H2L2 10H3L3 4H2L2 1H1L1 4H0V10H0.999999Z"
              fill="#BBBBBB"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.5 7.5H4V6.5H5.5V7.5ZM9 7.5H7.25V6.5H9V7.5Z"
              fill="#4A4A4A"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 12.5L13 12.5L13 13.5L12 13.5C11.1716 13.5 10.5 12.8284 10.5 12L10.5 2C10.5 1.17157 11.1716 0.5 12 0.5L13 0.5L13 1.5L12 1.5C11.7239 1.5 11.5 1.72386 11.5 2L11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z"
              fill="#BBBBBB"
            />
          </svg>
        </div>
      </div>
    </Container>
  );
});

const Icons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 135px;
`;

const Container = styled.div`
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-width: 1px 0 0;
  border-color: #eee;
  border-style: solid;
  input {
    width: 75px;
    box-sizing: border-box;
  }
  svg {
    cursor: pointer;

    &:not(.active):hover {
      rect {
        stroke: ${(props) => props.theme.softColor};
      }
      path {
        fill: ${(props) => props.theme.softColor};
      }
    }

    &.active {
      rect {
        stroke: ${(props) => props.theme.color};
      }
      path {
        fill: ${(props) => props.theme.color};
      }
    }
  }
`;

export default LineChooser;
