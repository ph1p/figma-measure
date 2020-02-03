import { setTitleBold, createTooltipTextNode, colorString } from '../../helper';

export function addRectSection(parent, node, { fontColor = '', fontSize = 0 }) {
  const tooltipContent = createTooltipTextNode({
    fontColor,
    fontSize
  });

  const rectangle: RectangleNode = node;

  tooltipContent.characters += `Height: ${Math.floor(rectangle.height)}\n`;
  tooltipContent.characters += `Width: ${Math.floor(rectangle.width)}\n`;
  tooltipContent.characters += `Corner-Radius: ${rectangle.cornerRadius.toString()}`;

  setTitleBold(tooltipContent);

  // Fills
  const fillsTextNode = createTooltipTextNode({
    fontColor,
    fontSize
  });

  if (rectangle.fills) {
    fillsTextNode.characters += `Fills\n`;
    (rectangle.fills as any[]).map(f => {
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
