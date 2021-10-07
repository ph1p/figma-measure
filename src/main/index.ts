import './store';

import EventEmitter from '../shared/EventEmitter';
import { VERSION } from '../shared/constants';
import { findAndReplaceNumberPattern } from '../shared/helpers';
import {
  Alignments,
  FillTypes,
  LineParameterTypes,
  PluginNodeData,
  NodeSelection,
  SurroundingSettings,
  TooltipPositions,
  ExchangeStoreValues,
} from '../shared/interfaces';

import { hexToRgb, solidColor } from './helper';
import {
  addToGlobalGroup,
  getGlobalGroup,
  initMeasureGroup,
  isNodeInsideGlobalGroup,
  nodeGroup,
} from './measure-group';
import { getPadding, createPaddingLine, removePaddingGroup } from './padding';
import { drawSpacing, getSpacing, setSpacing } from './spacing';
import { getState } from './store';
import { setTooltip } from './tooltip';

figma.showUI(__html__, {
  width: 285,
  height: 562,
  visible: figma.command !== 'visibility',
});

figma.root.setRelaunchData({
  open: '',
  visibility: '',
});

initMeasureGroup();

if (figma.command === 'visibility') {
  const group = getGlobalGroup();

  if (group) {
    group.visible = !group.visible;
  }
  figma.closePlugin();
}

export function getColor(color: string) {
  if (color) {
    const { r, g, b } = hexToRgb(color);
    return solidColor(r, g, b);
  } else {
    return solidColor();
  }
}

export function createLabel({
  baseNode,
  text,
  color,
  isVertical,
}: {
  baseNode?: SceneNode;
  text: string;
  color: unknown;
  isVertical?: boolean;
}) {
  const labelFrame = figma.createFrame();
  const label = figma.createText();

  label.characters = text;
  label.fontName = {
    family: 'Inter',
    style: 'Bold',
  };
  label.fontSize = 10;
  label.fills = [].concat(solidColor(255, 255, 255));

  labelFrame.appendChild(label);
  labelFrame.name = 'label';

  // LABEL RECT
  labelFrame.cornerRadius = 3;

  labelFrame.layoutMode = 'HORIZONTAL';
  labelFrame.paddingLeft = 6;
  labelFrame.paddingRight = 6;
  labelFrame.paddingTop = 3;
  labelFrame.paddingBottom = 3;
  labelFrame.counterAxisSizingMode = 'AUTO';

  if (baseNode) {
    labelFrame.x = baseNode.x;
    labelFrame.y = baseNode.y;

    if (isVertical) {
      labelFrame.x -= labelFrame.width / 2;
      labelFrame.y += baseNode.height / 2 - labelFrame.height / 2;
    } else {
      labelFrame.x += baseNode.width / 2 - labelFrame.width / 2;
      labelFrame.y -= labelFrame.height / 2;
    }
  }
  labelFrame.fills = [].concat(color);

  return labelFrame;
}

export function getPluginData(node, name) {
  const data = node.getPluginData(name);
  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

function getLineFrame(node, data) {
  const name = 'line';
  const lineFrame = figma.createFrame();

  lineFrame.name = name;
  lineFrame.resize(
    data.isHorizontal ? node.width : data.labelWidth,
    data.isHorizontal ? data.labelHeight : node.height
  );
  lineFrame.backgrounds = [];
  lineFrame.clipsContent = false;

  lineFrame.expanded = false;

  return lineFrame;
}

function createLine(options) {
  const {
    node,
    direction = 'horizontal',
    // name = 'Group',
    txtVerticalAlign = Alignments.CENTER,
    txtHorizontalAlign = Alignments.CENTER,
    lineVerticalAlign = Alignments.LEFT,
    lineHorizontalAlign = Alignments.BOTTOM,
    strokeCap = 'NONE',
    strokeOffset = 3,
    color = '',
    labels = true,
    labelsOutside = false,
    labelPattern = '',
  }: LineParameterTypes = options;

  const LINE_OFFSET = strokeOffset * -1;
  const LABEL_OUTSIDE_MARGIN = 4;

  const mainColor = getColor(color);

  const isHorizontal = direction === 'horizontal';

  const nodeHeight = node.height;
  const nodeWidth = node.width;

  const heightOrWidth = isHorizontal ? nodeWidth : nodeHeight;

  if (heightOrWidth > 0.01) {
    // needed elements
    const line = figma.createVector();

    const paddingTopBottom = 3;

    // LABEL
    let labelFrame;
    const alignment = isHorizontal ? lineHorizontalAlign : lineVerticalAlign;

    if (labels) {
      labelFrame = createLabel({
        text: findAndReplaceNumberPattern(labelPattern, heightOrWidth),
        color: mainColor,
      });
    }

    // GROUP
    const group = getLineFrame(node, {
      isHorizontal,
      alignment,
      labelWidth: labelFrame ? labelFrame.width : 7,
      labelHeight: labelFrame ? labelFrame.height : 7,
    });

    group.appendChild(line);

    // add label frame
    if (labelFrame) {
      group.appendChild(labelFrame);
    }

    // LINE
    line.x = isHorizontal ? 0 : group.width / 2 - line.strokeWeight / 2;
    line.y = isHorizontal ? group.height / 2 + line.strokeWeight / 2 : 0;

    line.vectorPaths = [
      {
        windingRule: 'NONE',
        // M x y L x y Z is close
        data: isHorizontal
          ? `M 0 0 L ${node.height} 0 Z`
          : `M 0 0 L 0 ${node.width} Z`,
      },
    ];

    line.strokes = [].concat(mainColor);
    line.resize(isHorizontal ? node.width : 1, isHorizontal ? 1 : node.height);

    // STROKE CAP
    if (strokeCap === 'STANDARD') {
      const strokeCapWidth = 6 + line.strokeWeight;
      if (strokeCapWidth >= 0.01) {
        const firstMeasureLine = figma.createLine();
        const secondMeasureLine = figma.createLine();

        group.appendChild(firstMeasureLine);
        group.appendChild(secondMeasureLine);

        firstMeasureLine.strokes = [].concat(mainColor);
        secondMeasureLine.strokes = [].concat(mainColor);
        firstMeasureLine.resize(strokeCapWidth, 0);
        secondMeasureLine.resize(strokeCapWidth, 0);

        if (!isHorizontal) {
          firstMeasureLine.x =
            group.width / 2 - strokeCapWidth / 2 - line.strokeWeight / 2;
          firstMeasureLine.y += 1;

          secondMeasureLine.x =
            group.width / 2 - strokeCapWidth / 2 - line.strokeWeight / 2;
          secondMeasureLine.y += nodeHeight;
        } else {
          firstMeasureLine.rotation = 90;
          firstMeasureLine.x += 1;
          firstMeasureLine.y = line.y + strokeCapWidth / 2;

          secondMeasureLine.rotation = 90;
          secondMeasureLine.x += nodeWidth;
          secondMeasureLine.y = line.y + strokeCapWidth / 2;
        }
      }
    } else {
      line.strokeCap = strokeCap as StrokeCap;
    }

    // x, y for text box
    const boxTop = paddingTopBottom / 2;

    // place text group
    if (labels) {
      if (isHorizontal) {
        labelFrame.x = 0;
        labelFrame.y += boxTop + nodeHeight - LINE_OFFSET - line.strokeWeight;

        // vertical text align
        if (txtVerticalAlign === Alignments.CENTER) {
          if (labelsOutside) {
            if (lineHorizontalAlign === Alignments.TOP) {
              labelFrame.y =
                (labelFrame.height / 2 + LABEL_OUTSIDE_MARGIN) * -1;
            } else if (lineHorizontalAlign === Alignments.BOTTOM) {
              labelFrame.y =
                labelFrame.height / 2 +
                LABEL_OUTSIDE_MARGIN +
                line.strokeWeight;
            } else {
              labelFrame.y = 0;
            }
          } else {
            labelFrame.y = 0;
          }
        }

        // horizontal text align
        if (txtHorizontalAlign === Alignments.CENTER) {
          labelFrame.x = nodeWidth / 2 - labelFrame.width / 2;
        }
      } else {
        labelFrame.x = 0;
        labelFrame.y += boxTop;

        // vertical text align
        if (txtVerticalAlign === Alignments.CENTER) {
          labelFrame.y += nodeHeight / 2 - labelFrame.height / 2;
        }

        // vertical text align
        if (txtHorizontalAlign === Alignments.CENTER) {
          if (labelsOutside) {
            if (lineVerticalAlign === Alignments.RIGHT) {
              labelFrame.x = labelFrame.width / 2 + LABEL_OUTSIDE_MARGIN;
            } else if (lineVerticalAlign === Alignments.LEFT) {
              labelFrame.x -=
                labelFrame.width / 2 + LABEL_OUTSIDE_MARGIN + line.strokeWeight;
            } else {
              labelFrame.x = 0;
            }
          } else {
            labelFrame.x = 0;
          }
        }
      }
    }

    // line position
    const halfGroupHeight = group.height / 2;
    const halfGroupWidth = group.width / 2;

    let transformPosition = node.absoluteTransform;
    let newX = transformPosition[0][2];
    let newY = transformPosition[1][2];

    const xCos = transformPosition[0][0];
    const xSin = transformPosition[0][1];

    const yCos = transformPosition[1][0];
    const ySin = transformPosition[1][1];

    // horizonzal line position
    if (isHorizontal) {
      if (lineHorizontalAlign === Alignments.CENTER) {
        newY += (nodeHeight - group.height) / 2 - line.strokeWeight / 2;
      } else if (lineHorizontalAlign === Alignments.TOP) {
        newY -= group.height / 2 - LINE_OFFSET + line.strokeWeight;
      }
      // BOTTOM
      else {
        newY += nodeHeight - group.height / 2 - LINE_OFFSET;
      }

      // check if element is rotated
      if (node.rotation > 0 || node.rotation < 0) {
        // reset
        newX = transformPosition[0][2];
        newY = transformPosition[1][2];

        // center
        if (lineHorizontalAlign === Alignments.CENTER) {
          newY += ySin * (nodeHeight / 2 - halfGroupHeight);
          newX -= yCos * (nodeHeight / 2 - halfGroupHeight);
        }
        // top
        else if (lineHorizontalAlign === Alignments.TOP) {
          newY -= ySin * (halfGroupHeight - LINE_OFFSET + line.strokeWeight);
          newX += yCos * (halfGroupHeight - LINE_OFFSET + line.strokeWeight);
        }
        // bottom
        else {
          newY += ySin * (nodeHeight - halfGroupHeight - LINE_OFFSET);
          newX -= yCos * (nodeHeight - halfGroupHeight - LINE_OFFSET);
        }
      }
    }
    // vertical line position
    else {
      if (lineVerticalAlign === Alignments.CENTER) {
        newX += (nodeWidth - group.width) / 2 + line.strokeWeight / 2;
      } else if (lineVerticalAlign === Alignments.RIGHT) {
        newX += nodeWidth - group.width / 2 - LINE_OFFSET + line.strokeWeight;
      }
      // LEFT
      else {
        newX -= group.width / 2 - LINE_OFFSET;
      }

      // check if element is rotated
      if (node.rotation > 0 || node.rotation < 0) {
        // reset
        newX = transformPosition[0][2];
        newY = transformPosition[1][2];

        // center
        if (lineVerticalAlign === Alignments.CENTER) {
          newY -= (xSin * (nodeWidth - group.width)) / 2;
          newX += (xCos * (nodeWidth - group.width)) / 2;
        }
        // right
        else if (lineVerticalAlign === Alignments.RIGHT) {
          newY -=
            xSin *
            (nodeWidth - halfGroupWidth - LINE_OFFSET + line.strokeWeight);
          newX +=
            xCos *
            (nodeWidth - halfGroupWidth - LINE_OFFSET + line.strokeWeight);
        }
        // left
        else {
          newY += xSin * (halfGroupWidth - LINE_OFFSET);
          newX -= xCos * (halfGroupWidth - LINE_OFFSET);
        }
      }
    }

    transformPosition = [
      [
        xCos, // cos
        xSin, // sin
        newX,
      ],
      [
        yCos, // -sin
        ySin, // cos
        newY,
      ],
    ];

    group.relativeTransform = transformPosition;

    return group;
  }
  return null;
}

function getSelectionArray(): NodeSelection[] {
  return figma.currentPage.selection.map((node) => {
    let data = {};

    try {
      data = JSON.parse(node.getPluginData('data'));
    } catch {
      data = {};
    }

    const spacings = Object.keys(getSpacing(node)).length;

    return {
      id: node.id,
      type: node.type,
      padding: getPadding(node),
      hasSpacing: spacings > 0 && figma.currentPage.selection.length === 1,
      data,
    };
  });
}

export const sendSelection = () =>
  EventEmitter.emit('selection', getSelectionArray());

const cleanOrphanNodes = () => {
  const group = getGlobalGroup();

  if (group) {
    for (const node of group.children) {
      const foundNode = figma.getNodeById(node.getPluginData('parent'));
      const foundPaddingNode = figma.getNodeById(
        JSON.parse(node.getPluginData('padding-parent') || '{}').parentId
      );

      if (!foundNode && !node.getPluginData('connected') && !foundPaddingNode) {
        node.remove();
      }
    }
  }
};

const removeAllMeasurementConnections = () => {
  const group = getGlobalGroup();

  if (group) {
    for (const node of group.children) {
      const foundNode = figma.getNodeById(node.getPluginData('parent'));
      const spacingConnectedNodes = JSON.parse(
        node.getPluginData('connected') || '[]'
      );

      if (spacingConnectedNodes.length > 0) {
        for (const spacingConnectedNode of spacingConnectedNodes.map(
          (id: string) => figma.getNodeById(id)
        )) {
          if (spacingConnectedNode) {
            spacingConnectedNode.setPluginData('spacing', '');
          }
        }
      }

      if (foundNode) {
        foundNode.setPluginData('data', '');
      }

      node.remove();
    }
  }

  const previousSelection = figma.currentPage.selection;
  figma.currentPage.selection = [];
  setTimeout(() => (figma.currentPage.selection = previousSelection), 100);
};

let changeInterval;
let previousSelection;

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

EventEmitter.answer('get visibility', async () => {
  const group = getGlobalGroup();

  return group ? group.visible : true;
});

EventEmitter.on('toggle visibility', () => {
  const group = getGlobalGroup();

  if (group) {
    group.visible = !group.visible;
  }
});

EventEmitter.answer('current selection', async () => getSelectionArray());

EventEmitter.on('remove all measurements', () =>
  removeAllMeasurementConnections()
);

EventEmitter.on('set measurements', async (store: ExchangeStoreValues) =>
  setMeasurements(store)
);

const setMeasurements = async (store?: ExchangeStoreValues) => {
  cleanOrphanNodes();

  let data: PluginNodeData = {};

  const settings = {
    ...store,
  };

  for (const node of figma.currentPage.selection) {
    if (isNodeInsideGlobalGroup(node)) {
      continue;
    }

    let surrounding: SurroundingSettings = store.surrounding;

    try {
      data = JSON.parse(node.getPluginData('data') || '{}');
      node.setPluginData('data', '{}');

      if (
        data.surrounding &&
        Object.keys(data.surrounding).length > 0 &&
        !store.surrounding
      ) {
        surrounding = data.surrounding;
      }
    } catch {
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
    // spacing
    const spacing = getSpacing(node);
    if (Object.keys(spacing).length > 0) {
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

    // Padding
    const padding = getPadding(node);
    if (padding) {
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
            addToGlobalGroup(paddingLine);
          }
        });
    }

    if (!surrounding || Object.keys(surrounding).length === 0) {
      continue;
    }

    const connectedNodes = [];

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

    node.setPluginData(
      'data',
      JSON.stringify({
        surrounding,
        connectedNodes: connectedNodes.map(({ id }) => id),
        version: VERSION,
      } as PluginNodeData)
    );

    if (connectedNodes.length > 0) {
      const group = nodeGroup(node);

      if (group) {
        connectedNodes.forEach((n) => {
          group.appendChild(n);
        });
        addToGlobalGroup(group);
      } else {
        const measureGroup = figma.group(connectedNodes, figma.currentPage);
        measureGroup.expanded = false;
        measureGroup.name = `📏 ${node.name}`;

        measureGroup.setPluginData('parent', node.id);
        addToGlobalGroup(measureGroup);
      }
    }
  }
};

function createFill(
  node: SceneNode,
  { fill, opacity, color }: { fill: FillTypes; opacity: number; color: string }
) {
  if (
    node.type !== 'SLICE' &&
    node.type !== 'STICKY' &&
    node.type !== 'CONNECTOR' &&
    node.type !== 'STAMP' &&
    node.type !== 'SHAPE_WITH_TEXT'
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

    // lock node, because covers the measured node
    cloneNode.locked = true;

    return cloneNode;
  } else {
    figma.notify('Slices are currently not supported.');
  }
}

(async function main() {
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
})();
