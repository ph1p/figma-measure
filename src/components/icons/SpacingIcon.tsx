import React, { FunctionComponent } from 'react';

export const SpacingIcon: FunctionComponent<{ remove?: boolean }> = (props: { remove?: boolean }) => (
  <svg
    width="30"
    height="29"
    viewBox="0 0 30 29"
    fill="none"
    xmlns="https://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="29" height="28" rx="9.5" stroke="#E8E8E8" />
    {!props.remove && (
      <>
        <line x1="10" y1="14.5" x2="20" y2="14.5" stroke="#1745E8" />
        <line
          x1="12"
          y1="14.5"
          x2="18"
          y2="14.5"
          stroke="#1745E8"
          strokeWidth="3"
        />
      </>
    )}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25 7.5C25 7.22386 24.7761 7 24.5 7H23.5C22.6716 7 22 7.67157 22 8.5V20.5C22 21.3284 22.6716 22 23.5 22H24.5C24.7761 22 25 21.7761 25 21.5C25 21.2239 24.7761 21 24.5 21H24C23.4477 21 23 20.5523 23 20V9C23 8.44772 23.4477 8 24 8H24.5C24.7761 8 25 7.77614 25 7.5Z"
      fill="#000"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 7.5C5 7.22386 5.22386 7 5.5 7H6.5C7.32843 7 8 7.67157 8 8.5V20.5C8 21.3284 7.32843 22 6.5 22H5.5C5.22386 22 5 21.7761 5 21.5C5 21.2239 5.22386 21 5.5 21H6C6.55228 21 7 20.5523 7 20V9C7 8.44772 6.55228 8 6 8H5.5C5.22386 8 5 7.77614 5 7.5Z"
      fill="#000"
    />
  </svg>
);
