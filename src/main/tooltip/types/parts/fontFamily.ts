import { createTooltipTextNode } from '../../../helper';

export default function fontFamily(
  node,
  parent,
  { fontColor = '', fontSize = 0 }
) {
  const fontFamilyName = node?.fontName
    ? (node?.fontName as FontName).family
    : undefined;

  if (fontFamilyName) {
    const iconFrame = figma.createNodeFromSvg(
      `<svg width="16" height="16" fill="none" xmlns="https://www.w3.org/2000/svg"><path d="M8 4H3V6.5M8 4H13V6.5M8 4V13M8 13H10M8 13H6" stroke="#8C8C8C"/></svg>`
    );
    const textNode = createTooltipTextNode({
      fontColor,
      fontSize,
    });
    textNode.x += 20;
    textNode.y += 1.5;
    textNode.characters += fontFamilyName;

    figma.group([iconFrame, textNode], parent);
  }
}
