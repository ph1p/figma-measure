import { FillTypes } from '../shared/interfaces';

import { hexToRgb, solidColor } from './helper';

export const createFill = (
  node: SceneNode,
  { fill, opacity, color }: { fill: FillTypes; opacity: number; color: string }
) => {
  if (
    node.type !== 'WIDGET' &&
    node.type !== 'CODE_BLOCK' &&
    node.type !== 'EMBED' &&
    node.type !== 'LINK_UNFURL' &&
    node.type !== 'SLICE' &&
    node.type !== 'STICKY' &&
    node.type !== 'CONNECTOR' &&
    node.type !== 'STAMP' &&
    node.type !== 'SHAPE_WITH_TEXT' &&
    node.type !== 'MEDIA'
  ) {
    let cloneNode: SceneNode;

    if (
      node.type === 'FRAME' ||
      node.type === 'TEXT' ||
      node.type === 'COMPONENT' ||
      node.type === 'INSTANCE' ||
      node.type === 'GROUP'
    ) {
      cloneNode = figma.createRectangle();
      cloneNode.resize(node.width, node.height);
    } else {
      cloneNode = node.clone();
    }

    cloneNode.x = node.x;
    cloneNode.y = node.y;
    cloneNode.relativeTransform = node.absoluteTransform;

    cloneNode.fills = [];
    cloneNode.strokes = [];
    cloneNode.opacity = 1;
    cloneNode.locked = false;
    cloneNode.isMask = false;

    cloneNode.setPluginData('data', '');
    cloneNode.setPluginData('spacing', '');
    cloneNode.setPluginData('parent', '');
    cloneNode.setPluginData('padding', '');

    const { r, g, b } = hexToRgb(color);

    switch (fill) {
      case 'dashed':
        cloneNode.dashPattern = [4];
        cloneNode.strokes = [].concat(solidColor(r, g, b));
        cloneNode.strokeWeight = 1;
        break;
      case 'fill':
        cloneNode.fills = [].concat({
          ...solidColor(r, g, b),
          opacity: opacity / 100,
        });
        break;
      case 'fill-stroke':
        cloneNode.strokes = [].concat(solidColor(r, g, b));
        cloneNode.strokeWeight = 1;

        cloneNode.fills = [].concat({
          ...solidColor(r, g, b),
          opacity: opacity / 100,
        });
        break;
      case 'stroke':
        cloneNode.strokes = [].concat(solidColor(r, g, b));
        cloneNode.strokeWeight = 1;
        break;
    }

    return cloneNode;
  } else {
    figma.notify('Slices are currently not supported.', {
      error: true,
    });
  }
};
