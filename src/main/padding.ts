import EventEmitter from '../shared/EventEmitter';
import { findAndReplaceNumberPattern } from '../shared/helpers';
import { Alignments, ExchangeStoreValues } from '../shared/interfaces';

import { distanceBetweenTwoPoints } from './spacing';

import { getColor, createLabel, addToGlobalGroup } from '.';

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

export const getPadding = (node: SceneNode, direction: Alignments) => {
  const padding = JSON.parse(node.getPluginData('padding') || '{}');

  return Object.keys(padding[`${node.id}-${direction}`] || {}).length > 0
    ? padding[`${node.id}-${direction}`]
    : null;
};

EventEmitter.on('add padding', ({ direction, settings }) => {
  const currentNode = figma.currentPage.selection[0];

  const nodeData = getNodeAndParentNode(currentNode);

  if (nodeData && nodeData.node && nodeData.parentNode) {
    // Padding
    let pluginDataPadding = getPadding(nodeData.node, direction);
    const paddingGroups = JSON.parse(
      nodeData.node.getPluginData('padding-groups') || '[]'
    );
    nodeData.node.setPluginData('padding-groups', '[]');

    // remove paddings
    if (pluginDataPadding) {
      // try {
      //   delete pluginDataPadding[`${node.id}-${direction}`];
      //   node.setPluginData('padding', JSON.stringify(pluginDataPadding));
      //   // eslint-disable-next-line no-empty
      // } catch {}
      for (const groupId of paddingGroups) {
        try {
          if (groupId) {
            figma.getNodeById(groupId).remove();
          }
          // eslint-disable-next-line no-empty
        } catch (err) {
          console.log(err);
        }
      }
    }

    nodeData.node.setPluginData(
      'padding',
      JSON.stringify({
        ...JSON.parse(nodeData.node.getPluginData('padding') || '{}'),
        [`${nodeData.node.id}-${direction}`]: Array.from(
          new Set([...(pluginDataPadding || []), nodeData.parentNode.id])
        ),
      })
    );

    pluginDataPadding = getPadding(nodeData.node, direction);

    for (const parent of pluginDataPadding) {
      addToGlobalGroup(
        createPaddingLine({
          ...settings,
          direction,
          node: nodeData.node,
          parent: figma.getNodeById(parent),
        })
      );
    }
  }
});

const getNodeAndParentNode = (
  node?: SceneNode,
  parentNode?: SceneNode
): { node?: SceneNode; parentNode?: SceneNode } => {
  node = figma.currentPage.selection[0] as SceneNode;

  if (figma.currentPage.selection.length === 1 && !parentNode) {
    if (node.parent && node.parent.type !== 'PAGE') {
      parentNode = node.parent as SceneNode;
    } else {
      figma.notify('No parent element found');
      return;
    }
  } else if (figma.currentPage.selection.length === 2 || (node && parentNode)) {
    if (!parentNode) {
      parentNode = figma.currentPage.selection[1] as SceneNode;
    }

    if (!contains(node, parentNode) && !contains(parentNode, node)) {
      figma.notify('The element does not contain the other one');
      return;
    }

    if (contains(node, parentNode)) {
      const dummyParentNode = parentNode;
      parentNode = node;
      node = dummyParentNode;
    }
  } else {
    figma.notify('Please select only two elements');
    return;
  }

  return { node, parentNode };
};

export function createPaddingLine({
  direction,
  labelPattern,
  currentNode,
  parent = null,
}: {
  direction: Alignments;
  parent?: SceneNode;
  currentNode?: SceneNode;
} & ExchangeStoreValues) {
  const nodeData = getNodeAndParentNode(currentNode, parent);

  if (!nodeData || !nodeData.node || !nodeData.parentNode) return;

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

  // group.relativeTransform = node.absoluteTransform;

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

  line.strokes = [].concat(getColor('#f00000'));

  //LABEL
  const widthOrHeight = Math.abs(distance);
  const labelFrame = createLabel({
    text: findAndReplaceNumberPattern(labelPattern, widthOrHeight),
    color: getColor('#f00000'),
  });

  labelFrame.relativeTransform = group.absoluteTransform;
  group.appendChild(labelFrame);

  if (direction === 'LEFT' || direction === 'RIGHT') {
    labelFrame.y -= labelFrame.height / 2;
    labelFrame.x += widthOrHeight / 2 - labelFrame.width / 2;
  } else {
    labelFrame.y += widthOrHeight / 2 - labelFrame.height / 2;
    labelFrame.x -= labelFrame.width / 2;
  }

  if (widthOrHeight === 0) {
    figma.notify('The distance is zero');
    group.remove();
    return;
  }

  node.setPluginData(
    'padding-groups',
    JSON.stringify(
      Array.from(
        new Set([
          ...JSON.parse(node.getPluginData('padding-groups') || '[]'),
          group.id,
        ])
      )
    )
  );

  return group;
}
