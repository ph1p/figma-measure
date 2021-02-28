import { createGlobalStyle } from 'styled-components';

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

/* input {
  &[type='color'] {
    -webkit-appearance: none;
    padding: 0;
    border: 0;
    width: 25px;
    height: 25px;
    cursor: pointer;
    &::-webkit-color-swatch-wrapper {
      padding: 0;
      border-radius: 100%;
      overflow: hidden;
    }
    &::-webkit-color-swatch {
      border: none;
      border: 1px solid #ddd;
      border-radius: 100%;
    }
  }

  &[type='range']:hover,
  &[type='color']:hover,
  &[type='range']:focus,
  &[type='color']:focus {
    border: 0;
    outline: none;
  }

  &[type='range'] {
    -webkit-appearance: none;
    margin: 0;
    width: 100%;
    border: 0;
    &:focus {
      outline: none;
    }
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 12px;
      cursor: pointer;
      border-radius: 6px;
      background: #f3f3f3;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px inset;
    }
    &::-webkit-slider-thumb {
      width: 12px;
      height: 12px;
      border-radius: 6px;
      box-sizing: border-box;
      background: #ffffff;
      cursor: pointer;
      -webkit-appearance: none;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 0.5px;
    }
  }
} */

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
