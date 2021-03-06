import { SetTooltipOptions, TooltipSettings } from '../../../shared/interfaces';

import cornerRadius from './parts/cornerRadius';
import fills from './parts/fills';
import fontFamily from './parts/fontFamily';
import fontSize from './parts/fontSize';
import fontStyle from './parts/fontStyle';
import height from './parts/height';
import opacity from './parts/opacity';
import pointCount from './parts/pointCount';
import strokes from './parts/strokes';
import width from './parts/width';


export default function addNode(
  parent: SceneNode,
  node: SceneNode,
  settings: SetTooltipOptions
) {
  const flags: TooltipSettings = settings.flags;
  // Add content to parent
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
    strokes(node, parent, settings);
  }
  if (flags.opacity) {
    opacity(node, parent, settings);
  }
  if (flags.fontFamily) {
    fontFamily(node, parent, settings);
  }
  if (flags.fontStyle) {
    fontStyle(node, parent, settings);
  }
  if (flags.fontSize) {
    fontSize(node, parent, settings);
  }
  if (flags.points) {
    pointCount(node, parent, settings);
  }
}
