import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { useStore } from '../store';

interface Props {
  labels: boolean;
  color: string;
}

const Viewer: FunctionComponent<Props> = observer((props) => {
  const store = useStore();

  const clickTooltip = (e) => {
    if (store.surrounding.tooltip === e.currentTarget.dataset.direction) {
      store.setSurrounding({
        ...store.surrounding,
        tooltip: '',
      });
    } else {
      store.setSurrounding({
        ...store.surrounding,
        tooltip: e.currentTarget.dataset.direction,
      });
    }
  };

  const clickCorner = (e) => {
    let [first, second] = e.currentTarget.dataset.direction.split('-');

    first += 'Bar';
    second += 'Bar';

    store.setSurrounding({
      ...store.surrounding,
      [first]: !store.surrounding[first],
      [second]: !store.surrounding[second],
    });
  };

  return (
    <svg
      width="184"
      height="184"
      viewBox="0 0 184 184"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g data-direction="left-bottom" onClick={clickCorner}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M44 141.022L44 137.5C44 135.015 41.9853 133 39.5 133C37.0147 133 35 135.015 35 137.5L35 142.522C35 146.665 38.3579 150.022 42.5 150.022L47.3413 150.022C49.8266 150.022 51.8413 148.008 51.8413 145.522C51.8413 143.037 49.8266 141.022 47.3413 141.022L44 141.022Z"
          fill={
            store.surrounding.leftBar && store.surrounding.bottomBar
              ? '#E8ECFD'
              : 'transparent'
          }
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M39.4092 142.522C39.4092 143.903 40.5285 145.022 41.9092 145.022L47.4092 145.022L47.4092 146.022L41.9092 146.022C39.9762 146.022 38.4092 144.455 38.4092 142.522L38.4092 137.022L39.4092 137.022L39.4092 142.522Z"
          fill={props.color}
        />
      </g>
      <g data-direction="right-bottom" onClick={clickCorner}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M139.841 140.932L136.319 140.932C133.834 140.932 131.819 142.947 131.819 145.432C131.819 147.917 133.834 149.932 136.319 149.932L141.341 149.932C145.483 149.932 148.841 146.574 148.841 142.432L148.841 137.591C148.841 135.105 146.827 133.091 144.341 133.091C141.856 133.091 139.841 135.105 139.841 137.591L139.841 140.932Z"
          fill={
            store.surrounding.rightBar && store.surrounding.bottomBar
              ? '#E8ECFD'
              : 'transparent'
          }
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M141.341 145.522C142.722 145.522 143.841 144.403 143.841 143.022L143.841 137.522L144.841 137.522L144.841 143.022C144.841 144.955 143.274 146.522 141.341 146.522L135.841 146.522L135.841 145.522L141.341 145.522Z"
          fill={props.color}
        />
      </g>
      <g data-direction="top-right" onClick={clickCorner}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M139.841 44.9094L139.841 48.4319C139.841 50.9172 141.856 52.9319 144.341 52.9319C146.827 52.9319 148.841 50.9172 148.841 48.4319L148.841 43.4094C148.841 39.2673 145.483 35.9094 141.341 35.9094L136.5 35.9094C134.015 35.9094 132 37.9241 132 40.4094C132 42.8947 134.015 44.9094 136.5 44.9094L139.841 44.9094Z"
          fill={
            store.surrounding.rightBar && store.surrounding.topBar
              ? '#E8ECFD'
              : 'transparent'
          }
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M144.432 43.4094C144.432 42.0287 143.313 40.9094 141.932 40.9094L136.432 40.9094L136.432 39.9094L141.932 39.9094C143.865 39.9094 145.432 41.4764 145.432 43.4094L145.432 48.9094L144.432 48.9094L144.432 43.4094Z"
          fill={props.color}
        />
      </g>
      <g data-direction="top-left" onClick={clickCorner}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M44 45L47.5225 45C50.0078 45 52.0225 42.9853 52.0225 40.5C52.0225 38.0147 50.0078 36 47.5225 36L42.5 36C38.3579 36 35 39.3579 35 43.5L35 48.3413C35 50.8266 37.0147 52.8413 39.5 52.8413C41.9853 52.8413 44 50.8266 44 48.3413L44 45Z"
          fill={
            store.surrounding.leftBar && store.surrounding.topBar
              ? '#E8ECFD'
              : 'transparent'
          }
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.5 40.4094C41.1193 40.4094 40 41.5287 40 42.9094L40 48.4094L39 48.4094L39 42.9094C39 40.9764 40.567 39.4094 42.5 39.4094L48 39.4094L48 40.4094L42.5 40.4094Z"
          fill={props.color}
        />
      </g>
      <g
        className="center"
        onClick={() =>
          store.setSurrounding({
            ...store.surrounding,
            center: !store.surrounding.center,
          })
        }
      >
        {store.fill === 'fill' && (
          <rect
            opacity="0.3"
            x="58"
            y="58"
            width="69"
            height="69"
            rx="8.5"
            fill={props.color}
            stroke={props.color}
          />
        )}

        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M54 66.5C54 59.5964 59.5964 54 66.5 54H118.5C125.404 54 131 59.5964 131 66.5V118.5C131 125.404 125.404 131 118.5 131H66.5C59.5964 131 54 125.404 54 118.5V66.5ZM67.5 62C64.4624 62 62 64.4624 62 67.5V117.5C62 120.538 64.4624 123 67.5 123H117.5C120.538 123 123 120.538 123 117.5V67.5C123 64.4624 120.538 62 117.5 62H67.5Z"
          fill={store.surrounding.center ? '#E8ECFD' : 'transparent'}
        />
        <rect
          x="58"
          y="58"
          width="69"
          height="69"
          rx="8.5"
          stroke={props.color}
          strokeDasharray={store.fill === 'dashed' ? '3 2' : '0'}
        />
      </g>
      <g
        className="veritical-middle-bar"
        onClick={() =>
          store.setSurrounding({
            ...store.surrounding,
            verticalBar: !store.surrounding.verticalBar,
          })
        }
      >
        <rect
          x="98"
          y="113"
          width="11"
          height="43"
          rx="5"
          transform="rotate(-180 98 113)"
          fill={store.surrounding.verticalBar ? '#E8ECFD' : 'transparent'}
        />
        <path
          d="M90 74V75L92 75L92 86H93L93 75L95 75V74H90Z"
          fill={props.color}
        />
        <path
          d="M90 108V109H95V108H93L93 97H92L92 108H90Z"
          fill={props.color}
        />
      </g>
      <g
        className="horizontal-middle-bar"
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
          fill={store.surrounding.horizontalBar ? '#E8ECFD' : 'transparent'}
        />

        {props.labels && (
          <rect
            x="151"
            y="39"
            width="3"
            height="11"
            transform="rotate(90 98.9961 38)"
            fill={props.color}
          />
        )}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M76 94H75V92V91V89H76L76 91L109 91V89H110V91V92V94H109V92L76 92L76 94Z"
          fill={props.color}
        />
      </g>
      <g
        className="left-bar"
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
          height="60"
          rx="5"
          fill={store.surrounding.leftBar ? '#E8ECFD' : 'transparent'}
        />

        <path
          d="M42 69H40L40 115H42V116H37L37 115L39 115L39 69L37 69L37 68L42 68V69Z"
          fill={props.color}
        />
        {props.labels && (
          <rect x="38" y="85" width="3" height="14" fill={props.color} />
        )}
      </g>
      <g
        className="right-bar"
        onClick={() =>
          store.setSurrounding({
            ...store.surrounding,
            rightBar: !store.surrounding.rightBar,
          })
        }
      >
        <rect
          x="139"
          y="62"
          width="11"
          height="60"
          rx="5"
          fill={store.surrounding.rightBar ? '#E8ECFD' : 'transparent'}
        />

        <path
          d="M147 69H145L145 115H147V116H142L142 115L144 115L144 69L142 69L142 68L147 68V69Z"
          fill={props.color}
        />
        {props.labels && (
          <rect x="143" y="85" width="3" height="14" fill={props.color} />
        )}
      </g>
      <g
        className="top-bar"
        onClick={() =>
          store.setSurrounding({
            ...store.surrounding,
            topBar: !store.surrounding.topBar,
          })
        }
      >
        <rect
          x="121.996"
          y="34"
          width="11"
          height="60"
          rx="5"
          transform="rotate(90 121.996 34)"
          fill={store.surrounding.topBar ? '#E8ECFD' : 'transparent'}
        />

        <path
          d="M114.996 42.0001L114.996 40.0001L68.9961 40.0001L68.9961 42.0001L67.9961 42.0001L67.9961 37.0001L68.9961 37.0001L68.9961 39.0001L114.996 39.0001L114.996 37.0001L115.996 37.0001L115.996 42.0001L114.996 42.0001Z"
          fill={props.color}
        />
        {props.labels && (
          <rect
            x="98.9961"
            y="38"
            width="3"
            height="14"
            transform="rotate(90 98.9961 38)"
            fill={props.color}
          />
        )}
      </g>
      <g
        className="bottom-bar"
        onClick={() =>
          store.setSurrounding({
            ...store.surrounding,
            bottomBar: !store.surrounding.bottomBar,
          })
        }
      >
        <rect
          x="121.996"
          y="139"
          width="11"
          height="60"
          rx="5"
          transform="rotate(90 121.996 139)"
          fill={store.surrounding.bottomBar ? '#E8ECFD' : 'transparent'}
        />

        <path
          d="M114.996 147L114.996 145L68.9961 145L68.9961 147L67.9961 147L67.9961 142L68.9961 142L68.9961 144L114.996 144L114.996 142L115.996 142L115.996 147L114.996 147Z"
          fill={props.color}
        />
        {props.labels && (
          <rect
            x="98.9961"
            y="143"
            width="3"
            height="14"
            transform="rotate(90 98.9961 143)"
            fill={props.color}
          />
        )}
      </g>
      <g className="tooltip">
        <path
          data-direction="right"
          onClick={clickTooltip}
          d="M164.065 87.5434L161.296 90.29C160.901 90.6812 160.901 91.3188 161.296 91.71L164.065 94.4566C164.254 94.6444 164.361 94.9 164.361 95.1666V98C164.361 99.6569 165.704 101 167.361 101L180.58 101C182.237 101 183.58 99.6568 183.58 98L183.58 84C183.58 82.3431 182.237 81 180.58 81L167.361 81C165.704 81 164.361 82.3431 164.361 84V86.8334C164.361 87.1 164.254 87.3556 164.065 87.5434Z"
          fill={store.surrounding.tooltip === 'right' ? props.color : '#E8ECFD'}
        />
        <path
          data-direction="bottom"
          onClick={clickTooltip}
          d="M95.1666 164.355L92.4199 161.586C92.0288 161.191 91.3912 161.191 91 161.586L88.2533 164.355C88.0656 164.544 87.81 164.651 87.5434 164.651H84.71C83.0531 164.651 81.71 165.994 81.71 167.651L81.71 180.87C81.71 182.527 83.0531 183.87 84.71 183.87L98.71 183.87C100.367 183.87 101.71 182.527 101.71 180.87L101.71 167.651C101.71 165.994 100.367 164.651 98.71 164.651H95.8766C95.6099 164.651 95.3544 164.544 95.1666 164.355Z"
          fill={
            store.surrounding.tooltip === 'bottom' ? props.color : '#E8ECFD'
          }
        />
        <path
          data-direction="left"
          onClick={clickTooltip}
          d="M19.5153 94.4566L22.2843 91.71C22.6786 91.3188 22.6786 90.6812 22.2843 90.29L19.5153 87.5434C19.326 87.3556 19.2195 87.1 19.2195 86.8334V84C19.2195 82.3431 17.8764 81 16.2195 81L3 81C1.34315 81 -1.44847e-07 82.3432 0 84L1.22392e-06 98C1.36877e-06 99.6569 1.34314 101 3 101L16.2195 101C17.8764 101 19.2195 99.6569 19.2195 98V95.1666C19.2195 94.9 19.326 94.6444 19.5153 94.4566Z"
          fill={store.surrounding.tooltip === 'left' ? props.color : '#E8ECFD'}
        />
        <path
          data-direction="top"
          onClick={clickTooltip}
          d="M88.5434 19.5153L91.29 22.2843C91.6812 22.6786 92.3188 22.6786 92.71 22.2843L95.4566 19.5153C95.6444 19.326 95.9 19.2195 96.1666 19.2195H99C100.657 19.2195 102 17.8764 102 16.2195L102 3C102 1.34315 100.657 -1.44847e-07 99 0L85 1.22392e-06C83.3431 1.36877e-06 82 1.34315 82 3L82 16.2195C82 17.8764 83.3431 19.2195 85 19.2195H87.8334C88.1 19.2195 88.3556 19.326 88.5434 19.5153Z"
          fill={store.surrounding.tooltip === 'top' ? props.color : '#E8ECFD'}
        />
      </g>
    </svg>
  );
});

export default Viewer;
