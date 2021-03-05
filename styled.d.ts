import 'styled-components';
import { TOKENS } from './src/style';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: string;
    dimmedColor: string;
    colors: string[];
    dimmedColors: string[];
    tokens: typeof TOKENS;
  }
}