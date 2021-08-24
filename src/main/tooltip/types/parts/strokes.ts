import { createTooltipTextNode } from '../../../helper';

import { createColorNode } from './fills';

export default function strokes(
  node,
  parent,
  { fontColor = '', fontSize = 0 }
) {
  // Stroke
  if (node?.strokes?.length) {
    const iconNode = figma.createNodeFromSvg(
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
      <path d="M11.5 9H3.5V7H11.5V9Z" fill="#8C8C8C"/>
      </svg>`
    );
    const textNode = createTooltipTextNode({
      fontColor,
      fontSize,
    });
    textNode.x += 20;
    textNode.y += 1.5;

    textNode.characters += node.strokeWeight;

    figma.group([iconNode, textNode], parent);

    const fillColors = node.strokes
      .filter((s) => s.type === 'SOLID' && s.visible)
      .map((fill) => {
        const fillFrame = figma.createFrame();

        for (const colorNode of createColorNode(fill, {
          fontColor,
          fontSize,
        })) {
          fillFrame.appendChild(colorNode);
        }

        fillFrame.x += 20;
        fillFrame.resize(fillFrame.width, 16);
        return fillFrame;
      });

    if (fillColors.length > 0) {
      figma.group(fillColors, parent);
    }
  }
}
