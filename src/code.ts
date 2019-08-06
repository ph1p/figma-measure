figma.showUI(__html__, {
  // visible: false
  width: 180,
  height: 255
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

const createLine = options => {
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

  // needed elements
  const line = figma.createLine();
  const rect = figma.createRectangle();
  const label = figma.createText();

  const paddingTopBottom = 5;
  const paddingLeftRight = 10;

  const isHorizontal = direction === 'horizontal';
  const heightOrWidth = isHorizontal ? 'width' : 'height';

  // margin for top and bottom
  const DIRECTION_MARGIN = 5;

  const LINE_OFFSET = -3;

  const lineNodes = [line];

  // LINE
  line.rotation = isHorizontal ? 0 : 90;

  line.x = !isHorizontal ? LINE_OFFSET : 0;
  line.y = node.height - (isHorizontal ? LINE_OFFSET : 0);

  line.strokes = [].concat(solidColor());

  line.resize(node[heightOrWidth], 0);

  if (strokeCap === 'STANDARD') {
    const measureLineWidth = Math.abs(LINE_OFFSET) * 2 + line.strokeWeight;
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
      secondMeasureLine.y += node.height;
    } else {
      firstMeasureLine.rotation = 90;
      firstMeasureLine.x += 1;
      firstMeasureLine.y += node.height + Math.abs(LINE_OFFSET) * 2;

      secondMeasureLine.rotation = 90;
      secondMeasureLine.x += node.width;
      secondMeasureLine.y += node.height + Math.abs(LINE_OFFSET) * 2;
    }
  } else {
    line.strokeCap = strokeCap as StrokeCap;
  }

  // LABEL
  label.characters = `${node[heightOrWidth]}`;
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
  rect.resize(label.width + paddingLeftRight, label.height + paddingTopBottom);
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
    textGroup.x += boxLeft + node.width / 2 - textGroup.width / 2;
    textGroup.y += boxTop + node.height - LINE_OFFSET - line.strokeWeight;

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
      textGroup.x -= node.width / 2 - textGroup.width / 2 - DIRECTION_MARGIN;
    } else if (txtHorizontalAlign === Alignments.RIGHT) {
      textGroup.x += node.width / 2 - textGroup.width / 2 - DIRECTION_MARGIN;
    }
  } else {
    textGroup.x += boxLeft + LINE_OFFSET;
    textGroup.y += boxTop;

    // vertical text align
    if (txtVerticalAlign === Alignments.CENTER) {
      textGroup.y += node.height / 2 - textGroup.height / 2;
    } else if (txtVerticalAlign === Alignments.BOTTOM) {
      textGroup.y += node.height - textGroup.height - DIRECTION_MARGIN;
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
  let transformPosition = node.relativeTransform;

  // horizonzal line position
  if (isHorizontal) {
    let newY = transformPosition[1][2];

    if (lineHorizontalAlign === Alignments.CENTER) {
      newY += (node.height - group.height) / 2;
    } else if (lineHorizontalAlign === Alignments.TOP) {
      newY -= group.height / 2 - LINE_OFFSET + line.strokeWeight;
    }
    // BOTTOM
    else {
      newY += node.height - group.height / 2 - LINE_OFFSET;
    }

    transformPosition = [[1, 0, transformPosition[0][2]], [0, 1, newY]];
  }
  // vertical line position
  else {
    let newX = transformPosition[0][2];

    if (lineVerticalAlign === Alignments.CENTER) {
      newX += (node.width - group.width) / 2;
    } else if (lineVerticalAlign === Alignments.RIGHT) {
      newX += node.width - group.width / 2 - LINE_OFFSET + line.strokeWeight;
    }
    // LEFT
    else {
      newX -= group.width / 2 - LINE_OFFSET;
    }

    transformPosition = [[1, 0, newX], [0, 1, transformPosition[1][2]]];
  }

  group.relativeTransform = transformPosition;
  group.locked = true;
  group.name = 'measurements-' + node.name;

  return group;
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
  node.type === 'FRAME';

function createLineFromMessage({
  direction,
  align = Alignments.CENTER,
  strokeCap = 'ARROW_LINES'
}) {
  const nodes = [];

  for (const node of figma.currentPage.selection) {
    if (isValidShape(node)) {
      if (direction === 'vertical') {
        const verticalLine = createLine({
          node,
          direction,
          strokeCap,
          name: 'vertical line',
          lineVerticalAlign: Alignments[align]
        });

        nodes.push(verticalLine);
      }

      if (direction === 'horizontal') {
        const horizontalLine = createLine({
          node,
          direction,
          strokeCap,
          name: 'horizontal line',
          lineHorizontalAlign: Alignments[align]
        });

        nodes.push(horizontalLine);
      }

      const measureGroup = figma.group(nodes, figma.currentPage);
      measureGroup.name = `📐 Measurements | ${nodes.length} Node${
        nodes.length > 1 ? 's' : ''
      }`;
    }
  }
}

main().then(() => {
  figma.ui.onmessage = message => {
    if (message.action === 'line') {
      createLineFromMessage({
        direction: message.options.direction,
        align: message.options.align,
        strokeCap: message.options.strokeCap
      });
    }

    if (message.type === 'cancel') {
      figma.closePlugin();
    } else {
    }
  };
});
