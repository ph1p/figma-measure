import { createGlobalStyle } from 'styled-components';

export const TOKENS = {
  colors: {
    solid: {
      red: {
        value: '#ef5533',
      },
      persian: {
        value: '#1745e8',
      },
      violet: {
        value: '#7614f5',
      },
      jade: {
        value: '#12b571',
      },
      sun: {
        value: '#ffaa00',
      },
      cerise: {
        value: '#e8178a',
      },
    },
    soft: {
      cerise: {
        value: '#dac0ce',
      },
      persian: {
        value: '#c0c6da',
      },
      jade: {
        value: '#c0d3cb',
      },
      sun: {
        value: '#dcd2be',
      },
      red: {
        value: '#dac8c4',
      },
      violet: {
        value: '#ccc0db',
      },
    },
    hover: {
      sun: {
        value: '#fdf8e8',
      },
      cerise: {
        value: '#fde8f7',
      },
      red: {
        value: '#fdf6e8',
      },
      jade: {
        value: '#e8fdf7',
      },
      violet: {
        value: '#f1e8fd',
      },
      persian: {
        value: '#e8ecfd',
      },
    },
  },
};

export const DEFAULT_COLOR = TOKENS.colors.solid.persian.value;

export const getColorByTypeAndSolidColor = (
  color: string,
  type: keyof typeof TOKENS.colors = 'solid'
) => {
  const foundColor = Object.entries(TOKENS.colors.solid).find(
    ([_, data]) => data.value.toLowerCase() === color.toLowerCase()
  );

  if (foundColor) {
    return TOKENS.colors[type][foundColor[0]].value;
  } else {
    return TOKENS.colors[type].persian.value;
  }
};

export const theme = {
  tokens: TOKENS,
  colors: Object.keys(TOKENS.colors.solid).map(
    (color) => TOKENS.colors.solid[color].value
  ),
  softColors: Object.keys(TOKENS.colors.soft).map(
    (color) => TOKENS.colors.soft[color].value
  ),
  hoverColors: Object.keys(TOKENS.colors.hover).map(
    (color) => TOKENS.colors.hover[color].value
  ),
};

export const GlobalStyle = createGlobalStyle`
body {
  font-family: Inter;
  font-size: 12px;
  margin: 0;
}

hr {
  border-width: 1px 0 0 0;
  border-color: #e5e5e5;
  border-style: solid;
  margin: 11px 0 0;
}

h4 {
  margin: 0 0 12px;
}

.input {
  position: relative;
  input {
    border-radius: 3px;
    border: 1px solid #E6E6E6;
    outline: none;
    padding: 7px 10px;
    box-sizing: border-box;
    font-size: 12px;
    width: 100%;
    &:focus {
      border-color: ${(props) => props.theme.color};
    }
  }
  &.icon {
    input {
      padding-left: 28px;
      & + div {
        display: flex;
        height: 100%;
        position: absolute;
        left: 9px;
        top: 0;
        svg {
          align-self: center;
        }
      }
    }
  }
}

::-webkit-scrollbar {
  width: 14px;
}

::-webkit-scrollbar:horizontal {
  height: 14px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 35px;
  background-color: rgba(0,0,0,0.7);
  border: 5px solid transparent;
  background-clip: content-box;
}
`;
