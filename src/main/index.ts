import './store';
import { hexToRgb, solidColor } from './helper';
import { tooltipPluginDataByNode, setTooltip } from './tooltip';

import FigmaMessageEmitter from '../shared/FigmaMessageEmitter';
import {
  Alignments,
  FillTypes,
  LineParameterTypes,
  PluginNodeData,
  Store,
} from '../shared/interfaces';
import { VERSION } from '../shared/constants';
import { drawSpacing } from './spacing';

figma.showUI(__html__, {
  width: 285,
  height: 300,
  visible: figma.command !== 'relaunch',
});

figma.root.setRelaunchData({
  open: '',
});

FigmaMessageEmitter.on('draw spacing', (settings) => {
  drawSpacing(settings);
});

const nodeGroup = (node) =>
  (figma.currentPage.findOne(
    (currentNode) => currentNode.getPluginData('parent') === node.id
  ) as FrameNode) || null;

export const getPluginData = (node, name) => {
  const data = node.getPluginData(name);
  if (!data) {
    return null;
  }

  return JSON.parse(data);
};

// // const getAllMeasurements = () => {};

// // const updateMeasurementsOfNode = (node) => {};

const getLineFrame = (node, data) => {
  const name = 'line';
  const lineFrame = figma.createFrame();

  lineFrame.name = name;
  lineFrame.resize(
    data.isHorizontal ? node.width : data.labelWidth,
    data.isHorizontal ? data.labelHeight : node.height
  );
  lineFrame.backgrounds = [];
  lineFrame.clipsContent = false;

  // set plugin data
  // const lineData = {
  //   parent: node.id,
  //   nodeId: lineFrame.id,
  // };

  lineFrame.expanded = false;
  // lineFrame.setPluginData(name, JSON.stringify(lineData));

  return lineFrame;
};

const getColor = (color: string) => {
  if (color) {
    const { r, g, b } = hexToRgb(color);
    return solidColor(r, g, b);
  } else {
    return solidColor();
  }
};

const createLine = (options) => {
  const {
    node,
    direction = 'horizontal',
    // name = 'Group',
    txtVerticalAlign = Alignments.CENTER,
    txtHorizontalAlign = Alignments.CENTER,
    lineVerticalAlign = Alignments.LEFT,
    lineHorizontalAlign = Alignments.BOTTOM,
    strokeCap = 'NONE',
    offset = 3,
    unit = '',
    color = '',
    labels = true,
  }: LineParameterTypes = options;

  const LINE_OFFSET = offset * -1;

  const mainColor = getColor(color);

  const isHorizontal = direction === 'horizontal';

  const nodeHeight = node.height;
  const nodeWidth = node.width;

  const heightOrWidth = isHorizontal ? nodeWidth : nodeHeight;

  if (heightOrWidth > 0.01) {
    // needed elements
    const line = figma.createVector();

    const paddingTopBottom = 3;
    const paddingLeftRight = 5;

    // margin for top and bottom
    const DIRECTION_MARGIN = 5;

    // LABEL
    let labelFrame;

    if (labels) {
      const label = figma.createText();

      label.characters = `${parseFloat(heightOrWidth.toString()).toFixed(0)}${
        unit && ' ' + unit
      }`;
      label.fontName = {
        family: 'Inter',
        style: 'Bold',
      };
      label.fontSize = 10;
      label.fills = [].concat(solidColor(255, 255, 255));

      // LABEL RECT
      labelFrame = figma.createFrame();
      labelFrame.cornerRadius = 3;

      labelFrame.layoutMode = 'HORIZONTAL';
      labelFrame.horizontalPadding = paddingLeftRight;
      labelFrame.verticalPadding = paddingTopBottom;
      labelFrame.counterAxisSizingMode = 'AUTO';
      labelFrame.x = label.x - paddingLeftRight / 2;
      labelFrame.y = label.y - paddingTopBottom / 2;
      labelFrame.fills = [].concat(mainColor);

      labelFrame.appendChild(label);
      labelFrame.name = 'label';
    }

    // GROUP
    const group = getLineFrame(node, {
      isHorizontal,
      alignment: isHorizontal ? lineHorizontalAlign : lineVerticalAlign,
      labelWidth: labelFrame ? labelFrame.width : 7,
      labelHeight: labelFrame ? labelFrame.height : 7,
    });

    group.appendChild(line);
    // const group = figma.group(lineNodes, node.parent);

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
    // const boxLeft = paddingLeftRight / 2;

    // place text group
    if (labels) {
      if (isHorizontal) {
        labelFrame.x = 0;
        labelFrame.y += boxTop + nodeHeight - LINE_OFFSET - line.strokeWeight;

        // vertical text align
        if (txtVerticalAlign === Alignments.CENTER) {
          labelFrame.y = 0;
        } else if (txtVerticalAlign === Alignments.BOTTOM) {
          labelFrame.y += DIRECTION_MARGIN;
        } else if (txtVerticalAlign === Alignments.TOP) {
          labelFrame.y -= labelFrame.height + DIRECTION_MARGIN;
        }

        // horizontal text align
        if (txtHorizontalAlign === Alignments.CENTER) {
          labelFrame.x = nodeWidth / 2 - labelFrame.width / 2;
        } else if (txtHorizontalAlign === Alignments.LEFT) {
          labelFrame.x -=
            nodeWidth / 2 - labelFrame.width / 2 - DIRECTION_MARGIN;
        } else if (txtHorizontalAlign === Alignments.RIGHT) {
          labelFrame.x +=
            nodeWidth / 2 - labelFrame.width / 2 - DIRECTION_MARGIN;
        }
      } else {
        labelFrame.x = 0;
        labelFrame.y += boxTop;

        // vertical text align
        if (txtVerticalAlign === Alignments.CENTER) {
          labelFrame.y += nodeHeight / 2 - labelFrame.height / 2;
        } else if (txtVerticalAlign === Alignments.BOTTOM) {
          labelFrame.y += nodeHeight - labelFrame.height - DIRECTION_MARGIN;
        } else if (txtVerticalAlign === Alignments.TOP) {
          labelFrame.y += DIRECTION_MARGIN;
        }

        // vertical text align
        if (txtHorizontalAlign === Alignments.CENTER) {
          labelFrame.x = 0;
          // labelFrame.x = (labelFrame.width / 2) + LINE_OFFSET;
        } else if (txtHorizontalAlign === Alignments.LEFT) {
          labelFrame.x -= labelFrame.width + DIRECTION_MARGIN;
        } else if (txtHorizontalAlign === Alignments.RIGHT) {
          labelFrame.x += DIRECTION_MARGIN;
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
};

const isValidShape = (node) =>
  node.type === 'RECTANGLE' ||
  node.type === 'ELLIPSE' ||
  node.type === 'GROUP' ||
  node.type === 'TEXT' ||
  node.type === 'STAR' ||
  node.type === 'VECTOR' ||
  node.type === 'FRAME' ||
  node.type === 'INSTANCE' ||
  node.type === 'COMPONENT' ||
  node.type === 'POLYGON';

// async function createLineFromMessage({
//   direction,
//   align = Alignments.CENTER,
//   strokeCap = 'ARROW_LINES',
//   alignSecond = null,
// }) {
//   const nodes = [];

//   for (const node of figma.currentPage.selection) {
//     if (isValidShape(node)) {
//       if (direction === 'vertical' || direction === 'both') {
//         const verticalLine = await createLine({
//           node,
//           direction: 'vertical',
//           strokeCap,
//           name: 'vertical line ' + align.toLowerCase(),
//           lineVerticalAlign: Alignments[align],
//         });

//         if (verticalLine) {
//           nodes.push(verticalLine);
//         }
//       }

//       if (direction === 'horizontal' || direction === 'both') {
//         const horizontalLine = await createLine({
//           node,
//           direction: 'horizontal',
//           strokeCap,
//           name: 'horizontal line ' + align.toLowerCase(),
//           lineHorizontalAlign: alignSecond
//             ? Alignments[alignSecond]
//             : Alignments[align],
//         });

//         if (horizontalLine) {
//           nodes.push(horizontalLine);
//         }
//       }

//       if (nodes.length > 0) {
//         const group = nodeGroup(node);

//         if (group) {
//           nodes.forEach((n) => {
//             group.appendChild(n);
//           });
//         } else {
//           const measureGroup = figma.group(nodes, figma.currentPage);
//           measureGroup.locked = true;
//           measureGroup.expanded = false;
//           measureGroup.name = `📐 Measurements | ${node.name}`;

//           measureGroup.setPluginData('parent', node.id);
//         }
//       }
//     }
//   }
// }

const setAngleInCanvas = () => {
  for (const node of figma.currentPage.selection) {
    if (Math.floor(node.rotation) !== 0) {
      const rect = figma.createRectangle();
      const text = figma.createText();
      const angleFrame = figma.createFrame();

      angleFrame.appendChild(rect);
      angleFrame.appendChild(text);

      text.fontSize = 10;
      text.characters = Math.floor(node.rotation) + '°';
      text.fills = [].concat(solidColor(255, 0, 0));
      text.textAlignHorizontal = 'CENTER';
      text.fontName = {
        family: 'Inter',
        style: 'Bold',
      };

      const textWidth = text.width + text.width / 2;

      angleFrame.resize(textWidth, textWidth);
      angleFrame.backgrounds = [];
      angleFrame.name = 'angle';

      //rect
      rect.resize(textWidth, textWidth);
      rect.strokes = [].concat(solidColor(255, 0, 0));
      rect.fills = [].concat([
        {
          ...solidColor(255, 0, 0),
          opacity: 0,
        },
      ]);

      text.resize(rect.width, text.height);
      text.y = rect.height / 2 - text.height / 2;
      text.x += 2;

      let transformPosition = node.absoluteTransform;

      const newX = transformPosition[0][2];
      const newY = transformPosition[1][2];

      const xCos = transformPosition[0][0];
      const xSin = transformPosition[0][1];

      const yCos = transformPosition[1][0];
      const ySin = transformPosition[1][1];

      // group
      const group = nodeGroup(node);

      if (group) {
        group.appendChild(angleFrame);
      } else {
        const group = figma.group([angleFrame], figma.currentPage);
        group.locked = true;
        group.expanded = false;
        group.name = `📐 Measurements | ${node.name}`;
        group.setPluginData('parent', node.id);
      }

      transformPosition = [
        [xCos, xSin, newX],
        [yCos, ySin, newY],
      ];

      angleFrame.relativeTransform = transformPosition;
    }
  }
};

const getSelectionArray = () =>
  figma.currentPage.selection.map((node) => {
    let data = {};

    try {
      data = JSON.parse(node.getPluginData('data'));
    } catch {
      data = {};
    }

    return {
      id: node.id,
      type: node.type,
      tooltipData: tooltipPluginDataByNode(node),
      data,
      // tooltipData: node,
    };
  });

const sendSelection = () =>
  FigmaMessageEmitter.emit('selection', getSelectionArray());

(async function main() {
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
})();

// events
figma.on('selectionchange', () => {
  console.log(figma.currentPage.selection);
  sendSelection();
});

// function iterateOverFile(node, cb) {
//   if ('children' in node) {
//     if (node.type !== 'INSTANCE') {
//       cb(node);
//       for (const child of node.children) {
//         cb(child);
//         iterateOverFile(child, cb);
//       }
//     }
//   }
// }

// const sendStorageData = async (key) => {
//   const data = await figma.clientStorage.getAsync(key);

//   figma.ui.postMessage({
//     type: key,
//     data,
//   });
// };

FigmaMessageEmitter.on('resize', ({ width, height }) =>
  figma.ui.resize(width, height)
);

FigmaMessageEmitter.answer('current selection', async () =>
  getSelectionArray()
);

FigmaMessageEmitter.on('set measurements', (store: Partial<Store>) => {
  const node = figma.currentPage.selection[0];

  let data: PluginNodeData = {};

  try {
    data = JSON.parse(node.getPluginData('data'));
    node.setPluginData('data', '{}');
  } catch {}

  if (data?.connectedNodes?.length) {
    data.connectedNodes.map((id) => {
      const node = figma.getNodeById(id);
      if (node) {
        node.remove();
      }
    });
  }

  let connectedNodes = [];

  if (store.surrounding.center) {
    const fillNode = createFill(node, {
      fill: store.fill,
      dashDistance: store.dashDistance,
      color: store.color,
    });

    if (fillNode) {
      connectedNodes.push(fillNode);
    }
  }

  if (store.surrounding.tooltip) {
    const tooltip = setTooltip(
      {
        flags: store.tooltip,
        unit: store.unit,
        distance: store.strokeOffset + 6,
        position: store.surrounding.tooltip,
      },
      node
    );

    if (tooltip) {
      connectedNodes.push(tooltip);
    }
  }

  const strokeSettings = {
    strokeCap: store.strokeCap,
    offset: store.strokeOffset,
    unit: store.unit,
    color: store.color,
    labels: store.labels,
  };

  if (store.surrounding.rightBar) {
    connectedNodes.push(
      createLine({
        ...strokeSettings,
        node,
        direction: 'vertical',
        name: 'vertical line ' + Alignments.RIGHT.toLowerCase(),
        lineVerticalAlign: Alignments.RIGHT,
      })
    );
  }

  if (store.surrounding.leftBar) {
    connectedNodes.push(
      createLine({
        ...strokeSettings,
        node,
        direction: 'vertical',
        name: 'vertical line ' + Alignments.LEFT.toLowerCase(),
        lineVerticalAlign: Alignments.LEFT,
      })
    );
  }

  if (store.surrounding.topBar) {
    connectedNodes.push(
      createLine({
        ...strokeSettings,
        node,
        direction: 'horizontal',
        name: 'horizontal line ' + Alignments.TOP.toLowerCase(),
        lineHorizontalAlign: Alignments.TOP,
      })
    );
  }

  if (store.surrounding.bottomBar) {
    connectedNodes.push(
      createLine({
        ...strokeSettings,
        node,
        direction: 'horizontal',
        name: 'horizontal line ' + Alignments.BOTTOM.toLowerCase(),
        lineHorizontalAlign: Alignments.BOTTOM,
      })
    );
  }

  if (store.surrounding.horizontalBar) {
    connectedNodes.push(
      createLine({
        ...strokeSettings,
        node,
        direction: 'horizontal',
        name: 'horizontal line ' + Alignments.CENTER.toLowerCase(),
        lineHorizontalAlign: Alignments.CENTER,
      })
    );
  }

  if (store.surrounding.verticalBar) {
    connectedNodes.push(
      createLine({
        ...strokeSettings,
        node,
        direction: 'vertical',
        name: 'vertical line ' + Alignments.CENTER.toLowerCase(),
        lineVerticalAlign: Alignments.CENTER,
      })
    );
  }

  console.log({ connectedNodes });
  node.setPluginData(
    'data',
    JSON.stringify({
      connectedNodes: connectedNodes.map(({ id }) => id),
      surrounding: store.surrounding,
      version: VERSION,
    } as PluginNodeData)
  );

  if (connectedNodes.length > 0) {
    const group = nodeGroup(node);

    if (group) {
      connectedNodes.forEach((n) => {
        group.appendChild(n);
      });
    } else {
      const measureGroup = figma.group(connectedNodes, figma.currentPage);
      measureGroup.locked = true;
      measureGroup.expanded = false;
      measureGroup.name = `📐 Measurements | ${node.name}`;

      measureGroup.setPluginData('parent', node.id);
    }
  }
});

const createFill = (
  node: SceneNode,
  {
    fill,
    dashDistance,
    color,
  }: { fill: FillTypes; dashDistance: number; color: string }
) => {
  if (node.type !== 'SLICE' && node.type !== 'GROUP') {
    const cloneNode = node.clone();
    cloneNode.fills = [];
    cloneNode.strokes = [];

    const { r, g, b } = hexToRgb(color);

    switch (fill) {
      case 'dashed':
        cloneNode.dashPattern = [dashDistance];
        cloneNode.strokes = [].concat(solidColor(r, g, b));
        cloneNode.strokeWeight = 1;
        break;
      case 'fill':
        cloneNode.fills = [].concat({
          ...solidColor(r, g, b),
          opacity: 0.3,
        });
        break;
      case 'fill-stroke':
        cloneNode.strokes = [].concat(solidColor(r, g, b));
        cloneNode.strokeWeight = 1;

        cloneNode.fills = [].concat({
          ...solidColor(r, g, b),
          opacity: 0.3,
        });
        break;
      case 'stroke':
        cloneNode.strokes = [].concat(solidColor(r, g, b));
        cloneNode.strokeWeight = 1;
        break;
    }

    return cloneNode;
  }
};

//@ts-ignore
const bla = async (message) => {
  if (figma.command === 'relaunch') {
    for (const node of figma.currentPage.selection) {
      if (isValidShape(node)) {
        // await setTooltipWithData({}, node);
      }
    }
    figma.closePlugin();
  } else {
    // storage
    if (message.storage) {
      const { action: key, payload: value } = message;

      figma.clientStorage.setAsync(key, value);
    } else {
      switch (message.action) {
        case 'init':
          const tooltipSettings = await figma.clientStorage.getAsync(
            'tooltip-settings'
          );

          figma.ui.postMessage({
            type: 'init',
            selection: getSelectionArray(),
            tooltipSettings,
          });
          break;
        case 'tooltip':
          // await setTooltipWithData(message.payload);
          break;
        case 'angle':
          setAngleInCanvas();
          break;
        case 'line':
          // createLineFromMessage(message.payload);
          break;
        case 'line-preset':
          // const { direction, strokeCap } = message.payload;

          // if (direction === 'left-bottom') {
          //   createLineFromMessage({
          //     direction: 'both',
          //     strokeCap,
          //     align: Alignments.LEFT,
          //     alignSecond: Alignments.BOTTOM,
          //   });
          // } else if (direction === 'left-top') {
          //   createLineFromMessage({
          //     direction: 'both',
          //     strokeCap,
          //     align: Alignments.LEFT,
          //     alignSecond: Alignments.TOP,
          //   });
          // } else if (direction === 'right-bottom') {
          //   createLineFromMessage({
          //     direction: 'both',
          //     strokeCap,
          //     align: Alignments.RIGHT,
          //     alignSecond: Alignments.BOTTOM,
          //   });
          // } else {
          //   createLineFromMessage({
          //     direction: 'both',
          //     strokeCap,
          //     align: Alignments.RIGHT,
          //     alignSecond: Alignments.TOP,
          //   });
          // }

          break;
        case 'cancel':
          figma.closePlugin();
          break;
      }
    }
  }
};
