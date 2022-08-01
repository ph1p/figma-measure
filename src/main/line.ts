import { findAndReplaceNumberPattern } from '../shared/helpers';
import { Alignments, LineParameterTypes } from '../shared/interfaces';
import Line from '../views/Home/components/Viewer/components/Line';

import { getColor, solidColor } from './helper';

export const createLabel = ({
  baseNode,
  text,
  color,
  isVertical,
  labelFontSize = 10,
}: {
  baseNode?: SceneNode;
  text: string;
  color: unknown;
  isVertical?: boolean;
  labelFontSize?: number;
}) => {
  const labelFrame = figma.createFrame();
  const label = figma.createText();

  label.characters = text;
  label.fontName = {
    family: 'Inter',
    style: 'Bold',
  };
  label.fontSize = labelFontSize;
  label.fills = [].concat(solidColor(255, 255, 255));

  labelFrame.appendChild(label);
  labelFrame.name = 'label';

  // LABEL RECT
  labelFrame.cornerRadius = 3;

  labelFrame.layoutMode = 'HORIZONTAL';
  labelFrame.paddingLeft = (6 * labelFontSize) / 10;
  labelFrame.paddingRight = (6 * labelFontSize) / 10;
  labelFrame.paddingTop = (3 * labelFontSize) / 10;
  labelFrame.paddingBottom = (3 * labelFontSize) / 10;
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
};

export const getLineFrame = (node, data) => {
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
};

export const createStandardCapForSpacing = ({
  line,
  height,
  width,
  mainColor,
  isHorizontal = false,
  isFirst = false,
}) => {
  const transformPosition = line.absoluteTransform;
  const lineX = transformPosition[0][2];
  const lineY = transformPosition[1][2];

  const strokeCapWidth = line.strokeWeight + 6;

  const strokeCapLine = figma.createLine();
  strokeCapLine.relativeTransform = transformPosition;
  strokeCapLine.strokeWeight = line.strokeWeight;
  strokeCapLine.strokes = [].concat(mainColor);
  strokeCapLine.resize(strokeCapWidth, 0);

  if (!isHorizontal) {
    if (isFirst) {
      strokeCapLine.x = lineX - strokeCapWidth / 2;
      strokeCapLine.y += strokeCapLine.strokeWeight;
    } else {
      strokeCapLine.x = lineX - strokeCapWidth / 2;
      strokeCapLine.y += height;
    }
  } else {
    if (isFirst) {
      strokeCapLine.rotation = 90;
      strokeCapLine.x += strokeCapLine.strokeWeight;
      strokeCapLine.y = lineY + strokeCapWidth / 2;
    } else {
      strokeCapLine.rotation = 90;
      strokeCapLine.x += width;
      strokeCapLine.y = lineY + strokeCapWidth / 2;
    }
  }

  return strokeCapLine;
};

export const createStandardCap = ({
  group,
  line,
  isHorizontal,
  height,
  width,
  mainColor,
}) => {
  const firstMeasureLine = figma.createLine();
  const secondMeasureLine = figma.createLine();
  firstMeasureLine.strokeWeight = line.strokeWeight;
  secondMeasureLine.strokeWeight = line.strokeWeight;

  group.appendChild(firstMeasureLine);
  group.appendChild(secondMeasureLine);

  const strokeCapWidth = line.strokeWeight + 6;

  firstMeasureLine.strokes = [].concat(mainColor);
  secondMeasureLine.strokes = [].concat(mainColor);
  firstMeasureLine.resize(strokeCapWidth, 0);
  secondMeasureLine.resize(strokeCapWidth, 0);

  if (!isHorizontal) {
    firstMeasureLine.x = line.x - strokeCapWidth / 2;
    firstMeasureLine.y += firstMeasureLine.strokeWeight;

    secondMeasureLine.x = line.x - strokeCapWidth / 2;
    secondMeasureLine.y += height;
  } else {
    firstMeasureLine.rotation = 90;
    firstMeasureLine.x += firstMeasureLine.strokeWeight;
    firstMeasureLine.y = line.y + strokeCapWidth / 2;

    secondMeasureLine.rotation = 90;
    secondMeasureLine.x += width;
    secondMeasureLine.y = line.y + strokeCapWidth / 2;
  }

  if (isHorizontal) {
    firstMeasureLine.constraints = {
      vertical: 'CENTER',
      horizontal: 'MIN',
    };
    secondMeasureLine.constraints = {
      vertical: 'CENTER',
      horizontal: 'MAX',
    };
  } else {
    firstMeasureLine.constraints = {
      vertical: 'MIN',
      horizontal: 'CENTER',
    };
    secondMeasureLine.constraints = {
      vertical: 'MAX',
      horizontal: 'CENTER',
    };
  }
};

export const createLine = (options) => {
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
    labelFontSize = 10,
  }: LineParameterTypes = options;

  const LINE_OFFSET = strokeOffset * -1;
  const LABEL_OUTSIDE_MARGIN = 4 * (labelFontSize / 10);

  const mainColor = getColor(color);

  const isHorizontal = direction === 'horizontal';

  const nodeHeight = node.height;
  const nodeWidth = node.width;

  const heightOrWidth = isHorizontal ? nodeWidth : nodeHeight;

  if (heightOrWidth > 0.01) {
    // needed elements
    const line = figma.createVector();

    // LABEL
    let labelFrame;
    const alignment = isHorizontal ? lineHorizontalAlign : lineVerticalAlign;

    if (labels) {
      labelFrame = createLabel({
        labelFontSize,
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

    if (isHorizontal) {
      line.constraints = {
        vertical: 'CENTER',
        horizontal: 'STRETCH',
      };
    } else {
      line.constraints = {
        vertical: 'STRETCH',
        horizontal: 'CENTER',
      };
    }

    // add label frame
    if (labelFrame) {
      labelFrame.constraints = {
        vertical: 'CENTER',
        horizontal: 'CENTER',
      };
      group.appendChild(labelFrame);
    }

    // LINE
    line.strokeWeight = labelFontSize / 10;
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
    line.resize(
      isHorizontal ? node.width : line.strokeWeight,
      isHorizontal ? line.strokeWeight : node.height
    );

    // STROKE CAP
    if (strokeCap === 'STANDARD') {
      createStandardCap({
        group,
        line,
        isHorizontal,
        mainColor,
        width: nodeWidth,
        height: nodeHeight,
      });
    } else {
      line.strokeCap = strokeCap as StrokeCap;
    }

    line.handleMirroring = 'ANGLE_AND_LENGTH';

    // place text group
    if (labels) {
      if (isHorizontal) {
        labelFrame.x = 0;
        labelFrame.y += nodeHeight - LINE_OFFSET - line.strokeWeight;

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
};
