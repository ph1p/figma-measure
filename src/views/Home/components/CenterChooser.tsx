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
            rx="6"
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
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
              rx="5.5"
              stroke="#A1A1A1"
              strokeDasharray="2 2"
            />
          </svg>
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
            rx="6"
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
            rx="6"
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
            <rect
              width="10"
              height="10"
              fill="url(#paint0_linear_3051_64305)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_3051_64305"
                x1="5"
                y1="0"
                x2="5"
                y2="10"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#C4C4C4" />
                <stop offset="1" stop-color="#C4C4C4" stop-opacity="0" />
              </linearGradient>
            </defs>
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
  border-width: 1px 0 1px;
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
