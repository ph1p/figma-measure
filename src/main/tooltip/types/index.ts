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

export default function addNode(
  parent,
  node: RectangleNode | TextNode | PolygonNode,
  settings
) {
  // Add content to parent
  widthPart(node, parent, settings);
  heightPart(node, parent, settings);
  fillsPart(node, parent, settings);
  cornerRadiusPart(node, parent, settings);
  strokesPart(node, parent, settings);
  opacityPart(node, parent, settings);
  fontFamilyPart(node, parent, settings);
  fontStylePart(node, parent, settings);
  fontSizePart(node, parent, settings);
  pointCountPart(node, parent, settings);
}
