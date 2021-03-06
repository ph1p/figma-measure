import 'styled-components';
import { TOKENS } from './src/style';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: string;
    softColor: string;
    hoverColor: string;
    colors: string[];
    softColors: string[];
    hoverColors: string[];
    tokens: typeof TOKENS;
  }
}
