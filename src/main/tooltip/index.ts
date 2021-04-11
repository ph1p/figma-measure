import { SetTooltipOptions, TooltipPositions } from '../../shared/interfaces';
import { solidColor, hexToRgb } from '../helper';

import addNode from './types';

function createArrow(tooltipFrame, settings, { horizontal, vertical }) {
  const arrowFrame = figma.createFrame();
  const arrow = figma.createRectangle();

  const bg = hexToRgb(settings.backgroundColor);

  const ARROW_WIDTH = settings.fontSize;
  const ARROW_HEIGHT = settings.fontSize;
  const FRAME_WIDTH = ARROW_WIDTH / 2;

  // frame
  arrowFrame.name = 'Arrow';
  arrowFrame.resize(FRAME_WIDTH, ARROW_HEIGHT);
  arrowFrame.x -= FRAME_WIDTH;
  arrowFrame.y = tooltipFrame.height / 2 - ARROW_HEIGHT / 2;
  arrowFrame.fills = [];

  // arrow
  arrow.resize(ARROW_WIDTH, ARROW_HEIGHT);
  arrow.fills = [].concat(solidColor(bg.r, bg.g, bg.b));
  arrow.x = 0;
  arrow.y = arrowFrame.height / 2;
  arrow.rotation = 45;

  if (horizontal === TooltipPositions.LEFT) {
    arrowFrame.rotation = 180;
    arrowFrame.x += tooltipFrame.width + ARROW_WIDTH;
    arrowFrame.y = tooltipFrame.height / 2 + ARROW_HEIGHT / 2;
  }

  if (vertical === TooltipPositions.TOP) {
    arrowFrame.rotation = 90;
    arrowFrame.x = tooltipFrame.width / 2 - ARROW_WIDTH / 2;
    arrowFrame.y = tooltipFrame.height + ARROW_HEIGHT / 2;
  }

  if (vertical === TooltipPositions.BOTTOM) {
    arrowFrame.rotation = -90;
    arrowFrame.x = tooltipFrame.width / 2 + ARROW_WIDTH / 2;
    arrowFrame.y = -(ARROW_HEIGHT / 2);
  }

  arrowFrame.appendChild(arrow);

  return arrowFrame;
}

function getTooltipFrame(node): FrameNode {
  let tooltipFrame;

  if (!tooltipFrame) {
    tooltipFrame = figma.createFrame();
  }
  tooltipFrame.expanded = false;
  tooltipFrame.name = `Tooltip ${node.name}`;
  tooltipFrame.clipsContent = false;
  tooltipFrame.fills = [];

  return tooltipFrame;
}

export async function setTooltip(options: SetTooltipOptions, specificNode = null) {
  const data = {
    vertical: undefined,
    horizontal: undefined,
    backgroundColor: '#ffffff',
    fontColor: '#000000',
    fontSize: 11,
    ...options,
  };

  switch (options.position) {
    case TooltipPositions.TOP:
    case TooltipPositions.BOTTOM:
      data.vertical = options.position;
      break;
    case TooltipPositions.LEFT:
    case TooltipPositions.RIGHT:
      data.horizontal = options.position;
      break;
    default:
      return;
  }

  if (figma.currentPage.selection.length === 1 || specificNode) {
    const node: SceneNode = specificNode || figma.currentPage.selection[0];

    if (node.type === 'BOOLEAN_OPERATION' || node.type === 'SLICE') {
      figma.notify('This type of element is not supported');
      return;
    }

    const tooltipFrame = getTooltipFrame(node);
    const contentFrame = figma.createFrame();
    tooltipFrame.appendChild(contentFrame);

    // auto-layout
    contentFrame.layoutMode = 'VERTICAL';
    contentFrame.cornerRadius = 7;
    contentFrame.paddingTop = 12;
    contentFrame.paddingBottom = 12;
    contentFrame.paddingLeft = 10;
    contentFrame.paddingRight = 10;
    contentFrame.itemSpacing = 3;
    contentFrame.counterAxisSizingMode = 'AUTO';

    // background
    const bg = hexToRgb(data.backgroundColor);
    contentFrame.backgrounds = [].concat(solidColor(bg.r, bg.g, bg.b));

    //-----

    switch (node.type) {
      case 'GROUP':
      case 'INSTANCE':
      case 'COMPONENT':
      case 'VECTOR':
      case 'STAR':
      case 'LINE':
      case 'ELLIPSE':
      case 'FRAME':
      case 'POLYGON':
      case 'RECTANGLE':
      case 'TEXT':
        await addNode(contentFrame, node, data);
        break;
      default:
        tooltipFrame.remove();
        break;
    }

    // ----

    const arrow = createArrow(contentFrame, data, {
      horizontal: data.horizontal,
      vertical: data.vertical,
    });

    if (arrow) {
      tooltipFrame.appendChild(arrow);
    }

    tooltipFrame.resize(contentFrame.width, contentFrame.height);

    // ----
    let y = node.height / 2 - contentFrame.height / 2;

    switch (data.vertical) {
      case TooltipPositions.TOP:
        y = (contentFrame.height + data.offset) * -1;
        break;
      case TooltipPositions.BOTTOM:
        y = node.height + data.offset;
        break;
    }

    let x = node.width / 2 - contentFrame.width / 2;

    switch (data.horizontal) {
      case TooltipPositions.LEFT:
        x = (contentFrame.width + data.offset) * -1;
        break;
      case TooltipPositions.RIGHT:
        x = node.width + data.offset;
        break;
    }

    // shadow
    tooltipFrame.effects = [].concat({
      offset: {
        x: tooltipFrame.x,
        y: tooltipFrame.y + 2,
      },
      visible: true,
      blendMode: 'NORMAL',
      type: 'DROP_SHADOW',
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 0.1,
      },
      radius: 4,
    });

    const transformPosition = node.absoluteTransform;

    const xCos = transformPosition[0][0];
    const xSin = transformPosition[0][1];

    const yCos = transformPosition[1][0];
    const ySin = transformPosition[1][1];

    tooltipFrame.relativeTransform = [
      [xCos, xSin, xCos * x + xSin * y + transformPosition[0][2]],
      [yCos, ySin, yCos * x + ySin * y + transformPosition[1][2]],
    ];

    return tooltipFrame;
  } else {
    figma.notify('Please select only one element');
  }
}
