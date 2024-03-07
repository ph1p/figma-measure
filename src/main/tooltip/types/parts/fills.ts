import { toFixed } from '../../../../shared/helpers';
import {
  createTooltipTextNode,
  getFontFillsAndStyles,
  colorString,
  rgbaToHex,
  getFillsByFillStyleId,
  solidColor,
} from '../../../helper';

const ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M8.00162 3.00162C8.24369 3.25204 8.47476 3.49109 8.69485 3.72005C10.8983 6.01238 12 7.29389 12 8.85191C12.0025 9.91429 11.612 10.9775 10.8284 11.788C9.26637 13.404 6.73374 13.404 5.17166 11.788C4.38812 10.9775 3.9975 9.91425 4.00001 8.85188C4.00001 7.29386 5.10181 6.01238 7.30526 3.72005C7.52537 3.49106 7.75647 3.25198 7.99857 3.00153L7.99961 3.00046L8.00005 3L8.00162 3.00162ZM5.80482 6.91125C6.30665 6.23086 7.02355 5.457 8.00005 4.4404C8.97654 5.45699 9.69341 6.23086 10.1952 6.91125C10.795 7.72446 11 8.29121 11 8.85191L11 8.85428C11.0001 8.9029 10.9992 8.95148 10.9971 9H5.00287C5.00085 8.95147 4.9999 8.90287 5.00001 8.85424V8.85188C5.00001 8.2912 5.20502 7.72447 5.80482 6.91125Z" fill="#8C8C8C"/>
</svg>`;

const fillTypeToName = (type: string) =>
  ({
    GRADIENT_LINEAR: 'Linear',
    GRADIENT_RADIAL: 'Radial',
    GRADIENT_ANGULAR: 'Angular',
    GRADIENT_DIAMOND: 'Diamond',
    IMAGE: 'Image',
  })[type] || '';

export const createColorNode = (fill, { fontColor = '', fontSize = 0 }) => {
  const elements = [];
  let name = '';
  let styleId = '';

  // if has name or id
  if (fill.styleId || fill.name) {
    name = fill.name;
    styleId = fill.styleId;

    delete fill.styleId;
    delete fill.name;
  }

  const textNode = createTooltipTextNode({
    fontColor,
    fontSize,
  });
  textNode.x += 40;
  textNode.y += 1.5;

  if (!name) {
    name = fillTypeToName(fill.type);
  }

  if (fill.type === 'SOLID') {
    textNode.characters += `${rgbaToHex(
      colorString(fill.color, fill.opacity),
    )} ${name ? '\n' : ''}`;
  }

  if (name) {
    const start = textNode.characters.length;
    textNode.characters += `${name}`;

    if (fill.type === 'SOLID') {
      textNode.setRangeFontSize(start, textNode.characters.length, 10);
      textNode.setRangeFills(start, textNode.characters.length, [
        solidColor(153, 153, 153),
      ]);
    }
  }

  if (fill.opacity !== 1) {
    textNode.characters += ` · ${toFixed(fill.opacity * 100, 2)}%`;

    const colorRect = figma.createRectangle();
    colorRect.resize(8, 16);
    colorRect.x += 20;
    colorRect.topLeftRadius = 3;
    colorRect.bottomLeftRadius = 3;
    colorRect.fills = [{ ...fill, opacity: 1 }];
    elements.push(colorRect);

    const colorRectWithOpacity = figma.createRectangle();
    colorRectWithOpacity.resize(8, 16);
    colorRectWithOpacity.x += 28;
    colorRectWithOpacity.topRightRadius = 3;
    colorRectWithOpacity.bottomRightRadius = 3;
    colorRectWithOpacity.fills = [fill];
    elements.push(colorRectWithOpacity);
  } else {
    const styleRect = figma.createRectangle();
    styleRect.resize(16, 16);
    styleRect.x += 20;
    styleRect.cornerRadius = 3;
    if (styleId) {
      styleRect.setFillStyleIdAsync(styleId);
    } else {
      styleRect.fills = [fill];
    }
    elements.push(styleRect);
  }
  elements.push(textNode);

  return elements;
};

export const fills = async (node, parent, { fontColor = '', fontSize = 0 }) => {
  let fills = null;
  if (node.type === 'TEXT') {
    const fontData = await getFontFillsAndStyles(node);

    fills = fontData.fills;
  } else {
    if (node.fillStyleId) {
      fills = await getFillsByFillStyleId(node.fillStyleId);
    } else {
      if (!fills && node?.fills !== figma.mixed) {
        fills = node.fills;
      }
    }
  }

  if (fills) {
    fills.forEach((fill) => {
      const fillIcon = figma.createNodeFromSvg(ICON);

      const g = figma.group(
        [fillIcon, ...createColorNode(fill, { fontColor, fontSize })],
        parent,
      );
      g.expanded = false;
    });
  }
};
