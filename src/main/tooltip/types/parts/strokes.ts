import { toFixed } from '../../../../shared/helpers';
import {
  createTooltipTextNode,
  getFillsByFillStyleId,
  solidColor,
} from '../../../helper';

import { createColorNode } from './fills';

const ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
<path d="M11.5 9H3.5V7H11.5V9Z" fill="#8C8C8C"/>
</svg>`;

export const strokes = async (
  node,
  parent,
  { fontColor = '', fontSize = 0 },
) => {
  const strokes = [
    node.strokeTopWeight,
    node.strokeBottomWeight,
    node.strokeLeftWeight,
    node.strokeRightWeight,
  ];
  // Stroke
  if (node?.strokes?.length && strokes.some(Boolean)) {
    const textNode = createTooltipTextNode({
      fontColor,
      fontSize,
    });
    textNode.x += 20;
    textNode.y += 1.5;

    if (strokes.every((s) => s === node.strokeWeight)) {
      textNode.characters += `all: ${toFixed(node.strokeWeight, 2)} · `;
    } else {
      if (node.strokeTopWeight) {
        textNode.characters += `top: ${toFixed(node.strokeTopWeight, 2)} · `;
      }
      if (node.strokeBottomWeight) {
        textNode.characters += `bottom: ${toFixed(
          node.strokeBottomWeight,
          2,
        )} · `;
      }
      if (node.strokeLeftWeight) {
        textNode.characters += `left: ${toFixed(node.strokeLeftWeight, 2)} · `;
      }
      if (node.strokeRightWeight) {
        textNode.characters += `right: ${toFixed(
          node.strokeRightWeight,
          2,
        )} · `;
      }
    }

    textNode.characters += `align: ${node.strokeAlign.toLowerCase()}`;

    let textPosition = 0;
    for (const characters of textNode.characters.split(' · ')) {
      const [label, size] = characters.split(': ');
      textNode.setRangeFontSize(
        textPosition,
        textPosition + label.length + 2,
        fontSize - 1,
      );
      textNode.setRangeFills(textPosition, textPosition + label.length + 2, [
        solidColor(153, 153, 153),
      ]);
      textNode.setRangeFontSize(
        textPosition + characters.length - size.length,
        textPosition + characters.length,
        fontSize,
      );
      textPosition += characters.length + 3;
    }

    const gr = figma.group([figma.createNodeFromSvg(ICON), textNode], parent);
    gr.expanded = false;

    let fills = null;

    if (node.strokeStyleId) {
      fills = await getFillsByFillStyleId(node.strokeStyleId);
    }

    if (!fills) {
      fills = node.strokes.filter((s) => s.type === 'SOLID' && s.visible);
    }

    for (const fill of fills) {
      const g = figma.group(
        [
          figma.createNodeFromSvg(ICON),
          ...createColorNode(fill, { fontColor, fontSize }),
        ],
        parent,
      );
      g.expanded = false;
    }
  }
};
