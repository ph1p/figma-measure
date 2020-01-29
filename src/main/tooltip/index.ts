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

    // ----
    tooltipFrame.locked = true;
    tooltipFrame.name = 'Tooltip ' + node.name;
    tooltipFrame.layoutMode = 'VERTICAL';
    tooltipFrame.cornerRadius = data.settings.cornerRadius;
    tooltipFrame.horizontalPadding = data.settings.horizontalPadding;
    tooltipFrame.verticalPadding = data.settings.verticalPadding;
    tooltipFrame.itemSpacing = data.settings.verticalPadding;
    tooltipFrame.counterAxisSizingMode = 'AUTO';

    const bg = hexToRgb(data.settings.backgroundColor);
    tooltipFrame.backgrounds = [].concat(solidColor(bg.r, bg.g, bg.b));

    const stroke = hexToRgb(data.settings.strokeColor);
    tooltipFrame.strokeWeight = data.settings.strokeWidth;
    tooltipFrame.strokes = [].concat(solidColor(stroke.r, stroke.g, stroke.b));

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
        !pluginData
          ? {
              id: tooltipFrame.id,
              nodeId: node.id,
              ...dataForPlugin
            }
          : {
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

          tooltipFrame.appendChild(fillsTextNode);
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

          tooltipFrame.appendChild(tooltipContent);
          tooltipFrame.appendChild(fillsTextNode);
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

        tooltipFrame.appendChild(tooltipContent);
        tooltipFrame.appendChild(fillsTextNode);

        break;
    }

    // ----
    // const tooltipGroup = figma.group([tooltipFrame], figma.currentPage);

    let transformPosition = node.absoluteTransform;

    let newX = transformPosition[0][2];
    let newY = transformPosition[1][2];

    switch (data.vertical) {
      case 'TOP':
        newY -= tooltipFrame.height + data.settings.distance;
        break;
      case 'CENTER':
        newY += node.height / 2 - tooltipFrame.height / 2;
        break;
      case 'BOTTOM':
        newY += node.height + data.settings.distance;
        break;
    }

    switch (data.horizontal) {
      case 'LEFT':
        newX -= tooltipFrame.width + data.settings.distance;
        break;
      case 'CENTER':
        newX += node.width / 2 - tooltipFrame.width / 2;
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

    tooltipFrame.relativeTransform = transformPosition;
  } else {
    figma.notify('Please select only one element');
  }
};
