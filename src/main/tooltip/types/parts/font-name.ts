import { getFontNameData } from '../../../../shared/helpers';
import { createTooltipTextNode, solidColor } from '../../../helper';

export default async function fontName(node, parent, showFontSize) {
  const fontFamilyName = node?.fontName;

  if (fontFamilyName) {
    const fontData = await getFontNameData(node);

    const iconFrame = figma.createNodeFromSvg(
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
      <path d="M13.1797 9.69922H12.0625V9.625C12.0703 8.17578 12.5 7.73438 13.2266 7.28906C13.6914 7 14.0547 6.58984 14.0547 6.00781C14.0547 5.31641 13.5156 4.875 12.8516 4.875C12.2539 4.875 11.6641 5.23828 11.6172 6.06641H10.4297C10.4805 4.66016 11.5352 3.89062 12.8516 3.89062C14.2852 3.89062 15.2461 4.75 15.2461 6.01953C15.2461 6.89844 14.8164 7.49219 14.1172 7.91406C13.4531 8.32422 13.1953 8.72656 13.1797 9.625V9.69922Z" fill="#8C8C8C"/>
      <path d="M13.4336 11.293C13.4336 11.7266 13.0781 12.0742 12.6523 12.0742C12.2227 12.0742 11.8711 11.7266 11.8711 11.293C11.8711 10.8672 12.2227 10.5156 12.6523 10.5156C13.0781 10.5156 13.4336 10.8672 13.4336 11.293Z" fill="#8C8C8C"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12L5.11111 4H6.19622L9.30733 12H8.23438L7.4566 10L3.85073 10L3.07296 12H2ZM5.65367 5.36389L7.06771 9L4.23962 9L5.65367 5.36389Z" fill="#8C8C8C"/>
      </svg>`
    );

    const textNode = createTooltipTextNode({
      fontColor: '#999999',
      fontSize: 10,
    });

    textNode.x += 20;
    textNode.y += 1.5;

    const fontNamesRanges = [];
    let start = 0;

    fontData.forEach((font, i) => {
      let text = `${font.family}\n`;
      text += `${font.style.join(', ')}`;
      if (showFontSize) {
        text += `\nSizes: ${font.fontSize || font.fontSize.join(', ')}`;
      }
      text += `${i === fontData.length - 1 ? '' : '\n'}`;

      textNode.characters += text;

      fontNamesRanges.push({
        from: start,
        to: start + font.family.length,
      });

      start += text.length;
    });

    for (const range of fontNamesRanges) {
      textNode.setRangeFontSize(range.from, range.to, 11);
      textNode.setRangeFills(range.from, range.to, [solidColor(0, 0, 0)]);
    }

    figma.group([iconFrame, textNode], parent);
  }
}
