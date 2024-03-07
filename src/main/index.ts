import './store';

import EventEmitter from '../shared/EventEmitter';
import {
  GROUP_NAME_ATTACHED,
  GROUP_NAME_DETACHED,
  VERSION,
} from '../shared/constants';
import {
  Alignments,
  ExchangeStoreValues,
  NodeSelection,
  PluginNodeData,
  SurroundingSettings,
  TooltipPositions,
} from '../shared/interfaces';

import { createFill } from './fill';
import { appendElementsToGroup, isPartOfAttachedGroup } from './helper';
import { createLine } from './line';
import {
  ParentNodeErrors,
  createPaddingLine,
  getNodeAndParentNode,
  getPadding,
  removePaddingGroup,
} from './padding';
import { drawSpacing, getSpacing, setSpacing } from './spacing';
import { getState } from './store';
import { setTooltip } from './tooltip';

figma.skipInvisibleInstanceChildren = true;

figma.showUI(__html__, {
  width: 285,
  height: 562,
  themeColors: true,
});

figma.root.setRelaunchData({
  open: '',
});

export const getPluginData = (node, name) => {
  const data = node.getPluginData(name);
  if (!data) {
    return null;
  }

  return JSON.parse(data);
};

const getAllMeasurementNodes = async (
  node,
  pageId = '',
  pageName = '',
  measureData = [],
) => {
  if (node.type === 'PAGE') {
    pageId = node.id;
    pageName = node.name;
  }

  let type = null;
  let componentId = null;

  const storedData = node.getPluginDataKeys();

  if (node.type === 'INSTANCE') {
    componentId = (await node.getMainComponentAsync())?.id;
  }

  if (node.name === GROUP_NAME_DETACHED) {
    type = 'GROUP_DETACHED';
  }
  if (node.name === GROUP_NAME_ATTACHED) {
    type = 'GROUP_ATTACHED';
  }
  if (storedData.includes('padding')) {
    type = 'PADDING';
  }
  if (storedData.includes('spacing')) {
    type = 'SPACING';
  }
  if (storedData.includes('data')) {
    const data = node.getPluginData('data');

    if (data && data !== '{}') {
      type = 'DATA';
    }
  }

  if (type) {
    measureData.push({
      pageId,
      pageName,
      type,
      componentId,
      id: node.id,
      name: node.name,
    });
  }

  if ('children' in node) {
    for (const child of node.children) {
      await getAllMeasurementNodes(child, pageId, pageName, measureData);
    }
  }

  return measureData;
};

EventEmitter.answer(
  'file measurements',
  async () => await getAllMeasurementNodes(figma.root),
);

EventEmitter.answer('remove all measurements', async () => {
  const measurements = await getAllMeasurementNodes(figma.root);

  for (const measurement of measurements) {
    const node = await figma.getNodeByIdAsync(measurement.id);
    if (!node) {
      continue;
    }

    if (measurement.type.includes('GROUP_')) {
      node.remove();
    } else {
      await removeDataFromNode(node);
    }
  }

  return true;
});

const removeDataFromNode = async (node) => {
  if (Array.isArray(node)) {
    for (const id of node) {
      await removeDataFromNode(id);
    }
  } else {
    if (typeof node === 'string') {
      node = await figma.getNodeByIdAsync(node);
    }

    try {
      const data = JSON.parse(node.getPluginData('data'));

      for (const id of data.connectedNodes) {
        (await figma.getNodeByIdAsync(id))?.remove();
      }
    } catch {
      console.log('failed to remove connected node');
    }

    node.setPluginData('padding', '');
    node.setPluginData('spacing', '');
    node.setPluginData('data', '{}');
    node.setPluginData('parent', '');
  }
};

EventEmitter.on('remove node measurement', (nodeId) =>
  removeDataFromNode(nodeId),
);

EventEmitter.on('notify', ({ message, options }) =>
  figma.notify(message, options),
);

EventEmitter.on('focus node', async (payload) => {
  console.log(payload);
  try {
    const page = (await figma.getNodeByIdAsync(payload.pageId)) as PageNode;
    await figma.setCurrentPageAsync(page);
  } catch {
    console.log('Page not found');
  }
  const node = figma.currentPage.findOne((n) => n.id === payload.id);

  const padding = node.getPluginData('padding');
  const spacing = node.getPluginData('spacing');
  const toolData = node.getPluginData('data');

  console.log(
    node,
    {
      padding,
      spacing,
      toolData,
    },
    node.getPluginDataKeys(),
  );

  figma.currentPage.selection = [node];
  figma.viewport.scrollAndZoomIntoView([node]);
});

const getSelectionArray = async (): Promise<NodeSelection> => {
  const state = await getState();

  const nodes = [];
  const paddingNodes = [];
  const spacingNodes = [];

  for (const node of figma.currentPage.selection) {
    if (node) {
      let data = {};

      try {
        data = JSON.parse(node.getPluginData('data'));
      } catch {
        data = {};
      }

      const spacing = getSpacing(node);
      const spacings = state.detached ? 0 : Object.keys(spacing).length;
      const padding = getPadding(node);

      const x = node.x;
      const y = node.y;

      const nodeData = {
        id: node.id,
        type: node.type,
        x: x,
        y: y,
        x2: x + node.width,
        y2: y + node.height,
        width: node.width,
        height: node.height,
      };

      nodes.push({
        ...nodeData,
        padding,
        hasSpacing: spacings > 0 && figma.currentPage.selection.length === 1,
        data,
      });

      if (figma.currentPage.selection.length === 2) {
        paddingNodes.push({
          ...nodeData,
          padding,
          data,
        });

        spacingNodes.push({
          ...nodeData,
          spacing,
          data,
        });
      }
    }
  }

  return {
    nodes,
    padding: paddingNodes,
    spacing: spacingNodes,
  };
};

export const sendSelection = () =>
  getSelectionArray().then((selection) =>
    EventEmitter.emit<NodeSelection>('selection', selection),
  );

EventEmitter.on('resize', ({ width, height }) =>
  figma.ui.resize(width, height),
);

EventEmitter.answer('current selection', async () => getSelectionArray());

EventEmitter.on('set measurements', async (store: ExchangeStoreValues) =>
  setMeasurements(store),
);

const setMeasurements = async (
  store?: ExchangeStoreValues,
  shouldIncludeGroups = false,
  nodes = figma.currentPage.selection,
) => {
  const state = await getState();

  let data: PluginNodeData = null;

  let settings = {
    ...store,
  };

  for (const node of nodes) {
    if (!node) continue;
    let surrounding: SurroundingSettings = store.surrounding;

    if (!state.detached) {
      if (
        node.name !== GROUP_NAME_ATTACHED &&
        node.name !== GROUP_NAME_DETACHED &&
        (node.type === 'GROUP' || node.type === 'FRAME') &&
        shouldIncludeGroups
      ) {
        if (node.children.length > 0) {
          setMeasurements(store, shouldIncludeGroups, node.children);
        }
      }

      try {
        data = JSON.parse(node.getPluginData('data') || '{}');

        if (
          data.surrounding &&
          Object.keys(data.surrounding).length > 0 &&
          !store.surrounding
        ) {
          surrounding = data.surrounding;
          settings = {
            ...settings,
            ...data,
          };
        }
      } catch (e) {
        console.log(e);
        node.setPluginData('data', '{}');
        console.log('Could not set data');
        if (!store) {
          continue;
        }
      }

      // remove all connected nodes
      if (data?.connectedNodes?.length > 0) {
        for (const id of data.connectedNodes) {
          const foundNode = await figma.getNodeByIdAsync(id);
          if (foundNode) {
            foundNode.remove();
          }
        }
      }
    }

    // spacing
    const spacing = getSpacing(node);
    if (Object.keys(spacing).length > 0 && !state.detached) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      (
        await Promise.all(
          Object.keys(spacing).filter(async (connectedNodeId) => {
            // check if group exists
            const foundGroup = await figma.getNodeByIdAsync(
              spacing[connectedNodeId],
            );
            if (!foundGroup) {
              delete spacing[connectedNodeId];
              setSpacing(node, spacing);
            }

            // get connected node
            const foundConnectedNode = (await figma.getNodeByIdAsync(
              connectedNodeId,
            )) as unknown as SceneNode;

            // node removed
            if (!foundConnectedNode) {
              try {
                (
                  await figma.getNodeByIdAsync(spacing[connectedNodeId])
                )?.remove();
                delete spacing[connectedNodeId];
                setSpacing(node, spacing);
              } catch {
                console.log('Could not remove connected node');
              }
            } else {
              // check connected node group
              const connectedNodeSpacing = getSpacing(foundConnectedNode);
              const foundConnectedGroup = await figma.getNodeByIdAsync(
                connectedNodeSpacing[node.id],
              );
              if (!foundConnectedGroup) {
                delete connectedNodeSpacing[node.id];
                setSpacing(foundConnectedNode, connectedNodeSpacing);
              }

              return connectedNodeId;
            }
          }),
        )
      ).forEach(async (connectedNodeId) => {
        drawSpacing(
          [
            node,
            (await figma.getNodeByIdAsync(
              connectedNodeId,
            )) as unknown as SceneNode,
          ],
          {
            color: settings.color,
            labels: settings.labels,
            labelsOutside: settings.labelsOutside,
            labelPattern: settings.labelPattern,
            strokeCap: settings.strokeCap,
            // strokeOffset: settings.strokeOffset,
          },
        );
      });
    }

    const connectedNodes = [];

    // Padding
    const padding = getPadding(node);
    if (padding && !state.detached) {
      const elements = Object.keys(Alignments).filter(
        (k) => k !== Alignments.CENTER && padding[k],
      ) as Alignments[];
      for (const direction of elements) {
        removePaddingGroup(node, direction, state.isGlobalGroup);

        const paddingLine = createPaddingLine({
          ...settings,
          direction,
          currentNode: node,
          parent: (await figma.getNodeByIdAsync(
            padding[direction],
          )) as SceneNode,
          labelFontSize: state.labelFontSize,
        });

        if (paddingLine) {
          connectedNodes.push(paddingLine);
        }
      }
    }

    if (surrounding && Object.keys(surrounding).length !== 0) {
      if (surrounding.center) {
        const fillNode = createFill(node, {
          fill: store.fill,
          opacity: store.opacity,
          color: settings.color,
        });

        if (fillNode) {
          connectedNodes.push(fillNode);
        }
      }

      if (surrounding.tooltip) {
        const tooltip = await setTooltip(
          {
            flags: store.tooltip,
            offset: store.tooltipOffset,
            position: surrounding.tooltip || TooltipPositions.NONE,
            labelPattern: settings.labelPattern,
            fontPattern: settings.fontPattern,
          },
          node,
        );

        if (tooltip) {
          connectedNodes.push(tooltip);
        }
      }

      if (surrounding.rightBar) {
        connectedNodes.push(
          createLine({
            ...settings,
            node,
            direction: 'vertical',
            name: `vertical line ${Alignments.RIGHT.toLowerCase()}`,
            lineVerticalAlign: Alignments.RIGHT,
          }),
        );
      }

      if (surrounding.leftBar) {
        connectedNodes.push(
          createLine({
            ...settings,
            node,
            direction: 'vertical',
            name: `vertical line ${Alignments.LEFT.toLowerCase()}`,
            lineVerticalAlign: Alignments.LEFT,
          }),
        );
      }

      if (surrounding.topBar) {
        connectedNodes.push(
          createLine({
            ...settings,
            node,
            direction: 'horizontal',
            name: `horizontal line ${Alignments.TOP.toLowerCase()}`,
            lineHorizontalAlign: Alignments.TOP,
          }),
        );
      }

      if (surrounding.bottomBar) {
        connectedNodes.push(
          createLine({
            ...settings,
            node,
            direction: 'horizontal',
            name: `horizontal line ${Alignments.BOTTOM.toLowerCase()}`,
            lineHorizontalAlign: Alignments.BOTTOM,
          }),
        );
      }

      if (surrounding.horizontalBar) {
        connectedNodes.push(
          createLine({
            ...settings,
            node,
            direction: 'horizontal',
            name: 'horizontal line ' + Alignments.CENTER.toLowerCase(),
            lineHorizontalAlign: Alignments.CENTER,
          }),
        );
      }

      if (surrounding.verticalBar) {
        connectedNodes.push(
          createLine({
            ...settings,
            node,
            direction: 'vertical',
            name: 'vertical line ' + Alignments.CENTER.toLowerCase(),
            lineVerticalAlign: Alignments.CENTER,
          }),
        );
      }
    }
    // if (data.detached && Object.keys(data).length === 0) {

    if (state.detached) {
      if (connectedNodes.length > 0) {
        appendElementsToGroup({
          node,
          isGlobalGroup: state.isGlobalGroup,
          nodes: connectedNodes,
          name: GROUP_NAME_DETACHED,
          locked: state.lockDetachedGroup,
        });
      }
    } else {
      node.setPluginData(
        'data',
        JSON.stringify({
          ...settings,
          //
          connectedNodes: connectedNodes.map(({ id }) => id),
          version: VERSION,
        } as PluginNodeData),
      );

      if (connectedNodes.length > 0) {
        appendElementsToGroup({
          node,
          isGlobalGroup: state.isGlobalGroup,
          nodes: connectedNodes,
          locked: state.lockAttachedGroup,
        });
      }
    }
  }
};

(async function main() {
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

  await figma.loadAllPagesAsync();
  figma.on('documentchange', async ({ documentChanges }) => {
    if (
      documentChanges.filter(
        (change) =>
          change.type === 'PROPERTY_CHANGE' &&
          (change.node.removed ||
            isPartOfAttachedGroup(change.node as SceneNode) ||
            [GROUP_NAME_ATTACHED, GROUP_NAME_DETACHED].includes(
              (change.node as SceneNode).name,
            )),
      ).length > 0
    ) {
      return;
    }

    const state = await getState();
    const store: ExchangeStoreValues = {
      labelsOutside: state.labelsOutside,
      labels: state.labels,
      color: state.color,
      fill: state.fill,
      opacity: state.opacity,
      strokeCap: state.strokeCap,
      strokeOffset: state.strokeOffset,
      tooltipOffset: state.tooltipOffset,
      tooltip: state.tooltip,
      labelPattern: state.labelPattern,
      fontPattern: state.fontPattern,
      labelFontSize: state.labelFontSize,
    };

    await setMeasurements(store, true);
  });

  // events
  figma.on('selectionchange', () => {
    sendSelection();
  });
})();
