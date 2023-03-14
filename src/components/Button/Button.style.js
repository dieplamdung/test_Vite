import styled from 'styled-components';

export const ButtonWrapper = styled.button`
  background-color: ${(props) => (props.primary ? '#A23D52' : '#14A5BE')};
  color: ${(props) => (props.primary ? '#FFFFFF' : '#000000')};
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border: 2px solid ${(props) => (props.primary ? 'blue' : 'black')};
  border-radius: 0.25rem;
  cursor: pointer;
  :active {
    outline: none;
  }
  :focus {
    outline: 0;
  }
`;
