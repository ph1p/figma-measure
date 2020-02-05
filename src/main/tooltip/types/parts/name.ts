import { createTooltipTextNode } from '../../../helper';

export default function namePart(node, { fontColor = '', fontSize = 0 }) {
  if (node.name) {
    const textNode = createTooltipTextNode({
      fontColor,
      fontSize: fontSize - 2
    });

    textNode.characters += `${node.name}`;
    textNode.setRangeFontName(0, node.name.length, {
      family: 'Inter',
      style: 'Regular'
    });
    textNode.textDecoration = 'UNDERLINE';

    return textNode;
  }

  return;
}
