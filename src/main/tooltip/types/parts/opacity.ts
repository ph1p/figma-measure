import { toFixed } from '../../../../shared/helpers';
import { createTooltipTextNode } from '../../../helper';

export const opacity = (node, parent, { fontColor = '', fontSize = 0 }) => {
  if (node?.opacity !== 0) {
    const iconFrame = figma.createNodeFromSvg(
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M9 3H7V4H9V3ZM11.5 12H12V11.5H13V12V13H12H11.5V12ZM4 7V9H3V7H4ZM12 4.5V4H11.5V3H12H13V4V4.5H12ZM12 7V9H13V7H12ZM4 4.5V4H4.5V3H4H3V4V4.5H4ZM3 12V11.5H4V12H4.5V13H4H3V12ZM9 12H7V13H9V12Z" fill="#8C8C8C"/>
    </svg>`,
    );
    const textNode = createTooltipTextNode({
      fontColor,
      fontSize,
    });
    textNode.x += 20;
    textNode.y += 1.5;
    textNode.characters += `${toFixed(node.opacity * 100, 2)}%`;

    const g = figma.group([iconFrame, textNode], parent);
    g.expanded = false;
  }
};
