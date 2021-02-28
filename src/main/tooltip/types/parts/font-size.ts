import { createTooltipTextNode } from '../../../helper';

export default function fontSizePart(
  node,
  parent,
  { fontColor = '', fontSize = 0, unit = '' }
) {
  if (node.fontSize) {
    const iconFrame = figma.createNodeFromSvg(
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.96953 12H9.00078V4H10.0008V6.95312H10.0789C10.0936 6.93051 10.1091 6.90577 10.1257 6.87933C10.3383 6.54037 10.7262 5.92188 11.8133 5.92188C13.3289 5.92188 14.3758 7.125 14.3758 9.01563C14.3758 10.9219 13.3289 12.125 11.8289 12.125C10.7203 12.125 10.3155 11.4642 10.105 11.1206C10.096 11.1058 10.0873 11.0916 10.0789 11.0781H9.96953V12ZM11.7039 6.75C10.5789 6.75 9.98516 7.65625 9.98516 9C9.98516 10.3594 10.5945 11.2969 11.7039 11.2969C12.8602 11.2969 13.4539 10.2812 13.4539 9C13.4539 7.73438 12.8758 6.75 11.7039 6.75ZM1.04883 12L3.84883 4.00002H5.15236L7.95236 12H6.99883L6.29878 9.9999L2.7024 9.99991L2.00236 12H1.04883ZM4.50059 4.86221L5.94878 8.9999L3.0524 8.99991L4.50059 4.86221Z" fill="#8C8C8C"/>
      </svg>
      `
    );
    const textNode = createTooltipTextNode({
      fontColor,
      fontSize,
    });
    textNode.x += 20;
    textNode.y += 1.5;
    textNode.characters += `${Math.floor(node.fontSize.toString())}${unit}`;

    figma.group([iconFrame, textNode], parent);
  }
}
