import { solidColor, hexToRgb } from '../helper';
import { TOOLTIP_DEFAULT_SETTINGS } from '../../shared';
import { addTextSection } from './sections/text';
import { addRectSection } from './sections/rect';
import { addDefaultSection } from './sections/default';
interface TooltipPluginData {
  id: any;
  nodeId: any;
  directions: {
    horizontal: string;
    vertical: string;
  };
}

const createArrow = (tooltipFrame, settings, { horizontal, vertical }) => {
  if (
    ((horizontal === 'LEFT' || horizontal === 'RIGHT') &&
      vertical === 'BOTTOM') ||
    ((horizontal === 'LEFT' || horizontal === 'RIGHT') && vertical === 'TOP')
  ) {
    return;
  }

  const arrowFrame = figma.createFrame();
  const arrow = figma.createRectangle();

  const bg = hexToRgb(settings.backgroundColor);
  const stroke = hexToRgb(settings.strokeColor);

  const STROKE_WIDTH = settings.strokeWidth;
  const ARROW_WIDTH = 10 + STROKE_WIDTH * 2;
  const ARROW_HEIGHT = 10 + STROKE_WIDTH * 2;
  const FRAME_WIDTH = ARROW_WIDTH / 2;

  // frame
  arrowFrame.name = 'Arrow';
  arrowFrame.resize(FRAME_WIDTH, ARROW_HEIGHT);
  arrowFrame.x -= FRAME_WIDTH - STROKE_WIDTH;
  arrowFrame.y = tooltipFrame.height / 2 - ARROW_HEIGHT / 2;
  arrowFrame.fills = [];

  // arrow
  arrow.strokeWeight = STROKE_WIDTH;
  arrow.strokeAlign = 'INSIDE';
  arrow.strokes = [].concat(solidColor(stroke.r, stroke.g, stroke.b));
  arrow.resize(ARROW_WIDTH, ARROW_HEIGHT);
  arrow.fills = [].concat(solidColor(bg.r, bg.g, bg.b));
  arrow.x = 0;
  arrow.y = arrowFrame.height / 2;
  arrow.rotation = 45;

  if (horizontal === 'LEFT') {
    arrowFrame.rotation = 180;
    arrowFrame.x += tooltipFrame.width + ARROW_WIDTH - STROKE_WIDTH * 2;
    arrowFrame.y = tooltipFrame.height / 2 + ARROW_HEIGHT / 2;
  }

  if (vertical === 'TOP') {
    arrowFrame.rotation = 90;
    arrowFrame.x = tooltipFrame.width / 2 - ARROW_WIDTH / 2;
    arrowFrame.y = tooltipFrame.height + ARROW_HEIGHT / 2 - STROKE_WIDTH;
  }

  if (vertical === 'BOTTOM') {
    arrowFrame.rotation = -90;
    arrowFrame.x = tooltipFrame.width / 2 + ARROW_WIDTH / 2;
    arrowFrame.y = -(ARROW_HEIGHT / 2 - STROKE_WIDTH);
  }

  arrowFrame.appendChild(arrow);

  return arrowFrame;
};

const getTooltipFrame = (node, data) => {
  let pluginData = getTooltipPluginData(node);
  let tooltipFrame;

  // check if plugin data is available
  if (pluginData) {
    // search tooltip
    tooltipFrame = figma.getNodeById(pluginData.id);

    if (!tooltipFrame) {
      pluginData = null;
    } else {
      // reset content
      try {
        tooltipFrame.children.map(c => c.remove());
      } catch (e) {}
    }
  }

  if (!tooltipFrame) {
    tooltipFrame = figma.createFrame();
  }
  tooltipFrame.name = 'Tooltip ' + node.name;
  tooltipFrame.clipsContent = false;
  tooltipFrame.fills = [];

  // set plugin data
  const dataForPlugin = {
    directions: {
      vertical: data.vertical,
      horizontal: data.horizontal
    }
  };

  node.setPluginData(
    'tooltip',
    JSON.stringify(
      // new
      !pluginData
        ? {
            id: tooltipFrame.id,
            nodeId: node.id,
            ...dataForPlugin
          }
        : //existing
          {
            ...pluginData,
            ...dataForPlugin
          }
    )
  );

  return tooltipFrame;
};

export const getTooltipPluginData = (node): TooltipPluginData => {
  const data = node.getPluginData('tooltip');
  if (!data) {
    return null;
  }
  const parsedData = JSON.parse(data);

  if (parsedData.nodeId === node.id) {
    const tooltipNode = figma.getNodeById(parsedData.id);

    if (!tooltipNode) {
      return null;
    }

    return parsedData;
  }
  return null;
};

export const setTooltip = async options => {
  const data = {
    vertical: options.vertical || 'CENTER',
    horizontal: options.horizontal || 'LEFT',
    settings: {
      ...TOOLTIP_DEFAULT_SETTINGS
    }
  };

  // check if value is set
  for (const settingKey of Object.keys(TOOLTIP_DEFAULT_SETTINGS)) {
    data.settings[settingKey] =
      typeof options[settingKey] === 'undefined'
        ? TOOLTIP_DEFAULT_SETTINGS[settingKey]
        : options[settingKey];
  }

  figma.clientStorage.setAsync('tooltip-settings', data.settings);

  if (figma.currentPage.selection.length === 1) {
    const node = figma.currentPage.selection[0];

    if (
      node.type === 'INSTANCE' ||
      node.type === 'BOOLEAN_OPERATION' ||
      node.type === 'SLICE'
    ) {
      figma.notify('This type of element is not supported');
      return;
    }

    let tooltipFrame = getTooltipFrame(node, data);
    const contentFrame = figma.createFrame();
    tooltipFrame.appendChild(contentFrame);

    // ----
    const bg = hexToRgb(data.settings.backgroundColor);
    const stroke = hexToRgb(data.settings.strokeColor);

    contentFrame.locked = true;

    // auto-layout
    contentFrame.layoutMode = 'VERTICAL';
    contentFrame.cornerRadius = data.settings.cornerRadius;
    contentFrame.horizontalPadding = data.settings.horizontalPadding;
    contentFrame.verticalPadding = data.settings.verticalPadding;
    contentFrame.itemSpacing = data.settings.verticalPadding;
    contentFrame.counterAxisSizingMode = 'AUTO';

    // background
    contentFrame.backgrounds = [].concat(solidColor(bg.r, bg.g, bg.b));

    // stroke
    contentFrame.strokeAlign = 'INSIDE';
    contentFrame.strokeWeight = data.settings.strokeWidth;
    contentFrame.strokes = [].concat(solidColor(stroke.r, stroke.g, stroke.b));

    //-----

    switch (node.type) {
      case 'FRAME':
      case 'GROUP':
      case 'COMPONENT':
      case 'VECTOR':
      case 'STAR':
      case 'LINE':
      case 'ELLIPSE':
      case 'POLYGON':
      case 'FRAME':
        addDefaultSection(contentFrame, node, data.settings);
        break;
      case 'RECTANGLE':
        addRectSection(contentFrame, node, data.settings);
        break;
      case 'TEXT':
        addTextSection(contentFrame, node, data.settings);
        break;
    }

    // ----

    let transformPosition = node.absoluteTransform;

    let newX = transformPosition[0][2];
    let newY = transformPosition[1][2];

    switch (data.vertical) {
      case 'TOP':
        newY -= contentFrame.height + data.settings.distance;
        break;
      case 'CENTER':
        newY += node.height / 2 - contentFrame.height / 2;
        break;
      case 'BOTTOM':
        newY += node.height + data.settings.distance;
        break;
    }

    switch (data.horizontal) {
      case 'LEFT':
        newX -= contentFrame.width + data.settings.distance;
        break;
      case 'CENTER':
        newX += node.width / 2 - contentFrame.width / 2;
        break;
      case 'RIGHT':
        newX += node.width + data.settings.distance;
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

    const arrow = createArrow(contentFrame, data.settings, {
      horizontal: data.horizontal,
      vertical: data.vertical
    });

    if (arrow) {
      tooltipFrame.appendChild(arrow);
    }

    tooltipFrame.resize(contentFrame.width, contentFrame.height);
    tooltipFrame.relativeTransform = transformPosition;
  } else {
    figma.notify('Please select only one element');
  }
};
