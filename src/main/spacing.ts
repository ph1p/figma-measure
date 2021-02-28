export const drawSpacing = ({ color = '', labels = '', unit = '' }) => {
  if (figma.currentPage.selection.length !== 2) {
    return;
  }

  const spacingGroup = [];

  const rects = figma.currentPage.selection;

  const x1 = rects[0].x;
  const y1 = rects[0].y;

  const x2 = rects[1].x;
  const y2 = rects[1].y;

  const centerX1 = rects[0].x + rects[0].width / 2;
  const centerY1 = rects[0].y + rects[0].height / 2;

  const centerX2 = rects[1].x + rects[1].width / 2;
  const centerY2 = rects[1].y + rects[1].height / 2;

  const w1 = rects[0].width;
  const w2 = rects[1].width;

  const h1 = rects[0].height;
  const h2 = rects[1].height;

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
    // ctx.beginPath();

    let yellowX1, yellowX2, yellowY1, yellowY2;

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

    yellowY1 = centerY2 + (h2 / 2) * (horizontalDirection === 'top' ? 1 : -1);

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
    spacingGroup.push(line1);
  }

  if (!cutsHorizontalRectPoints && !cutsVerticalRectPoints) {
    // brown
    let brownX1, brownX2, brownY1, brownY2;
    brownX1 = verticalDirection === 'left' ? x1 : x1 + w1;
    brownX2 = centerX2;
    brownY1 = centerY1 + (h1 / 2) * (horizontalDirection === 'top' ? -1 : 1);
    brownY2 = horizontalDirection === 'top' ? y1 : y1 + h1;

    const line2 = figma.createVector();
    line2.vectorPaths = [
      {
        windingRule: 'EVENODD',
        data: `M ${brownX1} ${brownY1} L ${brownX2} ${brownY2}`,
      },
    ];
    spacingGroup.push(line2);

    // purple

    let purpleX1, purpleX2, purpleY1, purpleY2;
    purpleX1 = brownX1;
    purpleY1 = brownY1;
    purpleX2 = purpleX1;
    purpleY2 = centerY2;

    const line3 = figma.createVector();
    line3.vectorPaths = [
      {
        windingRule: 'EVENODD',
        data: `M ${purpleX1} ${purpleY1} L ${purpleX2} ${purpleY2}`,
      },
    ];
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
    spacingGroup.push(line4);
  }

  if (spacingGroup.length > 0) {
    const group = figma.group(spacingGroup, figma.currentPage);
    group.locked = true;
    group.expanded = false;

    const id = rects.map((rect) => rect.id).join('-');
    const spacingData = JSON.parse(figma.root.getPluginData('spacing') || '{}');

    if (spacingData[id]) {
      try {
        figma.getNodeById(spacingData[id]).remove();
      } catch {}
    }

    figma.root.setPluginData(
      'spacing',
      JSON.stringify({
        ...spacingData,
        [id]: group.id,
      })
    );
  }
};
