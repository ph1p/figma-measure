figma.showUI(__html__, {
  visible: false
});

const solidColor = (r = 255, g = 0, b = 0) => ({
  type: 'SOLID',
  color: {
    r: r / 255,
    g: g / 255,
    b: b / 255
  }
});

const getParentFrame = node => {
  if (node.type === 'FRAME') {
    return node;
  } else {
    return getParentFrame(node.parent);
  }
};

async function main() {
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });

  const createLine = async ({
    left = 0,
    top = 0,
    node,
    direction = 'horizontal',
    name = 'Group'
  }) => {
    const isRect = node.type === 'RECTANGLE';

    // needed elements
    const line = figma.createLine();
    const rect = figma.createRectangle();
    const label = figma.createText();

    const paddingTopBottom = 5;
    const paddingLeftRight = 10;

    const isHorizontal = direction === 'horizontal';
    const heightOrWidth = isHorizontal ? 'width' : 'height';

    const parentFrame = getParentFrame(node);

    let topNode = node.y;
    let leftNode = node.x;

    if (isRect) {
      topNode += parentFrame.y;
      leftNode += parentFrame.x;
    }

    top += topNode;
    left += leftNode;

    // LINE
    line.rotation = isHorizontal ? 0 : 90;
    line.x =
      left +
      (!isHorizontal ? 1 : 0) +
      (!isHorizontal ? (node.width / 100) * 10 : 0);
    line.y = node.height + top - (isHorizontal ? (node.height / 100) * 10 : 0);

    line.strokes = [].concat(solidColor());

    line.resize(node[heightOrWidth], 0);
    line.strokeCap = 'ARROW_LINES';

    // LABEL
    label.characters = node[heightOrWidth].toString();

    if (isHorizontal) {
      label.x = line.x + node.width / 2 - label.width / 2;
      label.y = line.y - label.height - 10;
    } else {
      label.x = left + (node.width / 100) * 10 + label.width - 8;
      label.y = node.height + top - node.height / 2 - label.height / 2;
    }

    label.fills = [].concat(solidColor(255, 255, 255));

    // RECTANGLE
    rect.x = label.x - paddingLeftRight / 2;
    rect.y = label.y - paddingTopBottom / 2;
    rect.cornerRadius = 3;
    rect.resize(
      label.width + paddingLeftRight,
      label.height + paddingTopBottom
    );
    rect.fills = [].concat(solidColor());

    // grouping
    const group = figma.group([line], node.parent);
    group.name = name;

    const textGroup = figma.group([label, rect], group);
    textGroup.name = 'label';

    return group;
  };

  for (const node of figma.currentPage.selection) {
    const isRect = node.type === 'RECTANGLE';
    const isFrame = node.type === 'FRAME';

    if (isFrame || isRect) {
      const parentFrame = getParentFrame(node);

      const horizontalLine = await createLine({
        name: 'horizontal line',
        node
      });

      const verticalLine = await createLine({
        name: 'vertical line',
        direction: 'vertical',
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
