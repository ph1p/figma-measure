import React from 'react';

interface Icons {
  icon:
    | 'adjust'
    | 'alert'
    | 'align-bottom'
    | 'align-middle'
    | 'align-top'
    | 'angle'
    | 'animated-fill'
    | 'arrow-left-right'
    | 'arrow-up-down'
    | 'blend-empty'
    | 'blend'
    | 'break'
    | 'close'
    | 'comment'
    | 'component'
    | 'corner-radius'
    | 'corners'
    | 'dist-horiz-spacing'
    | 'dist-vert-spacing'
    | 'draft'
    | 'effects'
    | 'ellipses'
    | 'eyedropper'
    | 'frame'
    | 'group'
    | 'hidden'
    | 'hyperlink'
    | 'image'
    | 'import'
    | 'instance'
    | 'layout-align-bottom'
    | 'layout-align-horiz-cent'
    | 'layout-align-left'
    | 'layout-align-right'
    | 'layout-align-top'
    | 'layout-align-vert-cent'
    | 'layout-grid-columns'
    | 'layout-grid-rows'
    | 'layout-grid-uniform'
    | 'library'
    | 'link-broken'
    | 'link-connected'
    | 'list-detailed'
    | 'list'
    | 'lock-unlocked'
    | 'lock'
    | 'mask'
    | 'minus'
    | 'node-connect'
    | 'play'
    | 'plus'
    | 'recent'
    | 'reset-instance'
    | 'resize-to-fit'
    | 'resolve-filled'
    | 'resolve'
    | 'restore'
    | 'return'
    | 'search-large'
    | 'search'
    | 'share'
    | 'smiley'
    | 'star-off'
    | 'star-on'
    | 'stroke-weight'
    | 'styles'
    | 'tidy-up-grid'
    | 'tidy-up-list-horiz'
    | 'tidy-up-list-vert'
    | 'timer'
    | 'trash'
    | 'type'
    | 'vector-handles'
    | 'visible'
    | 'warning';
  color?: '' | 'blue' | 'black-3' | 'white';
  button?: boolean;
  selected?: boolean;
  onClick?: () => any;
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
