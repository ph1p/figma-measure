import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useStore } from '../../../store';

const CenterChooser: FunctionComponent = observer(() => {
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
          className={store.fill === 'stroke' ? 'active' : ''}
          onClick={() => store.setFill('stroke')}
        >
          <rect
            x="0.5"
            y="0.5"
            width="29"
            height="29"
            rx="9.5"
            stroke="#E8E8E8"
          />
          <rect
            x="4.5"
            y="4.5"
            width="21"
            height="21"
            rx="7.5"
            stroke="#A1A1A1"
          />
        </svg>

        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="https://www.w3.org/2000/svg"
          className={store.fill === 'dashed' ? 'active' : ''}
          onClick={() => store.setFill('dashed')}
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
            d="M10.9551 25.9324L11.0845 24.9408C11.3837 24.9798 11.6892 25 12 25H13V26H12C11.6459 26 11.2971 25.977 10.9551 25.9324ZM17 26V25H18C18.3108 25 18.6163 24.9798 18.9155 24.9408L19.0449 25.9324C18.7029 25.977 18.3541 26 18 26H17ZM22.8703 24.3472L22.2609 23.5543C22.7462 23.1814 23.1814 22.7462 23.5543 22.2609L24.3472 22.8703C23.9213 23.4245 23.4245 23.9213 22.8703 24.3472ZM26 13H25V12C25 11.6892 24.9798 11.3837 24.9408 11.0845L25.9324 10.9551C25.977 11.2971 26 11.6459 26 12V13ZM24.3472 7.12973L23.5543 7.73905C23.1814 7.25377 22.7462 6.81865 22.2609 6.44572L22.8703 5.6528C23.4245 6.07869 23.9213 6.57553 24.3472 7.12973ZM13 4H12C11.6459 4 11.2971 4.02301 10.9551 4.06762L11.0845 5.05922C11.3837 5.02019 11.6892 5 12 5H13V4ZM7.12973 5.6528L7.73905 6.44572C7.25377 6.81865 6.81865 7.25377 6.44572 7.73905L5.6528 7.12973C6.07869 6.57552 6.57552 6.07869 7.12973 5.6528ZM4 17H5V18C5 18.3108 5.02019 18.6163 5.05922 18.9155L4.06762 19.0449C4.02301 18.7029 4 18.3541 4 18V17ZM5.6528 22.8703L6.44572 22.2609C6.81865 22.7462 7.25377 23.1814 7.73905 23.5543L7.12973 24.3472C6.57552 23.9213 6.07869 23.4245 5.6528 22.8703ZM4 13H5V12C5 11.6892 5.02019 11.3837 5.05922 11.0845L4.06762 10.9551C4.02301 11.2971 4 11.6459 4 12V13ZM17 4V5H18C18.3108 5 18.6163 5.02019 18.9155 5.05922L19.0449 4.06762C18.7029 4.02301 18.3541 4 18 4H17ZM26 17H25V18C25 18.3108 24.9798 18.6163 24.9408 18.9155L25.9324 19.0449C25.977 18.7029 26 18.3541 26 18V17Z"
            fill="#A1A1A1"
          />
        </svg>

        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="https://www.w3.org/2000/svg"
          className={store.fill === 'fill-stroke' ? 'active' : ''}
          onClick={() => store.setFill('fill-stroke')}
        >
          <rect
            x="0.5"
            y="0.5"
            width="29"
            height="29"
            rx="9.5"
            stroke="#E8E8E8"
          />
          <rect
            x="4.5"
            y="4.5"
            width="21"
            height="21"
            rx="7.5"
            fill="#E4E4E4"
            stroke="#A1A1A1"
            className="background"
          />
        </svg>

        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="https://www.w3.org/2000/svg"
          className={store.fill === 'fill' ? 'active' : ''}
          onClick={() => store.setFill('fill')}
        >
          <rect
            x="0.5"
            y="0.5"
            width="29"
            height="29"
            rx="9.5"
            stroke="#E8E8E8"
          />
          <rect
            x="4"
            y="4"
            width="22"
            height="22"
            rx="8"
            fill="#E4E4E4"
            className="background"
          />
        </svg>
      </Icons>
      <div className="input icon" style={{ width: 75 }}>
        <input
          type="number"
          value={store.opacity}
          onChange={(e) => store.setOpacity(+e.currentTarget.value)}
        />
        <div>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="https://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 0H4V1H6V0ZM8.5 9H9V8.5H10V9V10H9H8.5V9ZM1 4V6H0V4H1ZM9 1.5V1H8.5V0H9H10V1V1.5H9ZM9 4V6H10V4H9ZM1 1.5V1H1.5V0H1H0V1V1.5H1ZM0 9V8.5H1V9H1.5V10H1H0V9ZM6 9H4V10H6V9Z"
              fill="black"
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
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-width: 1px 0 0;
  border-color: #eee;
  border-style: solid;
  input {
    width: 75px;
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

      .background {
        fill: ${(props) => props.theme.softColor};
      }

      path {
        fill: ${(props) => props.theme.color};
      }
    }
  }
`;

export default CenterChooser;
