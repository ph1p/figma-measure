import { setTitleBold, createTooltipTextNode, colorString } from '../../helper';

export function addTextSection(parent, node, { fontColor = '', fontSize = 0 }) {
  const fontFamily = (node.fontName as FontName).family;
  const fontStyle = (node.fontName as FontName).style;

  const tooltipContent = createTooltipTextNode({
    fontColor,
    fontSize
  });

  tooltipContent.characters += `Opacity: ${node.opacity.toFixed(2)}\n`;

  // Font
  tooltipContent.characters += `Font-Size: ${node.fontSize.toString()}\n`;
  tooltipContent.characters += `Font-Family: ${fontFamily}\n`;
  tooltipContent.characters += `Font-Style: ${fontStyle}`;

  setTitleBold(tooltipContent);

  // Fills
  const fillsTextNode = createTooltipTextNode({
    fontColor,
    fontSize
  });

  if (node.fills) {
    fillsTextNode.characters += `Fills\n`;
    (node.fills as any[]).map(f => {
      if (f.type === 'SOLID') {
        fillsTextNode.characters += colorString(f.color, f.opacity);
      }
    });
  }

  fillsTextNode.setRangeFontName(0, 5, {
    family: 'Inter',
    style: 'Bold'
  });

  parent.appendChild(tooltipContent);
  parent.appendChild(fillsTextNode);
}
