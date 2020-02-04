import { setTitleBold, createTooltipTextNode } from '../../helper';
import strokesPart from './parts/strokes';
import fillsPart from './parts/fills';
import namePart from './parts/name';

export function addRectSection(parent, node, { fontColor = '', fontSize = 0 }) {
  const rectangle: RectangleNode = node;

  const tooltipTextNode = createTooltipTextNode({
    fontColor,
    fontSize
  });

  tooltipTextNode.characters += `Height: ${Math.floor(rectangle.height)}\n`;
  tooltipTextNode.characters += `Width: ${Math.floor(rectangle.width)}`;

  if (rectangle.cornerRadius) {
    tooltipTextNode.characters += `\nCorner-Radius: ${rectangle.cornerRadius.toString()}`;
  }

  setTitleBold(tooltipTextNode);

  // Add content to parent
  const name = namePart(node, { fontColor, fontSize });
  const strokes = strokesPart(node, { fontColor, fontSize });
  const fills = fillsPart(node, { fontColor, fontSize });

  if (name) {
    parent.appendChild(name);
  }

  parent.appendChild(tooltipTextNode);

  if (strokes) {
    parent.appendChild(strokes);
  }

  if (fills) {
    parent.appendChild(fills);
  }
}
