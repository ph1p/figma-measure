import { findAndReplaceNumberPattern } from '../../../../shared/helpers';
import { createTooltipTextNode } from '../../../helper';

export default function height(
  node,
  parent,
  { fontColor = '', fontSize = 0, labelPattern }
) {
  const iconNode = figma.createNodeFromSvg(
    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg"><path d="M4.84229 12.5H5.81104V8.92188H10.0767V12.5H11.0454V4.5H10.0767V8.0625H5.81104V4.5H4.84229V12.5Z" fill="black" fill-opacity="0.3"/></svg>`
  );
  const textNode = createTooltipTextNode({
    fontColor,
    fontSize,
  });
  textNode.x += 20;
  textNode.y += 1.5;
  textNode.characters += findAndReplaceNumberPattern(labelPattern, node.height);

  figma.group([iconNode, textNode], parent);
}
