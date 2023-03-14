import styled from 'styled-components';

export const WrapperContentMode = styled.div`
  height: 100%;
  width: 360px;
  border: 1px solid #262c2e;
  display: flex;
  flex-direction: column;
`;

export const WrapperTitle = styled.div`
  width: 100%;
  display: flex;
  height: 32px;
`;

export const Title = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => (props.isselect ? '#fff' : '#262C2E')};
  cursor: pointer;
`;

export const WrapperContentModes = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  padding: 20px 15px;
`;
