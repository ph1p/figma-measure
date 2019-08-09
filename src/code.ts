figma.showUI(__html__, {
  width: 180,
  height: 500
});

const GROUP_NAME = '📐 Measurements';

enum Alignments {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER'
}

interface LineParameterTypes {
  left: number;
  top: number;
  node: SceneNode;
  direction: string;
  name: string;
  txtVerticalAlign: Alignments;
  txtHorizontalAlign: Alignments;
  lineVerticalAlign: Alignments;
  lineHorizontalAlign: Alignments;
  strokeCap: string;
}

const solidColor = (r = 255, g = 0, b = 0) => ({
  type: 'SOLID',
  color: {
    r: r / 255,
    g: g / 255,
    b: b / 255
  }
});

const nodeGroup = node =>
  (figma.currentPage.findOne(
    currentNode => currentNode.getPluginData('parent') === node.id
  ) as FrameNode) || null;

const createLine = async options => {
  let {
    node,
    direction = 'horizontal',
    name = 'Group',
    txtVerticalAlign = Alignments.CENTER,
    txtHorizontalAlign = Alignments.CENTER,
    lineVerticalAlign = Alignments.LEFT,
    lineHorizontalAlign = Alignments.BOTTOM,
    strokeCap = 'NONE'
  }: LineParameterTypes = options;

  const LINE_OFFSET = -3;

  const isHorizontal = direction === 'horizontal';

  let nodeHeight = node.height;
  let nodeWidth = node.width;

  const heightOrWidth = isHorizontal ? nodeWidth : nodeHeight;

  if (heightOrWidth > 0.01) {
    // needed elements
    const line = figma.createLine();
    const rect = figma.createRectangle();
    const label = figma.createText();

    const paddingTopBottom = 5;
    const paddingLeftRight = 10;

    // margin for top and bottom
    const DIRECTION_MARGIN = 5;

    const lineNodes = [line];

    // LINE
    line.rotation = isHorizontal ? 0 : 90;

    line.x = !isHorizontal ? LINE_OFFSET : 0;
    line.y = nodeHeight - (isHorizontal ? LINE_OFFSET : 0);

    line.strokes = [].concat(solidColor());

    line.resize(heightOrWidth, 0);

    if (strokeCap === 'STANDARD') {
      const measureLineWidth = Math.abs(LINE_OFFSET) * 2 + line.strokeWeight;
      if (measureLineWidth >= 0.01) {
        const firstMeasureLine = figma.createLine();
        const secondMeasureLine = figma.createLine();

        lineNodes.push(firstMeasureLine);
        lineNodes.push(secondMeasureLine);

        firstMeasureLine.strokes = [].concat(solidColor());
        secondMeasureLine.strokes = [].concat(solidColor());
        firstMeasureLine.resize(measureLineWidth, 0);
        secondMeasureLine.resize(measureLineWidth, 0);

        if (!isHorizontal) {
          firstMeasureLine.x -= measureLineWidth;
          firstMeasureLine.y += 1;

          secondMeasureLine.x -= measureLineWidth;
          secondMeasureLine.y += nodeHeight;
        } else {
          firstMeasureLine.rotation = 90;
          firstMeasureLine.x += 1;
          firstMeasureLine.y += nodeHeight + Math.abs(LINE_OFFSET) * 2;

          secondMeasureLine.rotation = 90;
          secondMeasureLine.x += nodeWidth;
          secondMeasureLine.y += nodeHeight + Math.abs(LINE_OFFSET) * 2;
        }
      }
    } else {
      line.strokeCap = strokeCap as StrokeCap;
    }

    // LABEL
    label.characters = `${parseFloat(heightOrWidth.toString()).toFixed(0)}`;
    label.fontName = {
      family: 'Inter',
      style: 'Bold'
    };
    label.fontSize = 10;

    label.fills = [].concat(solidColor(255, 255, 255));

    // RECTANGLE
    rect.x = label.x - paddingLeftRight / 2;
    rect.y = label.y - paddingTopBottom / 2;
    rect.cornerRadius = 3;
    rect.resize(
      label.width + paddingLeftRight,
      label.height + paddingTopBottom
    );
    rect.fills = [].concat(solidColor());

    // grouping
    const group = figma.group(lineNodes, node.parent);
    group.name = name;

    const textGroup = figma.group([label, rect], group);
    textGroup.name = 'label';

    // x, y for text box
    const boxTop = paddingTopBottom / 2;
    const boxLeft = paddingLeftRight / 2;

    // place text group
    if (isHorizontal) {
      textGroup.x += boxLeft + nodeWidth / 2 - textGroup.width / 2;
      textGroup.y += boxTop + nodeHeight - LINE_OFFSET - line.strokeWeight;

      // vertical text align
      if (txtVerticalAlign === Alignments.CENTER) {
        textGroup.y -= textGroup.height / 2;
      } else if (txtVerticalAlign === Alignments.BOTTOM) {
        textGroup.y += DIRECTION_MARGIN;
      } else if (txtVerticalAlign === Alignments.TOP) {
        textGroup.y -= textGroup.height + DIRECTION_MARGIN;
      }

      // horizontal text align
      if (txtHorizontalAlign === Alignments.CENTER) {
        textGroup.x += 0;
      } else if (txtHorizontalAlign === Alignments.LEFT) {
        textGroup.x -= nodeWidth / 2 - textGroup.width / 2 - DIRECTION_MARGIN;
      } else if (txtHorizontalAlign === Alignments.RIGHT) {
        textGroup.x += nodeWidth / 2 - textGroup.width / 2 - DIRECTION_MARGIN;
      }
    } else {
      textGroup.x += boxLeft + LINE_OFFSET;
      textGroup.y += boxTop;

      // vertical text align
      if (txtVerticalAlign === Alignments.CENTER) {
        textGroup.y += nodeHeight / 2 - textGroup.height / 2;
      } else if (txtVerticalAlign === Alignments.BOTTOM) {
        textGroup.y += nodeHeight - textGroup.height - DIRECTION_MARGIN;
      } else if (txtVerticalAlign === Alignments.TOP) {
        textGroup.y += DIRECTION_MARGIN;
      }

      // vertical text align
      if (txtHorizontalAlign === Alignments.CENTER) {
        textGroup.x -= textGroup.width / 2;
      } else if (txtHorizontalAlign === Alignments.LEFT) {
        textGroup.x -= textGroup.width + DIRECTION_MARGIN;
      } else if (txtHorizontalAlign === Alignments.RIGHT) {
        textGroup.x += DIRECTION_MARGIN;
      }
    }

    // line position
    const halfGroupHeight = group.height / 2;
    const halfGroupWidth = group.width / 2;

    let transformPosition =
      node[(nodeGroup(node) ? 'absolute' : 'relative') + 'Transform'];
    let newX = transformPosition[0][2];
    let newY = transformPosition[1][2];

    const xCos = transformPosition[0][0];
    const xSin = transformPosition[0][1];

    const yCos = transformPosition[1][0];
    const ySin = transformPosition[1][1];

    // horizonzal line position
    if (isHorizontal) {
      if (lineHorizontalAlign === Alignments.CENTER) {
        newY += (nodeHeight - group.height) / 2;
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
        newX += (nodeWidth - group.width) / 2;
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
        newX
      ],
      [
        yCos, // -sin
        ySin, // cos
        newY
      ]
    ];

    group.relativeTransform = transformPosition;

    return group;
  }
  return null;
};

async function main() {
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
}

const isValidShape = node =>
  node.type === 'RECTANGLE' ||
  node.type === 'ELLIPSE' ||
  node.type === 'GROUP' ||
  node.type === 'TEXT' ||
  node.type === 'VECTOR' ||
  node.type === 'FRAME' ||
  node.type === 'COMPONENT' ||
  node.type === 'INSTANCE' ||
  node.type === 'POLYGON';

async function createLineFromMessage({
  direction,
  align = Alignments.CENTER,
  strokeCap = 'ARROW_LINES',
  alignSecond = null
}) {
  const nodes = [];

  for (const node of figma.currentPage.selection) {
    if (isValidShape(node)) {
      if (direction === 'vertical' || direction === 'both') {
        const verticalLine = await createLine({
          node,
          direction: 'vertical',
          strokeCap,
          name: 'vertical line ' + align.toLowerCase(),
          lineVerticalAlign: Alignments[align]
        });

        if (verticalLine) {
          nodes.push(verticalLine);
        }
      }

      if (direction === 'horizontal' || direction === 'both') {
        const horizontalLine = await createLine({
          node,
          direction: 'horizontal',
          strokeCap,
          name: 'horizontal line ' + align.toLowerCase(),
          lineHorizontalAlign: alignSecond
            ? Alignments[alignSecond]
            : Alignments[align]
        });

        if (horizontalLine) {
          nodes.push(horizontalLine);
        }
      }

      if (nodes.length > 0) {
        const group = nodeGroup(node);

        if (group) {
          nodes.forEach(n => {
            group.appendChild(n);
          });
        } else {
          const measureGroup = figma.group(nodes, figma.currentPage);
          measureGroup.name = `📐 Measurements | ${node.name}`;

          measureGroup.setPluginData('parent', node.id);
        }
      }
    }
  }
}

const setAngleInCanvas = () => {
  for (const node of figma.currentPage.selection) {
    if (Math.floor(node.rotation) !== 0) {
      const ellipse = figma.createEllipse();
      const text = figma.createText();
      const angleFrame = figma.createFrame();

      angleFrame.appendChild(ellipse);
      angleFrame.appendChild(text);

      text.fontSize = 10;
      text.characters = Math.floor(node.rotation) + '°';
      text.fills = [].concat(solidColor(255, 255, 255));
      text.textAlignHorizontal = 'CENTER';
      text.fontName = {
        family: 'Inter',
        style: 'Bold'
      };

      const textWidth = text.width + text.width / 2;

      angleFrame.resize(textWidth, textWidth);
      angleFrame.backgrounds = [];

      //ellipse
      ellipse.resize(textWidth, textWidth);
      ellipse.fills = [].concat(solidColor(255, 0, 0));

      text.resize(ellipse.width, text.height);
      text.y = ellipse.height / 2 - text.height / 2;
      text.x += 2;

      let transformPosition = node.absoluteTransform;

      let newX = transformPosition[0][2];
      let newY = transformPosition[1][2];

      const xCos = transformPosition[0][0];
      const xSin = transformPosition[0][1];

      const yCos = transformPosition[1][0];
      const ySin = transformPosition[1][1];

      // group
      const group = figma.group([angleFrame], figma.currentPage);
      group.name = `📐 Measurements | ${node.name}`;
      group.setPluginData('parent', node.id);

      newY -= xSin * node.height - group.width;
      newX += xCos * node.height - group.width;

      transformPosition = [[xCos, xSin, newX], [yCos, ySin, newY]];

      group.relativeTransform = transformPosition;
    }
  }
};

main().then(() => {
  figma.ui.onmessage = async message => {
    if (message.action === 'line-offset') {
      await figma.clientStorage.setAsync('line-offset', message.options.value);
    }

    figma.ui.postMessage({
      type: 'selection',
      data: figma.currentPage.selection.length > 0
    });

    if (message.action === 'angle') {
      setAngleInCanvas();
    }

    if (message.action === 'line') {
      const { direction, strokeCap, align } = message.options;

      createLineFromMessage({
        direction,
        strokeCap,
        align
      });
    }

    if (message.action === 'line-preset') {
      const { direction, strokeCap } = message.options;

      if (direction === 'left-bottom') {
        createLineFromMessage({
          direction: 'both',
          strokeCap,
          align: Alignments.LEFT,
          alignSecond: Alignments.BOTTOM
        });
      } else if (direction === 'left-top') {
        createLineFromMessage({
          direction: 'both',
          strokeCap,
          align: Alignments.LEFT,
          alignSecond: Alignments.TOP
        });
      } else if (direction === 'right-bottom') {
        createLineFromMessage({
          direction: 'both',
          strokeCap,
          align: Alignments.RIGHT,
          alignSecond: Alignments.BOTTOM
        });
      } else {
        createLineFromMessage({
          direction: 'both',
          strokeCap,
          align: Alignments.RIGHT,
          alignSecond: Alignments.TOP
        });
      }
    }

    if (message.type === 'cancel') {
      figma.closePlugin();
    }
  };
});
