import EventEmitter from '../shared/EventEmitter';
import { findAndReplaceNumberPattern } from '../shared/helpers';

import { addToGlobalGroup } from './measure-group';

import { createLabel, getColor } from '.';

export const getSpacing = (node: SceneNode) =>
  JSON.parse(node.getPluginData('spacing') || '{}');

export const setSpacing = (node: SceneNode, data: unknown) =>
  node.setPluginData('spacing', JSON.stringify(data));

EventEmitter.on('remove spacing', () => {
  for (const node of figma.currentPage.selection) {
    const spacing = getSpacing(node);

    for (const connectedNodeId of Object.keys(spacing)) {
      // check if group exists
      const group = figma.getNodeById(spacing[connectedNodeId]);

      delete spacing[connectedNodeId];
      setSpacing(node, spacing);
      try {
        group.remove();
      } catch {
        console.log('could not remove group');
      }

      // get connected node
      const foundConnectedNode = figma.getNodeById(
        connectedNodeId
      ) as unknown as SceneNode;

      // node removed
      if (foundConnectedNode) {
        // check connected node group
        const connectedNodeSpacing = getSpacing(foundConnectedNode);
        delete connectedNodeSpacing[node.id];
        setSpacing(foundConnectedNode, connectedNodeSpacing);
      }
    }
  }
});

EventEmitter.on('draw spacing', (settings) => {
  const rects = figma.currentPage.selection as SceneNode[];

  if (rects.length === 2) {
    drawSpacing(rects, settings);
  } else {
    figma.notify('Please select exactly two elements.');
  }
});

export const distanceBetweenTwoPoints = (x1, y1, x2, y2) =>
  Math.floor(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const getShapeValues = (shape: SceneNode) => {
  const transformPosition = shape.absoluteTransform;
  const x = transformPosition[0][2];
  const y = transformPosition[1][2];

  const w = shape.width;
  const h = shape.height;

  const cx = x + w / 2;
  const cy = y + h / 2;

  return {
    x,
    y,
    w,
    h,
    cx,
    cy,
  };
};

export const drawSpacing = (
  rects: SceneNode[],
  { color = '', labels = true, labelPattern = '', labelsOutside = false }
) => {
  const LABEL_OUTSIDE_MARGIN = 4;

  if (rects.length !== 2) {
    return;
  }

  if (rects.some((rect) => Math.abs(Math.round(rect.rotation)) !== 0)) {
    figma.notify('Rotated elements are currently not supported.');
    return;
  }

  const spacingData1 = JSON.parse(rects[0].getPluginData('spacing') || '{}');
  const spacingData2 = JSON.parse(rects[1].getPluginData('spacing') || '{}');

  if (spacingData1[rects[1].id]) {
    try {
      figma.getNodeById(spacingData1[rects[1].id]).remove();
    } catch {
      console.log('Could not remove spacing node');
    }
  }

  const mainColor = getColor(color);

  const spacingGroup = [];

  const {
    x: x1,
    y: y1,
    w: w1,
    h: h1,
    cx: centerX1,
    cy: centerY1,
  } = getShapeValues(rects[1]);

  const {
    x: x2,
    y: y2,
    w: w2,
    h: h2,
    cx: centerX2,
    cy: centerY2,
  } = getShapeValues(rects[0]);

  let verticalDirection = 'center';
  let horizontalDirection = 'center';

  let isLeftCenter = false;
  let isRightCenter = false;
  let cutsVerticalRectPoints = false;

  if (centerX2 - x1 < 0) {
    isLeftCenter = true;
  } else if (centerX2 - x1 > w1) {
    isRightCenter = true;
  }

  if (x2 + w2 < x1) {
    verticalDirection = 'left';
  } else if (centerX2 - w2 / 2 > x1 + w1) {
    verticalDirection = 'right';
  } else {
    cutsVerticalRectPoints = true;
  }
  // watch if the rect is in horizontal center position
  if (x2 < centerX1 && x2 + w2 > centerX1) {
    verticalDirection = 'center';
  }

  let cutsHorizontalRectPoints = false;
  let isTopCenter = false;
  let isBottomCenter = false;

  if (centerY2 - y1 < 0) {
    isTopCenter = true;
  } else if (centerY2 - y1 > h1) {
    isBottomCenter = true;
  }

  if (y2 + h2 < y1) {
    horizontalDirection = 'top';
  } else if (centerY2 - h2 / 2 > y1 + h1) {
    horizontalDirection = 'bottom';
  } else {
    cutsHorizontalRectPoints = true;
  }

  // watch if the rect is in horizontal center position
  if (y2 < centerY1 && y2 + h2 > centerY1) {
    horizontalDirection = 'center';
  }

  // yellow
  if (!cutsHorizontalRectPoints) {
    let yellowX1, yellowX2, yellowY2;

    // point1
    const widthOfOverlappingRectLeft = Math.abs(x1 - (x2 + w2)) / 2;
    const widthOfOverlappingRectRight = Math.abs(x1 + w1 - x2) / 2;

    if (isLeftCenter && widthOfOverlappingRectLeft <= w1) {
      yellowX1 = x2 + w2 - widthOfOverlappingRectLeft;
    } else if (isRightCenter && widthOfOverlappingRectRight <= w1) {
      yellowX1 = x2 + widthOfOverlappingRectRight;
    } else {
      yellowX1 = centerX1;
    }

    const yellowY1 =
      centerY2 + (h2 / 2) * (horizontalDirection === 'top' ? 1 : -1);

    // outside
    if (!cutsVerticalRectPoints || (!isLeftCenter && !isRightCenter)) {
      yellowX1 = centerX2;
    }

    // point2
    if (cutsVerticalRectPoints) {
      yellowX2 = yellowX1;
      yellowY2 = centerY1 + (h1 / 2) * (horizontalDirection === 'top' ? -1 : 1);
    } else {
      yellowX2 = centerX2;
      yellowY2 = horizontalDirection === 'top' ? y1 : y1 + h1;
    }

    const line1 = figma.createVector();

    line1.vectorPaths = [
      {
        windingRule: 'EVENODD',
        data: `M ${yellowX1} ${yellowY1} L ${yellowX2} ${yellowY2}`,
      },
    ];
    line1.strokes = [].concat(mainColor);
    spacingGroup.push(line1);

    if (labels) {
      const label = createLabel({
        baseNode: line1,
        text: findAndReplaceNumberPattern(
          labelPattern,
          distanceBetweenTwoPoints(yellowX1, yellowY1, yellowX2, yellowY2)
        ),
        color: mainColor,
        isVertical: true,
      });

      if (labelsOutside) {
        label.x +=
          (label.width / 2 + LABEL_OUTSIDE_MARGIN) *
          (verticalDirection === 'left' ? -1 : 1);
      }

      spacingGroup.push(label);
    }
  }

  if (!cutsHorizontalRectPoints && !cutsVerticalRectPoints) {
    // brown
    const brownX1 = verticalDirection === 'left' ? x1 : x1 + w1;
    const brownX2 = centerX2;
    const brownY1 =
      centerY1 + (h1 / 2) * (horizontalDirection === 'top' ? -1 : 1);
    const brownY2 = horizontalDirection === 'top' ? y1 : y1 + h1;

    const line2 = figma.createVector();

    line2.vectorPaths = [
      {
        windingRule: 'EVENODD',
        data: `M ${brownX1} ${brownY1} L ${brownX2} ${brownY2}`,
      },
    ];
    line2.strokes = [].concat(mainColor);
    line2.dashPattern = [4];
    spacingGroup.push(line2);

    // purple
    const purpleX1 = brownX1;
    const purpleY1 = brownY1;
    const purpleX2 = purpleX1;
    const purpleY2 = centerY2;

    const line3 = figma.createVector();

    line3.vectorPaths = [
      {
        windingRule: 'EVENODD',
        data: `M ${purpleX1} ${purpleY1} L ${purpleX2} ${purpleY2}`,
      },
    ];
    line3.strokes = [].concat(mainColor);
    line3.dashPattern = [4];
    spacingGroup.push(line3);
  }

  // blue
  if (!cutsVerticalRectPoints) {
    let blueX1, blueX2, blueY1, blueY2;

    if (verticalDirection === 'left') {
      blueX1 = x2 + w2;
    } else if (verticalDirection === 'right') {
      blueX1 = x2;
    }

    const heightOfOverlappingRectTop = Math.abs(y2 + h2 - y1) / 2;
    const heightOfOverlappingRectBottom = Math.abs(y1 + h1 - y2) / 2;

    if (isTopCenter && heightOfOverlappingRectTop <= h1) {
      blueY1 = y2 + h2 - heightOfOverlappingRectTop;
    } else if (isBottomCenter && heightOfOverlappingRectBottom <= h1) {
      blueY1 = centerY2 - h2 / 2 + heightOfOverlappingRectBottom;
    } else {
      blueY1 = centerY1;
    }

    if (!cutsHorizontalRectPoints || (!isTopCenter && !isBottomCenter)) {
      blueX1 = centerX2 + (w2 / 2) * (verticalDirection === 'right' ? -1 : 1);
      blueY1 = centerY2;
    }

    if (cutsHorizontalRectPoints) {
      if (verticalDirection === 'left') {
        blueX2 = x1;
        blueY2 = blueY1;

        if (!isTopCenter && !isBottomCenter) {
          blueX2 = centerX1 - w1 / 2;
          blueY2 = centerY2;
        }
      } else if (verticalDirection === 'right') {
        blueX2 = x1 + w1;
        blueY2 = blueY1;

        if (!isTopCenter && !isBottomCenter) {
          blueY2 = centerY2;
        }
      }
    } else {
      blueX2 = verticalDirection === 'left' ? x1 : x1 + w1;
      blueY2 = centerY2;
    }

    const line4 = figma.createVector();

    line4.vectorPaths = [
      {
        windingRule: 'EVENODD',
        data: `M ${blueX1} ${blueY1} L ${blueX2} ${blueY2}`,
      },
    ];
    line4.strokes = [].concat(mainColor);
    spacingGroup.push(line4);

    if (labels) {
      const label = createLabel({
        baseNode: line4,
        text: findAndReplaceNumberPattern(
          labelPattern,
          distanceBetweenTwoPoints(blueX1, blueY1, blueX2, blueY2)
        ),
        color: mainColor,
        isVertical: false,
      });

      if (labelsOutside) {
        label.y +=
          (label.height / 2 + LABEL_OUTSIDE_MARGIN) *
          (horizontalDirection === 'top' ? -1 : 1);
      }

      spacingGroup.push(label);
    }
  }

  if (spacingGroup.length > 0) {
    const group = figma.group(spacingGroup, figma.currentPage);
    group.locked = true;
    group.expanded = false;
    group.name = `spacing ${rects[0].name} - ${rects[1].name}`;

    group.setPluginData(
      'connected',
      JSON.stringify(rects.map((rect) => rect.id))
    );

    rects[0].setPluginData(
      'spacing',
      JSON.stringify({
        ...spacingData1,
        [rects[1].id]: group.id,
      })
    );

    rects[1].setPluginData(
      'spacing',
      JSON.stringify({
        ...spacingData2,
        [rects[0].id]: group.id,
      })
    );

    addToGlobalGroup(group);
  }
};
