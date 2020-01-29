import styled from 'styled-components';

export const Content = styled.div`
  padding: 10px 10px 0 10px;
`;

export const Grid = styled.div<{ repeat?: number }>`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(${p => p.repeat || 3}, 1fr);
`;
