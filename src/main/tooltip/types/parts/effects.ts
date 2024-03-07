import { findAndReplaceNumberPattern } from '../../../../shared/helpers';
import { createTooltipTextNode, solidColor } from '../../../helper';

import { createColorNode } from './fills';

export const effects = async (
  node,
  parent,
  {
    fontColor = '',
    fontSize = 0,
    labelPattern,
    flags: { onlyEffectStyle = false },
  },
) => {
  const iconNode = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="https://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.24244 0.915039V0.415039H6.24244V0.915039V2.58001V3.08001H7.24244V2.58001V0.915039ZM2.97545 2.2683L2.6219 1.91474L1.91479 2.62185L2.26834 2.9754L3.44566 4.15272L3.79921 4.50627L4.50632 3.79916L4.15276 3.44561L2.97545 2.2683ZM11.2167 2.9754L11.5702 2.62185L10.8631 1.91474L10.5096 2.2683L9.33227 3.44561L8.97871 3.79916L9.68582 4.50627L10.0394 4.15272L11.2167 2.9754ZM0.915039 6.24244H0.415039V7.24244H0.915039H2.58001H3.08001V6.24244H2.58001H0.915039ZM10.9049 6.24244H10.4049V7.24244H10.9049H12.5699H13.0699V6.24244H12.5699H10.9049ZM4.15275 10.0393L4.5063 9.68573L3.79919 8.97863L3.44564 9.33218L2.26833 10.5095L1.91477 10.863L2.62188 11.5702L2.97543 11.2166L4.15275 10.0393ZM10.0392 9.33218L9.68563 8.97863L8.97853 9.68573L9.33208 10.0393L10.5094 11.2166L10.8629 11.5702L11.5701 10.863L11.2165 10.5095L10.0392 9.33218ZM7.24244 10.9049V10.4049H6.24244V10.9049V12.5699V13.0699H7.24244V12.5699V10.9049ZM7.82186 6.74086C7.82186 7.338 7.33779 7.82207 6.74065 7.82207C6.14351 7.82207 5.65943 7.338 5.65943 6.74086C5.65943 6.14372 6.14351 5.65964 6.74065 5.65964C7.33779 5.65964 7.82186 6.14372 7.82186 6.74086ZM8.82186 6.74086C8.82186 7.89028 7.89007 8.82207 6.74065 8.82207C5.59122 8.82207 4.65943 7.89028 4.65943 6.74086C4.65943 5.59143 5.59122 4.65964 6.74065 4.65964C7.89007 4.65964 8.82186 5.59143 8.82186 6.74086Z" fill="black" fill-opacity="0.3"/>
    </svg>
    `;

  if (node.effects.length || node.effectStyleId) {
    let effects = node.effects.filter((e) => e.visible);
    let effectStyle = null;

    if (node.effectStyleId) {
      effectStyle = await figma.getStyleByIdAsync(node.effectStyleId);
      effects = effectStyle.effects;
      const textNode = createTooltipTextNode({
        fontColor,
        fontSize,
      });
      textNode.x += 20;
      textNode.y -= 2;
      textNode.characters += `${effectStyle.name}`;

      if (effectStyle.description) {
        textNode.characters += `\n${effectStyle.description}`;

        textNode.setRangeFontSize(
          effectStyle.name.length,
          textNode.characters.length,
          10,
        );
        textNode.setRangeFills(
          effectStyle.name.length,
          textNode.characters.length,
          [solidColor(153, 153, 153)],
        );
      }

      const styleGroup = figma.group(
        [figma.createNodeFromSvg(iconNode), textNode],
        parent,
      );
      styleGroup.expanded = false;
    }

    if (!onlyEffectStyle || !effectStyle) {
      effects.forEach((effect, index) => {
        let firstItem = null;

        if (node.effectStyleId || index > 0) {
          firstItem = figma.createRectangle();
          firstItem.resize(16, 16);
          firstItem.fills = [];
        } else {
          firstItem = figma.createNodeFromSvg(iconNode);
        }

        const group: any[] = [firstItem];
        let colorNodes = [];

        if (effect.type !== 'BACKGROUND_BLUR' && effect.type !== 'LAYER_BLUR') {
          colorNodes = createColorNode(
            {
              type: 'SOLID',
              opacity: effect.color.a,
              color: {
                r: effect.color.r,
                g: effect.color.g,
                b: effect.color.b,
              },
            },
            { fontColor, fontSize },
          );
        }

        const textNode = createTooltipTextNode({
          fontColor,
          fontSize,
        });
        textNode.x += 20;
        textNode.y -= 2;
        textNode.characters += `${effect.type.toLowerCase().replace('_', ' ')}`;

        const texts = [];

        if (effect.radius) {
          texts.push(
            `Radius: ${findAndReplaceNumberPattern(
              labelPattern,
              effect.radius,
            )}`,
          );
        }

        if (effect.type !== 'BACKGROUND_BLUR' && effect.type !== 'LAYER_BLUR') {
          texts.push(
            `Offset: ${findAndReplaceNumberPattern(
              labelPattern,
              effect.offset.x,
            )} ${findAndReplaceNumberPattern(labelPattern, effect.offset.y)}`,
          );

          if (effect.spread) {
            texts.push(
              `Spread: ${findAndReplaceNumberPattern(
                labelPattern,
                effect.spread,
              )}`,
            );
          }
        }

        if (texts.length) {
          textNode.characters += `\n${texts.join('\n')}`;

          textNode.setRangeFontSize(
            effect.type.length,
            textNode.characters.length,
            10,
          );
          textNode.setRangeFills(
            effect.type.length,
            textNode.characters.length,
            [solidColor(153, 153, 153)],
          );
        }

        group.push(textNode);

        colorNodes.forEach((node) => {
          node.y += textNode.height + 2;
          if (node.type === 'TEXT' && effects.length - 1 !== index) {
            node.resize(node.width, node.height + 5);
          }
        });

        group.push(colorNodes);

        const g = figma.group(group.flat(), parent);
        g.expanded = false;
      });
    }
  }
};
