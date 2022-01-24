import { GROUP_NAME_DETACHED } from '../shared';
import EventEmitter from '../shared/EventEmitter';
import { findAndReplaceNumberPattern } from '../shared/helpers';
import { Alignments, ExchangeStoreValues } from '../shared/interfaces';

import {
  appendElementsToGroup,
  getClosestAttachedGroup,
  getColor,
} from './helper';
import { createLabel, createStandardCap } from './line';
import { distanceBetweenTwoPoints } from './spacing';
import { getState } from './store';

import { sendSelection } from '.';

export const removePaddingGroup = (currentNode, direction) => {
  const group = getClosestAttachedGroup(currentNode);

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

EventEmitter.on('remove padding', async ({ direction }) => {
  if (figma.currentPage.selection.length === 1) {
    const currentNode = figma.currentPage.selection[0];

    if (currentNode) {
      const pluginDataPadding = getPadding(currentNode);

      if (pluginDataPadding[direction]) {
        try {
          removePaddingGroup(currentNode, direction);

          delete pluginDataPadding[direction];

          currentNode.setPluginData(
            'padding',
            JSON.stringify(pluginDataPadding)
          );
          // eslint-disable-next-line no-empty
        } catch {}
      }
    }
  }

  sendSelection();
});

EventEmitter.on('add padding', async ({ direction, settings }) => {
  const state = await getState();
  const currentNode = figma.currentPage.selection[0];

  const nodeData = getNodeAndParentNode(currentNode);

  if (nodeData && nodeData.node && nodeData.parentNode) {
    if (state.detached) {
      appendElementsToGroup(
        currentNode,
        [
          createPaddingLine({
            ...settings,
            direction,
            detached: state.detached,
            strokeCap: state.strokeCap,
            node: nodeData.node,
            parent: figma.getNodeById(nodeData.parentNode.id),
          }),
        ],
        GROUP_NAME_DETACHED
      );
    } else {
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
            appendElementsToGroup(currentNode, [
              createPaddingLine({
                ...settings,
                direction,
                detached: state.detached,
                strokeCap: state.strokeCap,
                node: nodeData.node,
                parent: figma.getNodeById(parentId),
              }),
            ]);
          }
        }
      }
    }
  }

  sendSelection();
});

const contains = (node1, node2) => {
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
};

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
    node: currentNode as SceneNode,
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
  detached = false,
  strokeCap = 'NONE',
}: {
  direction: Alignments;
  parent?: SceneNode;
  currentNode?: SceneNode;
} & ExchangeStoreValues) {
  const nodeData = getNodeAndParentNode(currentNode, parent);
  const mainColor = getColor(color);

  const IS_HORIZONTAL = direction === 'LEFT' || direction === 'RIGHT';

  if (!nodeData || !nodeData.node || !nodeData.parentNode) {
    try {
      if (!detached) {
        const padding = getPadding(currentNode);
        delete padding[direction];
        currentNode.setPluginData('padding', JSON.stringify(padding));
      }
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

  const group = figma.createFrame();

  group.clipsContent = false;
  group.backgrounds = [];
  group.name = `Padding line ${direction.toLowerCase()}`;
  group.expanded = false;

  let distance = 0;

  group.x = node.absoluteTransform[0][2];
  group.y = node.absoluteTransform[1][2];

  const parentNodeX = parentNode.absoluteTransform[0][2];
  const parentNodeY = parentNode.absoluteTransform[1][2];

  switch (direction) {
    case Alignments.LEFT:
      distance =
        distanceBetweenTwoPoints(group.x, group.y, parentNodeX, group.y) * -1;
      break;
    case Alignments.RIGHT:
      group.x += node.width;

      distance = distanceBetweenTwoPoints(
        group.x,
        group.y,
        parentNodeX + parentNode.width,
        group.y
      );
      break;
    case Alignments.TOP:
      distance =
        distanceBetweenTwoPoints(group.x, group.y, group.x, parentNodeY) * -1;

      break;
    case Alignments.BOTTOM:
      group.y += node.height;

      distance = distanceBetweenTwoPoints(
        group.x,
        group.y,
        group.x,
        parentNodeY + parentNode.height
      );
      break;
  }

  const widthOrHeight = Math.abs(distance);
  const line = figma.createVector();
  line.name = 'out';
  line.strokes = [].concat(mainColor);

  line.vectorPaths = [
    {
      windingRule: 'NONE',
      // M x y L x y Z is close
      data: IS_HORIZONTAL
        ? `M 0 0 L ${widthOrHeight} 0 Z`
        : `M 0 0 L 0 ${widthOrHeight} Z`,
    },
  ];
  group.appendChild(line);

  //LABEL
  let labelFrame = null;
  if (labels) {
    labelFrame = createLabel({
      text: findAndReplaceNumberPattern(labelPattern, widthOrHeight),
      color: mainColor,
    });

    group.appendChild(labelFrame);

    if (IS_HORIZONTAL) {
      labelFrame.y -= labelFrame.height / 2;
      labelFrame.x += widthOrHeight / 2 - labelFrame.width / 2;

      if (labelsOutside) {
        labelFrame.y += labelFrame.height / 2 + 4;
      }

      group.y -= labelFrame.height / 2;
      group.resize(widthOrHeight, labelFrame.height);
    } else {
      labelFrame.y += widthOrHeight / 2 - labelFrame.height / 2;
      labelFrame.x -= labelFrame.width / 2;

      if (labelsOutside) {
        labelFrame.x += labelFrame.width / 2 + 4;
      }

      group.x -= labelFrame.width / 2;
      group.resize(labelFrame.width, widthOrHeight);
    }

    labelFrame.constraints = {
      vertical: 'CENTER',
      horizontal: 'CENTER',
    };
  } else {
    if (IS_HORIZONTAL) {
      group.resize(widthOrHeight, 1);
    } else {
      group.resize(1, widthOrHeight);
    }
  }

  if (IS_HORIZONTAL) {
    group.y += node.height / 2;
    if (direction === 'LEFT') {
      group.x += distance;
    }
    //
    line.constraints = {
      vertical: 'CENTER',
      horizontal: 'STRETCH',
    };
    line.x = 0;
    line.y = group.height / 2 + line.strokeWeight / 2;
    //
    if (labels) {
      labelFrame.y += group.height / 2;
    }
  } else {
    group.x += node.width / 2;
    if (direction === 'TOP') {
      group.y += distance;
    }
    //
    line.constraints = {
      vertical: 'STRETCH',
      horizontal: 'CENTER',
    };
    line.x = group.width / 2 - line.strokeWeight / 2;
    line.y = 0;
    //
    if (labels) {
      labelFrame.x += group.width / 2;
    }
  }

  if (strokeCap === 'STANDARD') {
    createStandardCap({
      group,
      line,
      isHorizontal: IS_HORIZONTAL,
      mainColor,
      width: widthOrHeight,
      height: widthOrHeight,
    });
  } else {
    line.strokeCap = strokeCap;
  }

  if (widthOrHeight === 0) {
    figma.notify('The distance is zero');
    group.remove();
    return;
  }

  if (!detached) {
    group.setPluginData(
      'padding-parent',
      JSON.stringify({
        direction,
        parentId: node.id,
      })
    );
  }

  return group;
}
