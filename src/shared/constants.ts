import { TooltipSettings } from './types';

export const TOOLTIP_DIRECTIONS = [
  // area, horizontal, vertical
  ['LEFT', 'TOP'],
  ['CENTER', 'TOP'],
  ['RIGHT', 'TOP'],
  ['LEFT', 'CENTER'],
  ['CENTER', 'CENTER'],
  ['RIGHT', 'CENTER'],
  ['LEFT', 'BOTTOM'],
  ['CENTER', 'BOTTOM'],
  ['RIGHT', 'BOTTOM']
];

export const TOOLTIP_DEFAULT_SETTINGS: TooltipSettings = {
  distance: 6,
  padding: 12,
  backgroundColor: '#ffffff',
  fontColor: '#000000',
  strokeColor: '#d0d0d0',
  strokeWidth: 1,
  fontSize: 12,
  cornerRadius: 3
};
