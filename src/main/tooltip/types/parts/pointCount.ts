import { createTooltipTextNode } from '../../../helper';

export default function pointCount(
  node,
  parent,
  { fontColor = '', fontSize = 0 }
) {
  if (node?.pointCount) {
    const iconNode = figma.createNodeFromSvg(
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="4" fill="#8C8C8C"/>
    </svg>`
    );
    const textNode = createTooltipTextNode({
      fontColor,
      fontSize,
    });
    textNode.x += 20;
    textNode.y += 1.5;
    textNode.characters += `${node.pointCount}`;

    figma.group([iconNode, textNode], parent);
  }
}
