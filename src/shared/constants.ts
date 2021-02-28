import { TooltipSettings } from './types';

export const VERSION = 1;

export const STORAGE_KEY = '__figma_mobx_sync__';

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
  paddingTopBottom: 12,
  paddingLeftRight: 10,
  backgroundColor: '#ffffff',
  fontColor: '#000000',
  strokeColor: '#d0d0d0',
  strokeWidth: 0,
  fontSize: 11,
  cornerRadius: 7
};
