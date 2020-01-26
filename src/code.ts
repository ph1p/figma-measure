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
    const line = figma.createVector();
    const label = figma.createText();

    const paddingTopBottom = 3;
    const paddingLeftRight = 5;

    // margin for top and bottom
    const DIRECTION_MARGIN = 5;

    const lineNodes = [line];

    // LABEL
    label.characters = `${parseFloat(heightOrWidth.toString()).toFixed(0)}`;
    label.fontName = {
      family: 'Inter',
      style: 'Bold'
    };
    label.fontSize = 10;
    label.fills = [].concat(solidColor(255, 255, 255));

    // LABEL RECT
    const labelFrame = figma.createFrame();
    labelFrame.cornerRadius = 3;

    labelFrame.layoutMode = 'HORIZONTAL';
    labelFrame.horizontalPadding = paddingLeftRight;
    labelFrame.verticalPadding = paddingTopBottom;
    labelFrame.counterAxisSizingMode = 'AUTO';
    labelFrame.x = label.x - paddingLeftRight / 2;
    labelFrame.y = label.y - paddingTopBottom / 2;
    labelFrame.fills = [].concat(solidColor());

    labelFrame.appendChild(label);
    labelFrame.name = 'label';

    // GROUP
    const group = figma.createFrame();
    group.name = name;
    group.resize(
      isHorizontal ? nodeWidth : labelFrame.width,
      isHorizontal ? labelFrame.height : nodeHeight
    );
    group.backgrounds = [];
    group.clipsContent = false;
    lineNodes.forEach(ln => group.appendChild(ln));
    // const group = figma.group(lineNodes, node.parent);

    // add label frame
    group.appendChild(labelFrame);

    // LINE
    line.x = isHorizontal ? 0 : group.width / 2 - line.strokeWeight / 2;
    line.y = isHorizontal ? group.height / 2 + line.strokeWeight / 2 : 0;

    line.vectorPaths = [
      {
        windingRule: 'NONE',
        // M x y L x y Z is close
        data: isHorizontal
          ? `M 0 0 L ${node.height} 0 Z`
          : `M 0 0 L 0 ${node.width} Z`
      }
    ];

    line.strokes = [].concat(solidColor());
    line.resize(isHorizontal ? node.width : 1, isHorizontal ? 1 : node.height);

    const measureLineWidth = Math.abs(LINE_OFFSET) * 2 + line.strokeWeight;

    if (strokeCap === 'STANDARD') {
      if (measureLineWidth >= 0.01) {
        const firstMeasureLine = figma.createLine();
        const secondMeasureLine = figma.createLine();

        group.appendChild(firstMeasureLine);
        group.appendChild(secondMeasureLine);

        firstMeasureLine.strokes = [].concat(solidColor());
        secondMeasureLine.strokes = [].concat(solidColor());
        firstMeasureLine.resize(measureLineWidth, 0);
        secondMeasureLine.resize(measureLineWidth, 0);

        if (!isHorizontal) {
          firstMeasureLine.x =
            group.width / 2 - measureLineWidth / 2 - line.strokeWeight / 2;
          firstMeasureLine.y += 1;

          secondMeasureLine.x =
            group.width / 2 - measureLineWidth / 2 - line.strokeWeight / 2;
          secondMeasureLine.y += nodeHeight;
        } else {
          firstMeasureLine.rotation = 90;
          firstMeasureLine.x += 1;
          firstMeasureLine.y =
            group.height - measureLineWidth / 2 - line.strokeWeight;

          secondMeasureLine.rotation = 90;
          secondMeasureLine.x += nodeWidth;
          secondMeasureLine.y =
            group.height - measureLineWidth / 2 - line.strokeWeight;
        }
      }
    } else {
      line.strokeCap = strokeCap as StrokeCap;
    }

    // x, y for text box
    const boxTop = paddingTopBottom / 2;
    const boxLeft = paddingLeftRight / 2;

    // place text group
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
        labelFrame.x -= nodeWidth / 2 - labelFrame.width / 2 - DIRECTION_MARGIN;
      } else if (txtHorizontalAlign === Alignments.RIGHT) {
        labelFrame.x += nodeWidth / 2 - labelFrame.width / 2 - DIRECTION_MARGIN;
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
        style: 'Bold'
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
          opacity: 0
        }
      ]);

      text.resize(rect.width, text.height);
      text.y = rect.height / 2 - text.height / 2;
      text.x += 2;

      let transformPosition = node.absoluteTransform;

      let newX = transformPosition[0][2];
      let newY = transformPosition[1][2];

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
        group.name = `📐 Measurements | ${node.name}`;
        group.setPluginData('parent', node.id);
      }

      transformPosition = [
        [xCos, xSin, newX],
        [yCos, ySin, newY]
      ];

      angleFrame.relativeTransform = transformPosition;
    }
  }
};

const createTooltipTextNode = () => {
  const text = figma.createText();

  text.fontName = {
    family: 'Inter',
    style: 'Regular'
  };
  text.textAlignHorizontal = 'LEFT';
  text.fills = [].concat(solidColor(255, 255, 255));

  return text;
};

const setTooltip = async () => {
  if (figma.currentPage.selection.length === 1) {
    await figma.loadFontAsync({
      family: 'Inter',
      style: 'Regular'
    });

    const PADDING = 12;
    const node = figma.currentPage.selection[0];

    // ----

    const tooltipFrame = figma.createFrame();
    tooltipFrame.name = 'Tooltip ' + node.name;
    tooltipFrame.layoutMode = 'VERTICAL';
    tooltipFrame.cornerRadius = 3;
    tooltipFrame.horizontalPadding = PADDING;
    tooltipFrame.verticalPadding = PADDING;
    tooltipFrame.itemSpacing = PADDING;
    tooltipFrame.counterAxisSizingMode = 'AUTO';

    // ----

    const tooltipContent = createTooltipTextNode();

    switch (node.type) {
      case 'SLICE':
      case 'FRAME':
      case 'GROUP':
      case 'COMPONENT':
      case 'INSTANCE':
      case 'BOOLEAN_OPERATION':
      case 'VECTOR':
      case 'STAR':
      case 'LINE':
      case 'ELLIPSE':
      case 'POLYGON':
      case 'RECTANGLE':
        tooltipContent.characters += `Height: ${node.height}`;
        tooltipContent.characters += `Width: ${node.width}`;

        tooltipFrame.appendChild(tooltipContent);
        break;
      case 'TEXT':
        console.log(node);
        const fontFamily = (node.fontName as FontName).family;
        const fontStyle = (node.fontName as FontName).style;
        const fontSize = node.fontSize.toString();

        tooltipContent.characters += `Opacity: ${node.opacity}\n`;

        // Font
        tooltipContent.characters += `Font-Size: ${fontSize}\n`;
        tooltipContent.characters += `Font-Family: ${fontFamily}\n`;
        tooltipContent.characters += `Font-Style: ${fontStyle}`;

        let chars = 0;
        for (const line of tooltipContent.characters.split('\n')) {
          if (line && ~line.indexOf(':')) {
            const [label] = line.split(':');

            tooltipContent.setRangeFontName(chars, chars + label.length + 1, {
              family: 'Inter',
              style: 'Bold'
            });
            chars += line.length + 1;
          }
        }

        // Fills
        const fillsTextNode = createTooltipTextNode();

        if (node.fills) {
          fillsTextNode.characters += `Fills\n\n`;
          (node.fills as any[]).map(f => {
            const opacity = f.opacity === 1 ? 1 : f.opacity.toFixed(2);

            fillsTextNode.characters += `rgb(${f.color.r.toFixed(
              2
            )}, ${f.color.g.toFixed(2)}, ${f.color.b.toFixed(2)}, ${opacity})`;
          });
        }

        tooltipFrame.appendChild(tooltipContent);
        tooltipFrame.appendChild(fillsTextNode);

        break;
    }

    // ----

    // tooltipFrame.resize(50, 50);
    tooltipFrame.backgrounds = [].concat(solidColor(255, 0, 0));

    // ----
    // const tooltipGroup = figma.group([tooltipFrame], figma.currentPage);

    let transformPosition = node.absoluteTransform;

    let newX = transformPosition[0][2];
    let newY = transformPosition[1][2];

    let vertical = 'top'; // top, bottom, center
    let horizontal = 'left'; // left, right, center

    switch (vertical) {
      case 'top':
        newY -= tooltipFrame.height + PADDING;
        break;
      case 'center':
        newY += node.height / 2 - tooltipFrame.height / 2;
        break;
      case 'bottom':
        newY += node.height + PADDING;
        break;
    }

    switch (horizontal) {
      case 'left':
        newX -= tooltipFrame.width + PADDING;
        break;
      case 'center':
        newX += node.width / 2 - tooltipFrame.width / 2;
        break;
      case 'right':
        newX += node.width + PADDING;
        break;
    }

    const xCos = transformPosition[0][0];
    const xSin = transformPosition[0][1];

    const yCos = transformPosition[1][0];
    const ySin = transformPosition[1][1];

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

    tooltipFrame.relativeTransform = transformPosition;
  } else {
    figma.notify('Please select only one element');
  }
};

const sendSelection = () =>
  figma.ui.postMessage({
    type: 'selection',
    data: figma.currentPage.selection.length > 0
  });

main().then(() => {
  sendSelection();

  // events
  figma.on('selectionchange', sendSelection);

  figma.ui.onmessage = async message => {
    if (message.action === 'line-offset') {
      await figma.clientStorage.setAsync('line-offset', message.options.value);
    }

    if (message.action === 'tooltip') {
      setTooltip();
    }

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
