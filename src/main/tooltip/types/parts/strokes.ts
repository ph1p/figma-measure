import { createTooltipTextNode, getFillsByFillStyleId } from '../../../helper';

import { createColorNode } from './fills';

const ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
<path d="M11.5 9H3.5V7H11.5V9Z" fill="#8C8C8C"/>
</svg>`;

export default function strokes(
  node,
  parent,
  { fontColor = '', fontSize = 0 }
) {
  // Stroke
  if (node?.strokes?.length && node.strokeWeight) {
    const textNode = createTooltipTextNode({
      fontColor,
      fontSize,
    });
    textNode.x += 20;
    textNode.y += 1.5;

    textNode.characters += node.strokeWeight;

    textNode.characters += ` · ${node.strokeAlign.toLowerCase()}`;

    figma.group([figma.createNodeFromSvg(ICON), textNode], parent);

    let fills = null;

    if (node.strokeStyleId) {
      fills = getFillsByFillStyleId(node.strokeStyleId);
    }

    if (!fills) {
      fills = node.strokes.filter((s) => s.type === 'SOLID' && s.visible);
    }

    for (const fill of fills) {
      figma.group(
        [
          figma.createNodeFromSvg(ICON),
          ...createColorNode(fill, { fontColor, fontSize }),
        ],
        parent
      );
    }
  }
}
