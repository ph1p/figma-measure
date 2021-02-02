import { createTooltipTextNode, colorString } from '../../../helper';

export default function strokesPart(node, { fontColor = '', fontSize = 0 }) {
  // Stroke
  if (node.strokes.length) {
    const textNode = createTooltipTextNode({
      fontColor,
      fontSize
    });
    textNode.characters += `Strokes\n`;

    textNode.characters += `Weight: ${Math.floor(node.strokeWeight)}\n`;

    textNode.characters += (node.strokes as any[])
      .filter(s => s.type === 'SOLID')
      .map(s => colorString(s.color, s.opacity))
      .join('\n');

    textNode.setRangeFontName(0, 7, {
      family: 'Inter',
      style: 'Bold'
    });
    textNode.setRangeFontSize(0, 7, fontSize + 1);

    return textNode;
  }

  return;
}
