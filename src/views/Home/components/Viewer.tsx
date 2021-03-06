import { reaction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import { PluginNodeData, TooltipPositions } from '../../../shared/interfaces';
import { useStore } from '../../../store';

const Wrapper = styled.div`
  .line {
    .element {
      fill: ${(props) => props.theme.softColor};
    }
    &.active {
      .element {
        fill: ${(props) => props.theme.color};
      }
      .background {
        fill: transparent;
      }
    }
    &:hover {
      .background {
        fill: ${(props) => props.theme.hoverColor};
      }
    }
  }

  .tooltip {
    path {
      stroke: ${(props) => props.theme.softColor};
      fill: transparent;
      &:not(.active):hover {
        fill: ${(props) => props.theme.softColor};
      }
      &.active {
        stroke: ${(props) => props.theme.color};
        fill: ${(props) => props.theme.color};
      }
    }
  }

  .center {
    .background {
      &.fill-stroke,
      &.fill {
        fill: ${(props) => props.theme.softColor};
        fill-opacity: 0.2;
      }
    }

    .border {
      stroke: ${(props) => props.theme.softColor};
    }

    &:hover {
      .background {
        &.fill {
          stroke: ${(props) => props.theme.color};
        }
      }
      .highlight {
        fill: ${(props) => props.theme.hoverColor};
      }
    }

    &.active {
      .border {
        stroke: ${(props) => props.theme.color};
      }
      .highlight {
        fill: ${(props) => props.theme.softColor};
      }
    }
  }
`;

const Viewer: FunctionComponent = observer(() => {
  const store = useStore();

  const clickTooltip = (e) => {
    if (store.selection.length > 0) {
      if (store.surrounding.tooltip === e.currentTarget.dataset.direction) {
        store.setSurrounding({
          ...store.surrounding,
          tooltip: TooltipPositions.NONE,
        });
      } else {
        store.setSurrounding({
          ...store.surrounding,
          tooltip: TooltipPositions[e.currentTarget.dataset.direction],
        });
      }
    }
  };

  // set data from selection
  useEffect(
    () =>
      reaction(
        () => store.selection.slice(),
        () => {
          const selection = toJS(store.selection);
          if (selection.length > 0) {
            try {
              const data: PluginNodeData = selection[0]?.data;

              if (data?.surrounding) {
                store.setSurrounding(data.surrounding, true);
              } else {
                store.resetSurrounding();
              }
            } catch {
              store.resetSurrounding();
            }
          } else {
            store.resetSurrounding();
          }
        }
      ),
    []
  );

  const clickCorner = (e) => {
    if (store.selection.length > 0) {
      let [first, second] = e.currentTarget.dataset.direction.split('-');

      first += 'Bar';
      second += 'Bar';

      store.setSurrounding({
        ...store.surrounding,
        [first]: !store.surrounding[first],
        [second]: !store.surrounding[second],
      });
    }
  };

  return (
    <Wrapper>
      <svg
        width="184"
        height="184"
        viewBox="0 0 184 184"
        fill="none"
        xmlns="https://www.w3.org/2000/svg"
      >
        <g
          data-direction="left-bottom"
          className={`left-bottom line ${
            store.surrounding.leftBar && store.surrounding.bottomBar
              ? 'active'
              : ''
          }`}
          onClick={clickCorner}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M44.0848 141.012L44.0848 137.494C44.0848 135.012 42.0511 133 39.5424 133C37.0337 133 35 135.012 35 137.494L35 142.51C35 146.647 38.3895 150 42.5707 150L47.4576 150C49.9663 150 52 147.988 52 145.506C52 143.024 49.9663 141.012 47.4576 141.012L44.0848 141.012Z"
            className="background"
            fill="transparent"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M39.999 142.505C39.999 143.886 41.1275 145.005 42.5196 145.005L46.9907 145.005L46.9907 146.005L42.5196 146.005C40.5707 146.005 38.9907 144.438 38.9907 142.505L38.9907 138.005L39.999 138.005L39.999 142.505Z"
            className="element"
          />
        </g>
        <g
          data-direction="right-bottom"
          className={`right-bottom line ${
            store.surrounding.rightBar && store.surrounding.bottomBar
              ? 'active'
              : ''
          }`}
          onClick={clickCorner}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M141.012 140.915L137.494 140.915C135.012 140.915 133 142.949 133 145.458C133 147.966 135.012 150 137.494 150L142.51 150C146.647 150 150 146.61 150 142.429L150 137.542C150 135.034 147.988 133 145.506 133C143.024 133 141.012 135.034 141.012 137.542L141.012 140.915Z"
            className="background"
            fill="transparent"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M142.499 144.992C143.88 144.992 145 143.863 145 142.471L145 138L146 138L146 142.471C146 144.42 144.433 146 142.499 146L138 146L138 144.992L142.499 144.992Z"
            className="element"
          />
        </g>
        <g
          data-direction="top-right"
          className={`top-right line ${
            store.surrounding.rightBar && store.surrounding.topBar
              ? 'active'
              : ''
          }`}
          onClick={clickCorner}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M140.915 43.9881L140.915 47.5059C140.915 49.9879 142.949 52 145.458 52C147.966 52 150 49.9879 150 47.5059L150 42.4901C150 38.3534 146.61 35 142.429 35L137.542 35C135.034 35 133 37.0121 133 39.4941C133 41.9761 135.034 43.9881 137.542 43.9881L140.915 43.9881Z"
            className="background"
            fill="transparent"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M144.992 42.5006C144.992 41.1196 143.863 40.0002 142.471 40.0002L138 40.0002L138 39L142.471 39C144.42 39 146 40.5673 146 42.5006L146 47L144.992 47L144.992 42.5006Z"
            className="element"
          />
        </g>
        <g
          data-direction="top-left"
          className={`top-left line ${
            store.surrounding.leftBar && store.surrounding.topBar
              ? 'active'
              : ''
          }`}
          onClick={clickCorner}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M43.9881 44.0848L47.5059 44.0848C49.9879 44.0848 52 42.0511 52 39.5424C52 37.0337 49.9879 35 47.5059 35L42.4901 35C38.3534 35 35 38.3895 35 42.5707L35 47.4576C35 49.9663 37.0121 52 39.4941 52C41.9761 52 43.9881 49.9663 43.9881 47.4576L43.9881 44.0848Z"
            className="background"
            fill="transparent"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.4913 40.0083C41.1104 40.0083 39.9909 41.1368 39.9909 42.5289L39.9909 47H38.9907L38.9907 42.5289C38.9907 40.5799 40.558 39 42.4913 39L46.9907 39L46.9907 40.0083L42.4913 40.0083Z"
            className="element"
          />
        </g>
        <g
          className={`center ${store.surrounding.center ? 'active' : ''}`}
          onClick={() =>
            store.setSurrounding({
              ...store.surrounding,
              center: !store.surrounding.center,
            })
          }
        >
          {(store.fill === 'fill' || store.fill === 'fill-stroke') && (
            <rect
              x="58"
              y="58"
              width="69"
              height="69"
              rx="8.5"
              className={`background ${store.fill}`}
              fill="#ddd"
              stroke="transparent"
            />
          )}

          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M54 66.5C54 59.5964 59.5964 54 66.5 54H118.5C125.404 54 131 59.5964 131 66.5V118.5C131 125.404 125.404 131 118.5 131H66.5C59.5964 131 54 125.404 54 118.5V66.5ZM67.5 62C64.4624 62 62 64.4624 62 67.5V117.5C62 120.538 64.4624 123 67.5 123H117.5C120.538 123 123 120.538 123 117.5V67.5C123 64.4624 120.538 62 117.5 62H67.5Z"
            fill="transparent"
            className="highlight"
          />

          {store.fill !== 'fill' && (
            <rect
              x="58"
              y="58"
              width="69"
              height="69"
              rx="8.5"
              className="border"
              strokeDasharray={store.fill === 'dashed' ? '3 2' : '0'}
            />
          )}
        </g>
        <g
          className={`veritical-middle-bar line ${
            store.surrounding.verticalBar ? 'active' : ''
          }`}
          onClick={() =>
            store.setSurrounding({
              ...store.surrounding,
              verticalBar: !store.surrounding.verticalBar,
            })
          }
        >
          {store.labels && (
            <rect
              x="98"
              y="113"
              width="11"
              height="43"
              rx="5"
              transform="rotate(-180 98 113)"
              fill="transparent"
              className="background"
            />
          )}

          <path
            d="M90 74V75L92 75L92 86H93L93 75L95 75V74H90Z"
            className="element"
          />

          <path
            d="M90 108V109H95V108H93L93 97H92L92 108H90Z"
            className="element"
          />
        </g>
        <g
          className={`horizontal-middle-bar line ${
            store.surrounding.horizontalBar ? 'active' : ''
          }`}
          onClick={() =>
            store.setSurrounding({
              ...store.surrounding,
              horizontalBar: !store.surrounding.horizontalBar,
            })
          }
        >
          <rect
            x="114"
            y="86"
            width="11"
            height="43"
            rx="5"
            transform="rotate(90 114 86)"
            fill="transparent"
            className="background"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M76 94H75V92V91V89H76L76 91L109 91V89H110V91V92V94H109V92L76 92L76 94Z"
            className="element"
          />
          {store.labels && (
            <rect
              x="96"
              y="93"
              width="7"
              height="3"
              transform="rotate(-180 96 93)"
              className="element"
            />
          )}
        </g>

        <g className="tooltip">
          <path
            data-direction="RIGHT"
            onClick={clickTooltip}
            className={
              store.surrounding.tooltip === TooltipPositions.RIGHT
                ? 'active'
                : ''
            }
            d="M163.122 87.5434L160.301 90.29C159.9 90.6812 159.9 91.3188 160.301 91.71L163.122 94.4566C163.315 94.6444 163.423 94.9 163.423 95.1666V98C163.423 99.6569 164.791 101 166.479 101L179.944 101C181.632 101 183 99.6569 183 98L183 84C183 82.3431 181.632 81 179.944 81L166.479 81C164.791 81 163.423 82.3432 163.423 84V86.8334C163.423 87.1 163.315 87.3556 163.122 87.5434Z"
            fill="#E8ECFD"
          />
          <path
            data-direction="BOTTOM"
            onClick={clickTooltip}
            className={
              store.surrounding.tooltip === TooltipPositions.BOTTOM
                ? 'active'
                : ''
            }
            d="M95.4566 163.122L92.71 160.301C92.3188 159.9 91.6812 159.9 91.29 160.301L88.5434 163.122C88.3556 163.315 88.1 163.423 87.8334 163.423H85C83.3431 163.423 82 164.791 82 166.479L82 179.944C82 181.632 83.3431 183 85 183L99 183C100.657 183 102 181.632 102 179.944L102 166.479C102 164.791 100.657 163.423 99 163.423H96.1666C95.9 163.423 95.6444 163.315 95.4566 163.122Z"
            fill="#E8ECFD"
          />
          <path
            data-direction="LEFT"
            onClick={clickTooltip}
            className={
              store.surrounding.tooltip === TooltipPositions.LEFT
                ? 'active'
                : ''
            }
            d="M20.8782 94.4566L23.6987 91.71C24.1004 91.3188 24.1004 90.6812 23.6987 90.29L20.8782 87.5434C20.6854 87.3556 20.577 87.1 20.577 86.8334V84C20.577 82.3431 19.2089 81 17.5212 81L4.05579 81C2.36813 81 1 82.3431 1 84L1 98C1 99.6569 2.36812 101 4.05579 101L17.5212 101C19.2089 101 20.577 99.6569 20.577 98V95.1666C20.577 94.9 20.6854 94.6444 20.8782 94.4566Z"
            fill="#E8ECFD"
          />
          <path
            data-direction="TOP"
            onClick={clickTooltip}
            className={
              store.surrounding.tooltip === TooltipPositions.TOP ? 'active' : ''
            }
            d="M88.5434 20.8782L91.29 23.6987C91.6812 24.1004 92.3188 24.1004 92.71 23.6987L95.4566 20.8782C95.6444 20.6854 95.9 20.577 96.1666 20.577H99C100.657 20.577 102 19.2089 102 17.5212L102 4.05579C102 2.36813 100.657 1 99 1L85 1C83.3431 1 82 2.36813 82 4.05579L82 17.5212C82 19.2089 83.3431 20.577 85 20.577H87.8334C88.1 20.577 88.3556 20.6854 88.5434 20.8782Z"
            fill="#E8ECFD"
          />
        </g>

        <g
          className={`left-bar line ${
            store.surrounding.leftBar ? 'active' : ''
          }`}
          onClick={() =>
            store.setSurrounding({
              ...store.surrounding,
              leftBar: !store.surrounding.leftBar,
            })
          }
        >
          <rect
            x="34"
            y="62"
            width="11"
            height="61"
            rx="5"
            className="background"
            fill="transparent"
          />
          <path
            d="M42.0002 69H40.0002L40.0002 115H42.0002V116H37.0002L37.0002 115L39.0002 115L39.0002 69L37.0002 69L37.0002 68L42.0002 68V69Z"
            className="element"
          />
          {store.labels && (
            <rect x="38" y="85" width="3" height="14" className="element" />
          )}
        </g>

        <g
          className={`right-bar line ${
            store.surrounding.rightBar ? 'active' : ''
          }`}
          onClick={() =>
            store.setSurrounding({
              ...store.surrounding,
              rightBar: !store.surrounding.rightBar,
            })
          }
        >
          <rect
            x="140"
            y="62"
            width="11"
            height="61"
            rx="5"
            className="background"
            fill="transparent"
          />
          <path
            d="M148 69H146L146 115H148V116H143L143 115L145 115L145 69L143 69L143 68L148 68V69Z"
            className="element"
          />
          {store.labels && (
            <rect x="144" y="85" width="3" height="14" className="element" />
          )}
        </g>

        <g
          className={`top-bar line ${store.surrounding.topBar ? 'active' : ''}`}
          onClick={() =>
            store.setSurrounding({
              ...store.surrounding,
              topBar: !store.surrounding.topBar,
            })
          }
        >
          <rect
            x="123"
            y="34"
            width="11"
            height="61"
            rx="5"
            transform="rotate(90 123 34)"
            className="background"
            fill="transparent"
          />
          <path
            d="M116 42.0001L116 40.0001L70 40.0001L70 42.0001L69 42.0001L69 37.0001L70 37.0001L70 39.0001L116 39.0001L116 37.0001L117 37.0001L117 42.0001L116 42.0001Z"
            className="element"
          />
          {store.labels && (
            <rect
              x="100"
              y="38"
              width="3"
              height="14"
              transform="rotate(90 100 38)"
              className="element"
            />
          )}
        </g>

        <g
          className={`bottom-bar line ${
            store.surrounding.bottomBar ? 'active' : ''
          }`}
          onClick={() =>
            store.setSurrounding({
              ...store.surrounding,
              bottomBar: !store.surrounding.bottomBar,
            })
          }
        >
          <rect
            x="123"
            y="140"
            width="11"
            height="61"
            rx="5"
            transform="rotate(90 123 140)"
            className="background"
            fill="transparent"
          />
          <path
            d="M116 148L116 146L70 146L70 148L69 148L69 143L70 143L70 145L116 145L116 143L117 143L117 148L116 148Z"
            className="element"
          />
          {store.labels && (
            <rect
              x="100"
              y="144"
              width="3"
              height="14"
              transform="rotate(90 100 144)"
              className="element"
            />
          )}
        </g>
      </svg>
    </Wrapper>
  );
});

export default Viewer;
