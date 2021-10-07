import EventEmitter from '../shared/EventEmitter';
import { findAndReplaceNumberPattern } from '../shared/helpers';
import { Alignments, ExchangeStoreValues } from '../shared/interfaces';

import { getGlobalGroup, addToGlobalGroup } from './measure-group';
import { distanceBetweenTwoPoints } from './spacing';

import { getColor, createLabel, sendSelection } from '.';

function contains(node1, node2) {
  const x1 = node1.absoluteTransform[0][2];
  const y1 = node1.absoluteTransform[1][2];

  const x2 = node2.absoluteTransform[0][2];
  const y2 = node2.absoluteTransform[1][2];

  return !(
    x2 < x1 ||
    y2 < y1 ||
    x2 + node2.width > x1 + node1.width ||
    y2 + node2.height > y1 + node1.height
  );
}

export const removePaddingGroup = (currentNode, direction) => {
  const group = getGlobalGroup();

  if (group) {
    for (const node of group.children) {
      if (!node.getPluginData('padding-parent')) {
        continue;
      }

      try {
        const paddingGroup = JSON.parse(node.getPluginData('padding-parent'));

        if (
          paddingGroup.parentId === currentNode.id &&
          paddingGroup.direction === direction
        ) {
          node.remove();
        }
        // eslint-disable-next-line no-empty
      } catch (e) {
        console.log(e);
      }
    }
  }
};

export const getPadding = (node: SceneNode) => {
  return JSON.parse(node.getPluginData('padding') || '{}');
};

EventEmitter.on('add padding', ({ direction, settings }) => {
  const currentNode = figma.currentPage.selection[0];

  const nodeData = getNodeAndParentNode(currentNode);

  if (nodeData && nodeData.node && nodeData.parentNode) {
    // Padding
    let pluginDataPadding = getPadding(nodeData.node);

    if (pluginDataPadding[direction]) {
      try {
        removePaddingGroup(nodeData.node, direction);

        delete pluginDataPadding[direction];

        nodeData.node.setPluginData(
          'padding',
          JSON.stringify(pluginDataPadding)
        );
        // eslint-disable-next-line no-empty
      } catch {}
    } else {
      nodeData.node.setPluginData(
        'padding',
        JSON.stringify({
          ...pluginDataPadding,
          [direction]: nodeData.parentNode.id,
        })
      );

      pluginDataPadding = getPadding(nodeData.node);

      if (pluginDataPadding[direction]) {
        for (const parentId of pluginDataPadding[direction]) {
          addToGlobalGroup(
            createPaddingLine({
              ...settings,
              direction,
              node: nodeData.node,
              parent: figma.getNodeById(parentId),
            })
          );
        }
      }
    }
  }

  sendSelection();
});

const getNodeAndParentNode = (
  node?: SceneNode,
  parentNode?: SceneNode
): { node?: SceneNode; parentNode?: SceneNode } => {
  let currentNode = node ?? (figma.currentPage.selection[0] as SceneNode);

  if (figma.currentPage.selection.length === 1 && !parentNode) {
    if (currentNode.parent && currentNode.parent.type !== 'PAGE') {
      parentNode = currentNode.parent as SceneNode;
    } else {
      figma.notify('No parent element found');
      return null;
    }
  } else if (
    figma.currentPage.selection.length === 2 ||
    (currentNode && parentNode)
  ) {
    if (!parentNode) {
      parentNode = figma.currentPage.selection[1] as SceneNode;
    }

    if (
      !contains(currentNode, parentNode) &&
      !contains(parentNode, currentNode)
    ) {
      figma.notify('The element does not contain the other one');
      return null;
    }

    if (contains(currentNode, parentNode)) {
      const dummyParentNode = parentNode;
      parentNode = currentNode;
      currentNode = dummyParentNode;
    }
  } else {
    figma.notify('Please select only two elements');
    return null;
  }

  return {
    node: currentNode,
    parentNode,
  };
};

export function createPaddingLine({
  direction,
  labelPattern,
  labelsOutside = false,
  labels = true,
  color,
  currentNode,
  parent = null,
}: {
  direction: Alignments;
  parent?: SceneNode;
  currentNode?: SceneNode;
} & ExchangeStoreValues) {
  const nodeData = getNodeAndParentNode(currentNode, parent);
  const mainColor = getColor(color);

  if (!nodeData || !nodeData.node || !nodeData.parentNode) {
    try {
      const padding = getPadding(currentNode);
      delete padding[direction];
      currentNode.setPluginData('padding', JSON.stringify(padding));
      sendSelection();
      // eslint-disable-next-line no-empty
    } catch (e) {
      console.log(e);
    }
    return;
  }

  const { node, parentNode } = nodeData;

  if (
    Math.round(node.rotation) !== 0 ||
    Math.round(parentNode.rotation) !== 0
  ) {
    figma.notify('Rotated elements are currently not supported');
    return;
  }

  const line = figma.createVector();

  const group = figma.group([line], figma.currentPage);
  group.name = `padding-line-${direction.toLowerCase()}`;

  let distance = 0;

  line.name = 'out';
  line.x = node.absoluteTransform[0][2];
  line.y = node.absoluteTransform[1][2];

  const parentNodeX = parentNode.absoluteTransform[0][2];
  const parentNodeY = parentNode.absoluteTransform[1][2];

  switch (direction) {
    case Alignments.LEFT:
      distance =
        distanceBetweenTwoPoints(line.x, line.y, parentNodeX, line.y) * -1;
      break;
    case Alignments.RIGHT:
      line.x += node.width;

      distance = distanceBetweenTwoPoints(
        line.x,
        line.y,
        parentNodeX + parentNode.width,
        line.y
      );
      break;
    case Alignments.TOP:
      distance =
        distanceBetweenTwoPoints(line.x, line.y, line.x, parentNodeY) * -1;

      break;
    case Alignments.BOTTOM:
      line.y += node.height;

      distance = distanceBetweenTwoPoints(
        line.x,
        line.y,
        line.x,
        parentNodeY + parentNode.height
      );
      break;
  }

  if (direction === 'LEFT' || direction === 'RIGHT') {
    line.y += node.height / 2;
  } else {
    line.x += node.width / 2;
  }

  line.vectorPaths = [
    {
      windingRule: 'NONE',
      // M x y L x y Z is close
      data:
        direction === 'LEFT' || direction === 'RIGHT'
          ? `M 0 0 L ${distance} 0 Z`
          : `M 0 0 L 0 ${distance} Z`,
    },
  ];

  line.strokes = [].concat(mainColor);

  //LABEL
  const widthOrHeight = Math.abs(distance);
  if (labels) {
    const labelFrame = createLabel({
      text: findAndReplaceNumberPattern(labelPattern, widthOrHeight),
      color: mainColor,
    });

    labelFrame.relativeTransform = group.absoluteTransform;
    group.appendChild(labelFrame);

    if (direction === 'LEFT' || direction === 'RIGHT') {
      labelFrame.y -= labelFrame.height / 2;
      labelFrame.x += widthOrHeight / 2 - labelFrame.width / 2;

      if (labelsOutside) {
        labelFrame.y += labelFrame.height / 2 + 4;
      }
    } else {
      labelFrame.y += widthOrHeight / 2 - labelFrame.height / 2;
      labelFrame.x -= labelFrame.width / 2;

      if (labelsOutside) {
        labelFrame.x += labelFrame.width / 2 + 4;
      }
    }
  }
  if (widthOrHeight === 0) {
    figma.notify('The distance is zero');
    group.remove();
    return;
  }

  group.setPluginData(
    'padding-parent',
    JSON.stringify({
      direction,
      parentId: node.id,
    })
  );

  return group;
}
