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
      if ((node && !node.getPluginData('padding-parent')) || !node) {
        continue;
      }

      try {
        const paddingGroup = node
          ? JSON.parse(node.getPluginData('padding-parent'))
          : null;

        if (
          paddingGroup &&
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
  return node ? JSON.parse(node.getPluginData('padding') || '{}') : {};
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

  const paddingLines = [];

  if (nodeData && nodeData.node && nodeData.parentNode) {
    if (state.detached) {
      const paddingLine = createPaddingLine({
        ...settings,
        direction,
        detached: state.detached,
        strokeCap: state.strokeCap,
        currentNode: nodeData.node,
        parent: figma.getNodeById(nodeData.parentNode.id),
      });

      if (paddingLine) {
        paddingLines.push(paddingLine);
      }
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
          const parentId = pluginDataPadding[direction];

          const paddingLine = createPaddingLine({
            ...settings,
            direction,
            detached: state.detached,
            strokeCap: state.strokeCap,
            currentNode: nodeData.node,
            parent: figma.getNodeById(parentId),
          });

          if (paddingLine) {
            paddingLines.push(paddingLine);
          } else {
            delete pluginDataPadding[direction];

            nodeData.node.setPluginData(
              'padding',
              JSON.stringify(pluginDataPadding)
            );
          }
        }
      }
    }
  }

  if (paddingLines.length > 0) {
    if (state.detached) {
      appendElementsToGroup(currentNode, paddingLines, GROUP_NAME_DETACHED);
    } else {
      appendElementsToGroup(currentNode, paddingLines);
    }

    sendSelection();
  }
});

const contains = (node1, node2) => {
  const x1 = node1.absoluteRenderBounds.x;
  const y1 = node1.absoluteRenderBounds.y;
  const x2 = node2.absoluteRenderBounds.x;
  const y2 = node2.absoluteRenderBounds.y;

  return !(
    x2 < x1 ||
    y2 < y1 ||
    x2 + node2.absoluteRenderBounds.width >
      x1 + node1.absoluteRenderBounds.width ||
    y2 + node2.absoluteRenderBounds.height >
      y1 + node1.absoluteRenderBounds.height
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

export const isValidType = (type) =>
  [
    'FRAME',
    'GROUP',
    'SLICE',
    'RECTANGLE',
    'LINE',
    'ELLIPSE',
    'POLYGON',
    'STAR',
    'VECTOR',
    'TEXT',
    'COMPONENT_SET',
    'COMPONENT',
    'INSTANCE',
    'BOOLEAN_OPERATION',
  ].includes(type);

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
    !(node as any).absoluteRenderBounds ||
    !(parentNode as any).absoluteRenderBounds
  ) {
    figma.notify('Element is no supported');
    return;
  }

  const group = figma.createFrame();

  group.clipsContent = false;
  group.backgrounds = [];
  group.name = `Padding line ${direction.toLowerCase()}`;
  group.expanded = false;

  let distance = 0;

  group.x = (node as any).absoluteRenderBounds.x;
  group.y = (node as any).absoluteRenderBounds.y;

  const nodeWidth = (node as any).absoluteRenderBounds.width;
  const nodeHeight = (node as any).absoluteRenderBounds.height;

  const parentNodeX = (parentNode as any).absoluteRenderBounds.x;
  const parentNodeY = (parentNode as any).absoluteRenderBounds.y;

  const parentNodeWidth = (parentNode as any).absoluteRenderBounds.width;
  const parentNodeHeight = (parentNode as any).absoluteRenderBounds.height;

  switch (direction) {
    case Alignments.LEFT:
      distance =
        distanceBetweenTwoPoints(group.x, group.y, parentNodeX, group.y) * -1;
      break;
    case Alignments.RIGHT:
      group.x += nodeWidth;

      distance = distanceBetweenTwoPoints(
        group.x,
        group.y,
        parentNodeX + parentNodeWidth,
        group.y
      );
      break;
    case Alignments.TOP:
      distance =
        distanceBetweenTwoPoints(group.x, group.y, group.x, parentNodeY) * -1;

      break;
    case Alignments.BOTTOM:
      group.y += nodeHeight;

      distance = distanceBetweenTwoPoints(
        group.x,
        group.y,
        group.x,
        parentNodeY + parentNodeHeight
      );
      break;
  }

  const widthOrHeight = Math.abs(distance);
  if (widthOrHeight <= 0.01) {
    figma.notify('Cannot measure padding, because width or height is zero');
    group.remove();
    return null;
  }

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
    group.y += nodeHeight / 2;
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
    group.x += nodeWidth / 2;
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
