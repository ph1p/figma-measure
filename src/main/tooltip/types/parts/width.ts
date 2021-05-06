import { findAndReplaceNumberPattern } from '../../../../shared/helpers';
import { createTooltipTextNode } from '../../../helper';

export default function width(
  node: SceneNode,
  parent: SceneNode,
  { fontColor = '', fontSize = 0, labelPattern }
): void {
  const iconNode = figma.createNodeFromSvg(
    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
    <path d="M5.146 12.5H6.146L7.91162 6.125H7.97412L9.73975 12.5H10.7397L12.9272 4.5H11.9429L10.271 11.0156H10.1929L8.48975 4.5H7.396L5.69287 11.0156H5.61475L3.94287 4.5H2.9585L5.146 12.5Z" fill="black" fill-opacity="0.3"/>
    </svg>`
  );
  const textNode = createTooltipTextNode({
    fontColor,
    fontSize,
  });
  textNode.x += 20;
  textNode.y += 1.5;
  textNode.characters += findAndReplaceNumberPattern(labelPattern, node.width);

  figma.group([iconNode, textNode], parent);
}
