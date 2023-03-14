import styled from 'styled-components';

export const StyledPnLPanel = styled.article`
  position: relative;
  background: '#2D3236';
  border: 1px solid #9d9d9d;
  border-radius: 2px;
  display: flex;
  flex-direction: ${(props) => (props.direction === 'horizontal' ? 'row' : 'column')};
  justify-content: ${(props) => (props.direction === 'horizontal' ? 'space-between' : 'center')};
  align-items: ${(props) => (props.direction === 'horizontal' ? 'center' : 'flex-start')};
  min-width: ${(props) => (props.direction === 'horizontal' ? 'fit-content' : '400px')};
`;
