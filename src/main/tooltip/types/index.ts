import strokesPart from './parts/strokes';
import fillsPart from './parts/fills';
import widthPart from './parts/width';
import heightPart from './parts/height';
import cornerRadiusPart from './parts/corner-radius';
import opacityPart from './parts/opacity';
import fontFamilyPart from './parts/font-family';
import fontSizePart from './parts/font-size';
import fontStylePart from './parts/font-style';
import pointCountPart from './parts/points';
import { SetTooltipOptions, TooltipSettings } from '../../../shared/interfaces';

export default function addNode(
  parent: SceneNode,
  node: SceneNode,
  settings: SetTooltipOptions
) {
  const flags: TooltipSettings = settings.flags;
  // Add content to parent
  if (flags.width) {
    widthPart(node, parent, settings);
  }
  if (flags.height) {
    heightPart(node, parent, settings);
  }
  if (flags.color) {
    fillsPart(node, parent, settings);
  }
  if (flags.cornerRadius) {
    cornerRadiusPart(node, parent, settings);
  }
  if (flags.stroke) {
    strokesPart(node, parent, settings);
  }
  if (flags.opacity) {
    opacityPart(node, parent, settings);
  }
  if (flags.fontFamily) {
    fontFamilyPart(node, parent, settings);
  }
  if (flags.fontStyle) {
    fontStylePart(node, parent, settings);
  }
  if (flags.fontSize) {
    fontSizePart(node, parent, settings);
  }
  if (flags.points) {
    pointCountPart(node, parent, settings);
  }
}
