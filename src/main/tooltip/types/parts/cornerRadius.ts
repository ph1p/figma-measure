import { toFixed } from '../../../../shared/helpers';
import { createTooltipTextNode } from '../../../helper';

export default function cornerRadius(
  node,
  parent,
  { fontColor = '', fontSize = 0 }
) {
  if (node?.cornerRadius) {
    const cornerRadiusIcon = figma.createNodeFromSvg(
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 10V11H6V10C6 7.79086 7.79086 6 10 6H10.6667C10.7789 6 10.8901 6.00462 11 6.01369V5.01093C10.8898 5.00368 10.7787 5 10.6667 5H10C7.23858 5 5 7.23857 5 10Z" fill="black" fill-opacity="0.8"/></svg>`
    );
    const textNode = createTooltipTextNode({
      fontColor,
      fontSize,
    });
    textNode.x += 20;
    textNode.y += 1.5;

    if (node.cornerRadius !== figma.mixed) {
      textNode.characters += `${toFixed(node.cornerRadius, 2)}`;
    } else {
      textNode.characters += `${toFixed(node.topLeftRadius, 2)} ${toFixed(
        node.topRightRadius,
        2
      )} ${toFixed(node.bottomLeftRadius, 2)} ${toFixed(
        node.bottomRightRadius,
        2
      )}`;
    }

    figma.group([cornerRadiusIcon, textNode], parent);
  }
}
