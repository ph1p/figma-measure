import React from 'react';

interface Icons {
  icon:
    | 'return'
    | 'adjust'
    | 'angle'
    | 'break'
    | 'close'
    | 'break'
    | 'ellipses'
    | 'eyedropper'
    | 'visible'
    | 'hidden'
    | 'hyperlink'
    | 'link'
    | 'link-broken'
    | 'lock'
    | 'unlock'
    | 'minus'
    | 'plus'
    | 'play'
    | 'recent'
    | 'resolve-filled'
    | 'resolve'
    | 'search'
    | 'trash'
    | 'text';
  color?: '' | 'blue' | 'black-3' | 'white';
  button?: boolean;
  selected?: boolean;
  onClick: () => any;
  className?: string;
}

export default function Icon({
  icon = 'adjust',
  color = '',
  button = false,
  selected = false,
  className = '',
  onClick = () => {}
}: Icons) {
  return (
    <div
      onClick={onClick}
      className={`icon icon--${icon} ${className} ${
        selected ? 'icon--selected' : ''
      } ${button ? 'icon--button' : ''} ${color ? 'icon--' + color : ''}`}
    />
  );
}
