import { SetTooltipOptions, TooltipSettings } from '../../../shared/interfaces';

import { cornerRadius } from './parts/cornerRadius';
import { effects } from './parts/effects';
import { fills } from './parts/fills';
import { fontName } from './parts/font-name';
import { height } from './parts/height';
import { name } from './parts/name';
import { opacity } from './parts/opacity';
import { pointCount } from './parts/point-count';
import { strokes } from './parts/strokes';
import { variantProperties } from './parts/variant-properties';
import { width } from './parts/width';

export const addNode = async (
  parent: SceneNode,
  node: SceneNode,
  settings: SetTooltipOptions,
) => {
  const flags: TooltipSettings = settings.flags;
  // Add content to parent
  if (flags.name) {
    name(node, parent, settings);
  }
  if (flags.variants) {
    variantProperties(node, parent, settings);
  }
  if (flags.width) {
    width(node, parent, settings);
  }
  if (flags.height) {
    height(node, parent, settings);
  }
  if (flags.color) {
    fills(node, parent, settings);
  }
  if (flags.cornerRadius) {
    cornerRadius(node, parent, settings);
  }
  if (flags.stroke) {
    await strokes(node, parent, settings);
  }
  if (flags.opacity) {
    opacity(node, parent, settings);
  }
  if (flags.fontName && node.type === 'TEXT') {
    await fontName(node, parent, flags.fontSize, settings.fontPattern);
  }
  if (flags.points) {
    pointCount(node, parent, settings);
  }
  if (flags.effects) {
    await effects(node, parent, settings);
  }
};
