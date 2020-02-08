import { createTooltipTextNode, colorString } from '../../../helper';

export default function fillsPart(node, { fontColor = '', fontSize = 0 }) {
  const fillsAvailable = typeof node.fills !== 'undefined' ? node.fills.some(f => f.type !== 'IMAGE') : false;

  if (fillsAvailable) {
    const textNode = createTooltipTextNode({
      fontColor,
      fontSize
    });

    textNode.characters += `Fill / Color\n`;

    (node.fills as any[]).map(f => {
      if (f.type === 'SOLID') {
        textNode.characters += colorString(f.color, f.opacity);
      }
    });

    textNode.setRangeFontName(0, 12, {
      family: 'Inter',
      style: 'Bold'
    });
    textNode.setRangeFontSize(0, 12, fontSize + 1);

    return textNode;
  }

  return;
}
