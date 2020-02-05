import { createTooltipTextNode, setTitleBold } from '../../helper';
import namePart from './parts/name';
import fillsPart from './parts/fills';

export default function addPolygon(
  parent,
  node: PolygonNode,
  { fontColor = '', fontSize = 0 }
) {
  const tooltipTextNode = createTooltipTextNode({
    fontColor,
    fontSize
  });

  tooltipTextNode.characters += `Height: ${Math.floor(node.height)}\n`;
  tooltipTextNode.characters += `Width: ${Math.floor(node.width)}`;

  if (node.rotation) {
    tooltipTextNode.characters += `\nRotation: ${Math.floor(node.rotation)}°`;
  }

  if (node.pointCount) {
    tooltipTextNode.characters += `\nPoints: ${node.pointCount}`;
  }

  setTitleBold(tooltipTextNode);

  // Add content to parent
  const name = namePart(node, { fontColor, fontSize });
  const fills = fillsPart(node, { fontColor, fontSize });

  if (name) {
    parent.appendChild(name);
  }

  parent.appendChild(tooltipTextNode);

  if (fills) {
    parent.appendChild(fills);
  }
}
