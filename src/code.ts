figma.showUI(__html__, {
  visible: false
});

enum DirectionVertical {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  CENTER = 'CENTER'
}
enum DirectionHorizontal {
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
  verticalAlign: DirectionVertical;
  horizontalAlign: DirectionHorizontal;
  strokeCap: StrokeCap;
}

const solidColor = (r = 255, g = 0, b = 0) => ({
  type: 'SOLID',
  color: {
    r: r / 255,
    g: g / 255,
    b: b / 255
  }
});

async function main() {
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  const createLine = async options => {
    let {
      node,
      direction = 'horizontal',
      name = 'Group',
      verticalAlign = DirectionVertical.CENTER,
      horizontalAlign = DirectionHorizontal.CENTER,
      strokeCap = 'NONE'
    }: LineParameterTypes = options;

    // needed elements
    const line = figma.createLine();
    const rect = figma.createRectangle();
    const label = figma.createText();

    const paddingTopBottom = 5;
    const paddingLeftRight = 10;

    const isHorizontal = direction === 'horizontal';
    const heightOrWidth = isHorizontal ? 'width' : 'height';

    // node.relativeTransform = [
    //   [1, 0, 50], // x
    //   [0, 1, 100] // y
    // ];

    // margin for top and bottom
    const directionMargin = 5;

    // directions for text box
    const txtVerticalAlign: DirectionVertical = verticalAlign;
    const txtHorizontalAlign: DirectionHorizontal = horizontalAlign;

    let lineOffset = 10;

    // LINE
    line.rotation = isHorizontal ? 0 : 90;

    line.x = !isHorizontal ? lineOffset : 0;
    line.y = node.height - (isHorizontal ? lineOffset : 0);

    line.strokes = [].concat(solidColor());

    line.resize(node[heightOrWidth], 0);
    line.strokeCap = strokeCap;

    // LABEL
    label.characters = `${node[heightOrWidth]}`;
    label.fontName = {
      family: 'Inter',
      style: 'Bold'
    };
    label.fontSize = 10;

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

    // x, y for text box
    const boxTop = paddingTopBottom / 2;
    const boxLeft = paddingLeftRight / 2;

    // place text group
    if (isHorizontal) {
      textGroup.x += boxLeft + node.width / 2 - textGroup.width / 2;
      textGroup.y += boxTop + node.height - lineOffset - line.strokeWeight;

      // vertical text align
      if (txtVerticalAlign === DirectionVertical.CENTER) {
        textGroup.y -= textGroup.height / 2;
      } else if (txtVerticalAlign === DirectionVertical.BOTTOM) {
        textGroup.y += directionMargin;
      } else if (txtVerticalAlign === DirectionVertical.TOP) {
        textGroup.y -= textGroup.height + directionMargin;
      }

      // horizontal text align
      if (txtHorizontalAlign === DirectionHorizontal.CENTER) {
        textGroup.x += 0;
      } else if (txtHorizontalAlign === DirectionHorizontal.LEFT) {
        textGroup.x -= node.width / 2 - textGroup.width / 2 - directionMargin;
      } else if (txtHorizontalAlign === DirectionHorizontal.RIGHT) {
        textGroup.x += node.width / 2 - textGroup.width / 2 - directionMargin;
      }
    } else {
      textGroup.x += boxLeft + lineOffset;
      textGroup.y += boxTop;

      // vertical text align
      if (txtVerticalAlign === DirectionVertical.CENTER) {
        textGroup.y += node.height / 2 - textGroup.height / 2;
      } else if (txtVerticalAlign === DirectionVertical.BOTTOM) {
        textGroup.y += node.height - textGroup.height - directionMargin;
      } else if (txtVerticalAlign === DirectionVertical.TOP) {
        textGroup.y += directionMargin;
      }

      // vertical text align
      if (txtHorizontalAlign === DirectionHorizontal.CENTER) {
        textGroup.x -= textGroup.width / 2;
      } else if (txtHorizontalAlign === DirectionHorizontal.LEFT) {
        textGroup.x -= textGroup.width + directionMargin;
      } else if (txtHorizontalAlign === DirectionHorizontal.RIGHT) {
        textGroup.x += directionMargin;
      }
    }

    let transformPosition = node.relativeTransform;

    if (isHorizontal) {
      transformPosition = [
        [1, 0, transformPosition[0][2]],
        [0, 1, transformPosition[1][2] - lineOffset + node.height]
      ];
    } else {
      transformPosition = [
        [1, 0, transformPosition[0][2] + lineOffset],
        [0, 1, transformPosition[1][2]]
      ];
    }

    // group.locked = true;

    // line Positioning
    // center horizontal
    // if (isHorizontal) {
    //   if (
    //     txtVerticalAlign === DirectionVertical.BOTTOM ||
    //     txtVerticalAlign === DirectionVertical.TOP
    //   ) {
    //     group.y -= directionMargin * 2;
    //   }
    //   group.y += lineOffset - (node.height - group.height) / 2;
    // }

    // center vertical
    // if (!isHorizontal) {
    //   console.log(node.width - group.width);
    //   group.x -= lineOffset - node.width / 2;
    // }

    group.relativeTransform = transformPosition;

    return group;
  };

  for (const node of figma.currentPage.selection) {
    const isValidShape =
      node.type === 'RECTANGLE' ||
      node.type === 'ELLIPSE' ||
      node.type === 'GROUP' ||
      node.type === 'FRAME';
    const isFrame = node.type === 'FRAME';

    if (isFrame || isValidShape) {
      const horizontalLine = await createLine({
        name: 'horizontal line',
        verticalAlign: DirectionVertical.TOP,
        horizontalAlign: DirectionHorizontal.CENTER,
        strokeCap: 'ARROW_LINES', // "NONE" | "ROUND" | "SQUARE" | "ARROW_LINES" | "ARROW_EQUILATERAL"
        node
      });

      const verticalLine = await createLine({
        name: 'vertical line',
        direction: 'vertical',
        verticalAlign: DirectionVertical.CENTER,
        horizontalAlign: DirectionHorizontal.RIGHT,
        strokeCap: 'ARROW_LINES',
        node
      });

      const measureGroup = figma.group(
        [horizontalLine, verticalLine],
        figma.currentPage
      );

      measureGroup.name = 'measurements';

      figma.currentPage.appendChild(measureGroup);
    }
  }
}

figma;
main().then(() => {
  figma.closePlugin();
});
