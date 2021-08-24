import { toFixed } from '../../../../shared/helpers';
import { createTooltipTextNode, colorString, rgbaToHex } from '../../../helper';

export const createColorNode = (fill, { fontColor = '', fontSize = 0 }) => {
  const textNode = createTooltipTextNode({
    fontColor,
    fontSize,
  });
  textNode.x += 40;
  textNode.y += 1.5;

  textNode.characters += rgbaToHex(colorString(fill.color, fill.opacity));
  if (fill.opacity !== 1) {
    textNode.characters += ` · ${toFixed(fill.opacity * 100, 2)}%`;
  }

  const colorRect = figma.createRectangle();
  colorRect.resize(8, 16);
  colorRect.x += 20;
  colorRect.topLeftRadius = 3;
  colorRect.bottomLeftRadius = 3;
  colorRect.fills = [{ ...fill, opacity: 1 }];

  const colorRectWithOpacity = figma.createRectangle();
  colorRectWithOpacity.resize(8, 16);
  colorRectWithOpacity.x += 28;
  colorRectWithOpacity.topRightRadius = 3;
  colorRectWithOpacity.bottomRightRadius = 3;
  colorRectWithOpacity.fills = [fill];

  return [colorRect, colorRectWithOpacity, textNode];
};

export default function fills(node, parent, { fontColor = '', fontSize = 0 }) {
  if (node?.fills !== figma.mixed) {
    const fillsAvailable =
      typeof node.fills !== 'undefined'
        ? node.fills.some((f) => f.type !== 'IMAGE')
        : false;

    if (fillsAvailable) {
      node.fills.forEach((fill) => {
        if (fill.type === 'SOLID') {
          const fillIcon = figma.createNodeFromSvg(
            `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00162 3.00162C8.24369 3.25204 8.47476 3.49109 8.69485 3.72005C10.8983 6.01238 12 7.29389 12 8.85191C12.0025 9.91429 11.612 10.9775 10.8284 11.788C9.26637 13.404 6.73374 13.404 5.17166 11.788C4.38812 10.9775 3.9975 9.91425 4.00001 8.85188C4.00001 7.29386 5.10181 6.01238 7.30526 3.72005C7.52537 3.49106 7.75647 3.25198 7.99857 3.00153L7.99961 3.00046L8.00005 3L8.00162 3.00162ZM5.80482 6.91125C6.30665 6.23086 7.02355 5.457 8.00005 4.4404C8.97654 5.45699 9.69341 6.23086 10.1952 6.91125C10.795 7.72446 11 8.29121 11 8.85191L11 8.85428C11.0001 8.9029 10.9992 8.95148 10.9971 9H5.00287C5.00085 8.95147 4.9999 8.90287 5.00001 8.85424V8.85188C5.00001 8.2912 5.20502 7.72447 5.80482 6.91125Z" fill="#8C8C8C"/>
      </svg>`
          );

          figma.group(
            [fillIcon, ...createColorNode(fill, { fontColor, fontSize })],
            parent
          );
        }
      });
    }
  }
}
