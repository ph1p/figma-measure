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

input {
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
      &::-webkit-slider-runnable-track {
        background: #eee;
      }
    }
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
      border-radius: 3px;
      background: #efefef;
    }
    &::-webkit-slider-thumb {
      height: 10px;
      width: 19px;
      border-radius: 5px;
      background: #17a0fb;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -3px;
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
