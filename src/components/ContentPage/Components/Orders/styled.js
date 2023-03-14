import styled from 'styled-components';

export const WrapperOrdersContent = styled.div`
  height: 100%;
  width: 440px;
  border: 1px solid #262c2e;
`;

export const WrapperTitle = styled.div`
  min-height: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #262c2e;
  border-left: none;
  border-right: none;

  .side,
  .qty,
  .price {
    width: 15%;
  }

  .instrument,
  .id {
    width: 35%;
  }
`;

export const WrapperRowContent = styled.div`
  width: 100%;
  display: flex;
  min-height: 26px;
  padding: 4px 0px;
  align-items: center;
  background: ${(props) => (props.index % 2 == 0 ? 'none' : '#474747c9')};
  color: ${(props) => props?.color || '#fff'};

  :hover {
    background: rgba(71, 71, 71, 0.79);
  }

  p {
    padding: 0px 8px;
    margin: 0px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
  }

  button {
    color: ${(props) => props?.color || '#fff'};
  }

  .side,
  .qty,
  .price {
    width: 15%;
  }

  .instrument,
  .id {
    width: 35%;
  }
`;

export const WrapperButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0px 4px;

  .style-button {
    width: fit-content;
    background: none;
    min-width: 46px;
    border: 1px solid #fff;
    height: 22px;
    padding: 4px 10px;
    margin: 0px 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
  }
`;
