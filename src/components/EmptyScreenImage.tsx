import React, { FunctionComponent } from 'react';

export const EmptyScreenImage: FunctionComponent = () => (
  <svg
    width="65"
    height="57"
    viewBox="0 0 65 57"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      opacity="0.19"
      x="58"
      y="39"
      width="51"
      height="32"
      rx="16"
      transform="rotate(-180 58 39)"
      fill="url(#paint0_linear_3079_24876)"
    />
    <rect
      x="61.5"
      y="42.5"
      width="58"
      height="39"
      transform="rotate(-180 61.5 42.5)"
      stroke="#1745E8"
    />
    <rect x="0.5" y="0.5" width="6" height="6" fill="white" stroke="#1745E8" />
    <rect x="58.5" y="0.5" width="6" height="6" fill="white" stroke="#1745E8" />
    <rect x="0.5" y="39.5" width="6" height="6" fill="white" stroke="#1745E8" />
    <rect
      x="58.5"
      y="39.5"
      width="6"
      height="6"
      fill="white"
      stroke="#1745E8"
    />
    <g filter="url(#filter0_d_3079_24876)">
      <path
        d="M28.6462 35.7384C28.5614 35.3335 28.9949 35.0185 29.3539 35.2242L43.658 43.4221C44.022 43.6307 43.9615 44.1731 43.5606 44.2964L36.618 46.432C36.5105 46.4651 36.418 46.5349 36.3568 46.6292L32.8822 51.9817C32.6491 52.3407 32.0983 52.2377 32.0107 51.8188L28.6462 35.7384Z"
        fill="#1745E8"
      />
      <path
        d="M32.4899 51.6677L29.1449 35.6808L43.3684 43.8324L36.471 45.9541C36.2514 46.0217 36.0625 46.1643 35.9374 46.357L32.4899 51.6677Z"
        stroke="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_3079_24876"
        x="26.6357"
        y="35.1595"
        width="19.2637"
        height="21.0409"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3079_24876"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3079_24876"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_3079_24876"
        x1="99.82"
        y1="63.2424"
        x2="58"
        y2="63.2424"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#1745E8" />
        <stop offset="1" stop-color="#1745E8" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
