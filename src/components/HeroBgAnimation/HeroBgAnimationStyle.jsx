import styled from 'styled-components';


export const Div = styled.div`
  width: 600px;
  height: 500px;
  pointer-events: none;

  @media (max-width: 768px), (prefers-reduced-motion: reduce) {
    display: none;
  }
`
