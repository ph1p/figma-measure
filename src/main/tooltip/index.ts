import { solidColor, hexToRgb } from '../helper';
import { TOOLTIP_DEFAULT_SETTINGS } from '../../shared';

function colorString(color, opacity) {
  return `rgba(${Math.round(color.r * 255)}, ${Math.round(
    color.g * 255
  )}, ${Math.round(color.b * 255)}, ${opacity})`;
}

const createTooltipTextNode = ({ fontColor, fontSize }) => {
  const text = figma.createText();

  text.fontName = {
    family: 'Inter',
    style: 'Regular'
  };
  text.textAlignHorizontal = 'LEFT';
  const c = hexToRgb(fontColor);

  text.fills = [].concat(solidColor(c.r, c.g, c.b));
  text.fontSize = fontSize;

  return text;
};

interface TooltipPluginData {
  id: any;
  nodeId: any;
  directions: {
    horizontal: string;
    vertical: string;
  };
}

const createArrow = (node, settings) => {
  const arrow = figma.createPolygon();
  const bg = hexToRgb(settings.backgroundColor);
  const stroke = hexToRgb(settings.strokeColor);

  arrow.strokeWeight = settings.strokeWidth;
  arrow.strokeAlign = 'CENTER';
  arrow.strokes = [].concat(solidColor(stroke.r, stroke.g, stroke.b));

  arrow.pointCount = 3;
  arrow.resize(14, 8);
  arrow.rotation = 90;
  arrow.x = -6;
  arrow.y = node.height / 2 + 7;
  arrow.fills = [].concat(solidColor(bg.r, bg.g, bg.b));

  return arrow;
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
      ...Object.keys(TOOLTIP_DEFAULT_SETTINGS).reduce(
        (b, c) => {
          return {
            ...b,
            [c]: options[c]
          };
        },
        { ...TOOLTIP_DEFAULT_SETTINGS }
      )
    }
  };

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

    let pluginData = getTooltipPluginData(node);
    let tooltipFrame;

    if (pluginData) {
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

    const contentFrame = figma.createFrame();
    tooltipFrame.appendChild(contentFrame);

    // ----
    const bg = hexToRgb(data.settings.backgroundColor);
    const stroke = hexToRgb(data.settings.strokeColor);

    contentFrame.locked = true;
    contentFrame.layoutMode = 'VERTICAL';
    contentFrame.cornerRadius = data.settings.cornerRadius;
    contentFrame.horizontalPadding = data.settings.horizontalPadding;
    contentFrame.verticalPadding = data.settings.verticalPadding;
    contentFrame.itemSpacing = data.settings.verticalPadding;
    contentFrame.counterAxisSizingMode = 'AUTO';
    contentFrame.backgrounds = [].concat(solidColor(bg.r, bg.g, bg.b));
    contentFrame.strokeWeight = data.settings.strokeWidth;
    contentFrame.strokes = [].concat(solidColor(stroke.r, stroke.g, stroke.b));

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

    //-----

    const tooltipContent = createTooltipTextNode({
      fontColor: data.settings.fontColor,
      fontSize: data.settings.fontSize
    });

    const setTitleBold = content => {
      let chars = 0;
      for (const line of content.characters.split('\n')) {
        if (line && ~line.indexOf(':')) {
          const [label] = line.split(':');

          content.setRangeFontName(chars, chars + label.length + 1, {
            family: 'Inter',
            style: 'Bold'
          });
          chars += line.length + 1;
        }
      }
    };

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
        {
          tooltipContent.characters += `Height: ${Math.floor(node.height)}\n`;
          tooltipContent.characters += `Width: ${Math.floor(node.width)}\n`;

          // Fills
          const fillsTextNode = createTooltipTextNode({
            fontColor: data.settings.fontColor,
            fontSize: data.settings.fontSize
          });

          contentFrame.appendChild(fillsTextNode);
        }
        break;
      case 'RECTANGLE':
        {
          const rectangle: RectangleNode = node;

          tooltipContent.characters += `Height: ${Math.floor(
            rectangle.height
          )}\n`;
          tooltipContent.characters += `Width: ${Math.floor(
            rectangle.width
          )}\n`;
          tooltipContent.characters += `Corner-Radius: ${rectangle.cornerRadius.toString()}`;

          setTitleBold(tooltipContent);

          // Fills
          const fillsTextNode = createTooltipTextNode({
            fontColor: data.settings.fontColor,
            fontSize: data.settings.fontSize
          });

          if (rectangle.fills) {
            fillsTextNode.characters += `Fills\n`;
            (rectangle.fills as any[]).map(f => {
              if (f.type === 'SOLID') {
                fillsTextNode.characters += colorString(f.color, f.opacity);
              }
            });
          }

          fillsTextNode.setRangeFontName(0, 5, {
            family: 'Inter',
            style: 'Bold'
          });

          contentFrame.appendChild(tooltipContent);
          contentFrame.appendChild(fillsTextNode);
        }
        break;
      case 'TEXT':
        const fontFamily = (node.fontName as FontName).family;
        const fontStyle = (node.fontName as FontName).style;

        tooltipContent.characters += `Opacity: ${node.opacity.toFixed(2)}\n`;

        // Font
        tooltipContent.characters += `Font-Size: ${node.fontSize.toString()}\n`;
        tooltipContent.characters += `Font-Family: ${fontFamily}\n`;
        tooltipContent.characters += `Font-Style: ${fontStyle}`;

        setTitleBold(tooltipContent);

        // Fills
        const fillsTextNode = createTooltipTextNode({
          fontColor: data.settings.fontColor,
          fontSize: data.settings.fontSize
        });

        if (node.fills) {
          fillsTextNode.characters += `Fills\n`;
          (node.fills as any[]).map(f => {
            if (f.type === 'SOLID') {
              fillsTextNode.characters += colorString(f.color, f.opacity);
            }
          });
        }

        fillsTextNode.setRangeFontName(0, 5, {
          family: 'Inter',
          style: 'Bold'
        });

        contentFrame.appendChild(tooltipContent);
        contentFrame.appendChild(fillsTextNode);

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

    tooltipFrame.appendChild(createArrow(contentFrame, data.settings));

    tooltipFrame.resize(contentFrame.width, contentFrame.height);
    tooltipFrame.relativeTransform = transformPosition;
  } else {
    figma.notify('Please select only one element');
  }
};
