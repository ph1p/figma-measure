import { createGlobalStyle } from 'styled-components';

export const DEFAULT_COLOR = '#1745e8';
export const TOKENS = {
  colors: {
    d_cerise: {
      value: '#dac0ce',
    },
    d_persian: {
      value: '#c0c6da',
    },
    d_jade: {
      value: '#c0d3cb',
    },
    d_sun: {
      value: '#dcd2be',
    },
    d_red: {
      value: '#dac8c4',
    },
    d_violet: {
      value: '#ccc0db',
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
    red: {
      value: '#ef5533',
    },
  },
};

export const getDimmedColorByColor = (color: string) => {
  try {
    const name = Object.entries(TOKENS.colors).find(
      ([_, data]) => data.value === color
    )[0];

    return TOKENS.colors[`d_${name}`].value;
  } catch {
    return DEFAULT_COLOR;
  }
};

export const theme = {
  tokens: TOKENS,
  colors: Object.keys(TOKENS.colors)
    .filter((colorKey) => !colorKey.startsWith('d_'))
    .map((colorKey) => TOKENS.colors[colorKey].value),
  dimmedColors: Object.keys(TOKENS.colors)
    .filter((colorKey) => colorKey.startsWith('d_'))
    .map((colorKey) => TOKENS.colors[colorKey].value),
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
      border-color: var(--blue);
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
  width: 4px;
  &:horizontal {
    height: 4px;
  }
}

::-webkit-scrollbar-track {
  background-color: #e9e9e9;
}

::-webkit-scrollbar-thumb {
  background-color: #000000;
}
`;
