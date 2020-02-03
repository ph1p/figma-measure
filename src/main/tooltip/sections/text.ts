import { setTitleBold, createTooltipTextNode, colorString } from '../../helper';
import namePart from './parts/name';
import fillsPart from './parts/fills';

export function addTextSection(parent, node, { fontColor = '', fontSize = 0 }) {
  const fontFamily = (node.fontName as FontName).family;
  const fontStyle = (node.fontName as FontName).style;

  const tooltipTextNode = createTooltipTextNode({
    fontColor,
    fontSize
  });

  tooltipTextNode.characters += `Opacity: ${node.opacity.toFixed(2)}\n`;

  // Font
  tooltipTextNode.characters += `Font-Size: ${node.fontSize.toString()}\n`;
  tooltipTextNode.characters += `Font-Family: ${fontFamily}\n`;
  tooltipTextNode.characters += `Font-Style: ${fontStyle}`;

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
