import './store';

import EventEmitter from '../shared/EventEmitter';
import {
  GROUP_NAME_ATTACHED,
  GROUP_NAME_DETACHED,
  VERSION,
} from '../shared/constants';
import {
  Alignments,
  NodeSelection,
  SurroundingSettings,
  TooltipPositions,
  ExchangeStoreValues,
  PluginNodeData,
} from '../shared/interfaces';

import { createFill } from './fill';
import { appendElementsToGroup } from './helper';
import { createLine } from './line';
import { getPadding, createPaddingLine, removePaddingGroup } from './padding';
import { drawSpacing, getSpacing, setSpacing } from './spacing';
import { getState } from './store';
import { setTooltip } from './tooltip';

let changeInterval;
let previousSelection;

figma.skipInvisibleInstanceChildren = true;

figma.showUI(__html__, {
  width: 285,
  height: 562,
});

figma.root.setRelaunchData({
  open: '',
});

export function getPluginData(node, name) {
  const data = node.getPluginData(name);
  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

const getAllMeasurementNodes = (node, pageId = '', measureData = []) => {
  if (node.type === 'PAGE') {
    pageId = node.id;
  }

  let type = null;

  const storedData = node.getPluginDataKeys();

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
      type,
      id: node.id,
      name: node.name,
    });
  }

  if ('children' in node) {
    for (const child of node.children) {
      getAllMeasurementNodes(child, pageId, measureData);
    }
  }

  return measureData;
};

EventEmitter.answer('file measurements', async () => {
  const nodes = getAllMeasurementNodes(figma.root);
  console.log(nodes);
  return nodes;
});

EventEmitter.answer('remove all measurements', async () => {
  const measurements = getAllMeasurementNodes(figma.root);

  for (const measurement of measurements) {
    const node = figma.getNodeById(measurement.id);
    if (!node) {
      continue;
    }

    if (measurement.type.includes('GROUP_')) {
      node.remove();
    } else {
      node.setPluginData('padding', '');
      node.setPluginData('spacing', '');
      node.setPluginData('data', '{}');
      node.setPluginData('parent', '');
    }
  }

  return true;
});

const goToPage = (id) => {
  if (figma.getNodeById(id)) {
    figma.currentPage = figma.getNodeById(id) as PageNode;
  }
};

EventEmitter.on('focus node', (payload) => {
  goToPage(payload.pageId);
  const node = figma.currentPage.findOne((node) => node.id === payload.id);

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
    node.getPluginDataKeys()
  );

  figma.currentPage.selection = [node];
  figma.viewport.scrollAndZoomIntoView([node]);
});

async function getSelectionArray(): Promise<NodeSelection[]> {
  const state = await getState();
  return figma.currentPage.selection.map((node) => {
    let data = {};

    try {
      data = JSON.parse(node.getPluginData('data'));
    } catch {
      data = {};
    }

    const spacings = state.detached ? 0 : Object.keys(getSpacing(node)).length;

    const x = node.x;
    const y = node.y;

    return {
      id: node.id,
      type: node.type,
      x: x,
      y: y,
      x2: x + node.width,
      y2: y + node.height,
      width: node.width,
      height: node.height,
      padding: getPadding(node),
      hasSpacing: spacings > 0 && figma.currentPage.selection.length === 1,
      data,
    };
  });
}

export const sendSelection = () =>
  getSelectionArray().then((selection) =>
    EventEmitter.emit('selection', selection)
  );

const currentSelectionAsJSONString = () =>
  JSON.stringify(
    figma.currentPage.selection.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: `${curr.x}-${curr.y}-${curr.width}-${curr.height}`,
      }),
      {}
    )
  );

// events
figma.on('selectionchange', () => {
  if (figma.currentPage.selection.length > 0) {
    previousSelection = currentSelectionAsJSONString();

    if (!changeInterval) {
      changeInterval = setInterval(async () => {
        const currentSelection = currentSelectionAsJSONString();

        if (currentSelection !== previousSelection) {
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
            labelFontSize: state.labelFontSize,
          };

          previousSelection = currentSelectionAsJSONString();
          await setMeasurements(store);
        }
      }, 1000);
    }
  } else {
    clearInterval(changeInterval);
    changeInterval = undefined;
    previousSelection = undefined;
  }
  sendSelection();
});

EventEmitter.on('resize', ({ width, height }) =>
  figma.ui.resize(width, height)
);

EventEmitter.answer('current selection', async () => getSelectionArray());

EventEmitter.on('set measurements', async (store: ExchangeStoreValues) =>
  setMeasurements(store)
);

const setMeasurements = async (store?: ExchangeStoreValues) => {
  const state = await getState();

  let data: PluginNodeData = null;

  let settings = {
    ...store,
  };

  for (const node of figma.currentPage.selection) {
    let surrounding: SurroundingSettings = store.surrounding;

    if (!state.detached) {
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
          const foundNode = figma.getNodeById(id);
          if (foundNode) {
            foundNode.remove();
          }
        }
      }
    }

    // spacing
    const spacing = getSpacing(node);
    if (Object.keys(spacing).length > 0 && !state.detached) {
      Object.keys(spacing)
        .filter((connectedNodeId) => {
          // check if group exists
          const foundGroup = figma.getNodeById(spacing[connectedNodeId]);
          if (!foundGroup) {
            delete spacing[connectedNodeId];
            setSpacing(node, spacing);
          }

          // get connected node
          const foundConnectedNode = figma.getNodeById(
            connectedNodeId
          ) as unknown as SceneNode;

          // node removed
          if (!foundConnectedNode) {
            try {
              figma.getNodeById(spacing[connectedNodeId]).remove();
              delete spacing[connectedNodeId];
              setSpacing(node, spacing);
            } catch {
              console.log('Could not remove connected node');
            }
          } else {
            // check connected node group
            const connectedNodeSpacing = getSpacing(foundConnectedNode);
            const foundConnectedGroup = figma.getNodeById(
              connectedNodeSpacing[node.id]
            );
            if (!foundConnectedGroup) {
              delete connectedNodeSpacing[node.id];
              setSpacing(foundConnectedNode, connectedNodeSpacing);
            }

            return connectedNodeId;
          }
        })
        .forEach((connectedNodeId) => {
          drawSpacing(
            [node, figma.getNodeById(connectedNodeId) as unknown as SceneNode],
            {
              color: settings.color,
              labels: settings.labels,
              labelsOutside: settings.labelsOutside,
              labelPattern: settings.labelPattern,
              // strokeOffset: settings.strokeOffset,
            }
          );
        });
    }

    const connectedNodes = [];

    // Padding
    const padding = getPadding(node);
    if (padding && !state.detached) {
      Object.keys(Alignments)
        .filter((k) => k !== Alignments.CENTER && padding[k])
        .forEach((direction: Alignments) => {
          removePaddingGroup(node, direction);

          const paddingLine = createPaddingLine({
            ...settings,
            direction,
            currentNode: node,
            parent: figma.getNodeById(padding[direction]) as SceneNode,
          });

          if (paddingLine) {
            connectedNodes.push(paddingLine);
          }
        });
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
          },
          node
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
          })
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
          })
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
          })
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
          })
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
          })
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
          })
        );
      }
    }
    // if (data.detached && Object.keys(data).length === 0) {

    if (state.detached) {
      if (connectedNodes.length > 0) {
        appendElementsToGroup({
          node,
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
        } as PluginNodeData)
      );

      if (connectedNodes.length > 0) {
        appendElementsToGroup({
          node,
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
})();
