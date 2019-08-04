figma.showUI(__html__, {
  visible: false
});

async function main() {
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
  const nodes = [];

  const createLine = async ({
    left = 0,
    top = 0,
    node,
    direction = 'horizontal',
    name = 'Group'
  }) => {
    const line = figma.createLine();

    const isHorizontal = direction === 'horizontal';
    const heightOrWidth = isHorizontal ? 'width' : 'height';

    line.rotation = isHorizontal ? 0 : 90;
    line.x =
      left +
      (!isHorizontal ? 1 : 0) +
      (!isHorizontal ? (node.width / 100) * 10 : 0);
    line.y = top - (isHorizontal ? (node.height / 100) * 10 : 0);

    line.strokes = [
      {
        type: 'SOLID',
        color: {
          r: 255 / 255,
          g: 0 / 255,
          b: 0 / 255
        }
      }
    ];

    line.resize(node[heightOrWidth], 0);
    line.strokeCap = 'ARROW_LINES';

    const rect = figma.createRectangle();
    const label = figma.createText();
    const paddingTopBottom = 5;
    const paddingLeftRight = 10;

    // LABEL
    label.characters = node[heightOrWidth].toString();

    if (isHorizontal) {
      label.x = line.x + node[heightOrWidth] / 2 - label[heightOrWidth] / 2;
      label.y = line.y - label.height - 10;
    } else {
      label.x = left + (node.width / 100) * 10 + label.width - 8;
      label.y = top - node.height / 2 - label.height / 2;
    }

    label.fills = [
      {
        type: 'SOLID',
        color: {
          r: 255 / 255,
          g: 255 / 255,
          b: 255 / 255
        }
      }
    ];

    // RECTANGLE
    rect.x = label.x - paddingLeftRight / 2;
    rect.y = label.y - paddingTopBottom / 2;
    rect.cornerRadius = 3;
    rect.resize(
      label.width + paddingLeftRight,
      label.height + paddingTopBottom
    );
    rect.fills = [
      {
        type: 'SOLID',
        color: {
          r: 255 / 255,
          g: 0 / 255,
          b: 0 / 255
        }
      }
    ];

    const group = figma.group([line], node.parent);
    group.name = name;

    const textGroup = figma.group([label, rect], group);
    textGroup.name = 'text';

    return group;
  };

  const getParentFrame = node => {
    if (node.type === 'FRAME') {
      return node;
    } else {
      return getParentFrame(node.parent);
    }
  };

  for (const node of figma.currentPage.selection) {
    if (node.type === 'FRAME' || node.type === 'RECTANGLE') {
      const parentFrame = getParentFrame(node);

      let top = node.height + node.y;
      let left = node.x;

      if (node.type === 'RECTANGLE') {
        top += parentFrame.y;
        left += parentFrame.x;
      }

      const horizontalLine = await createLine({
        name: 'horizontal line',
        left,
        top,
        node
      });

      const verticalLine = await createLine({
        name: 'vertical line',
        direction: 'vertical',
        left,
        top,
        node
      });

      const measureGroup = figma.group(
        [horizontalLine, verticalLine],
        parentFrame
      );

      measureGroup.name = 'measurements';

      parentFrame.appendChild(measureGroup);
    }
  }
}

main().then(() => {
  figma.closePlugin();
});
