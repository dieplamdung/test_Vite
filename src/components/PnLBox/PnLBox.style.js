import styled from 'styled-components';

export const StyledPnLWrapper = styled.article`
  width: 100%;
  width: -webkit-fill-available;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
`;

export const StyledPnLBox = styled.div`
  background: #262c2e;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  display: ${(props) => (props.direction === 'horizontal' ? 'grid' : 'flex')};
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  flex-direction: ${(props) => (props.direction === 'horizontal' ? 'column' : 'row')};
  justify-content: ${(props) => (props.direction === 'horizontal' ? 'center' : 'space-between')};
  align-items: ${(props) => (props.direction === 'horizontal' ? 'flex-start' : 'center')};
  margin: 3px;
`;

export const StyledPnLTitle = styled.div`
  flex: 1 1 50%;
  background: #1c1c1c;
  text-align: left;
  border-right: 1px solid #d9d9d9;

  p {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    color: #ffffff;
    padding: 4px 10px;
  }
`;

export const StyledPnLValue = styled.div`
  flex: 1 1 50%;
  text-align: right;
  vertical-align: middle;
  height: 100%;
  box-sizing: border-box;
  p {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: ${(props) => (props.color ? props.color : '#ffffff')};
    background: #262c2e;
    padding: 4px 10px;
  }
`;
