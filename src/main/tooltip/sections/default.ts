import { createTooltipTextNode } from '../../helper';

export function addDefaultSection(
  parent,
  node,
  { fontColor = '', fontSize = 0 }
) {
  const tooltipContent = createTooltipTextNode({
    fontColor,
    fontSize
  });

  tooltipContent.characters += `Height: ${Math.floor(node.height)}\n`;
  tooltipContent.characters += `Width: ${Math.floor(node.width)}\n`;

  // Fills
  const fillsTextNode = createTooltipTextNode({
    fontColor,
    fontSize
  });

  parent.appendChild(fillsTextNode);
}
