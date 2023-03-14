import styled from 'styled-components';

export const WrapperContentMarket = styled.div`
  height: 100%;
  width: 100%;
  min-width: 440px;
  flex: 1;
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

  .instrument {
    width: 30%;
  }
  .position,
  .mark-price,
  .est {
    width: 20%;
  }

  .funding,
  .basis {
    width: 10%;
  }
`;

export const WrapperRowsContent = styled.div`
  flex: 1;
  height: 310px;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;
export const WrapperRowContent = styled.div`
  width: 100%;
  display: flex;
  height: 26px;
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
    white-space: nowrap;
  }

  .instrument {
    width: 30%;
  }
  .position,
  .mark-price,
  .est {
    width: 20%;
  }

  .funding,
  .basis {
    width: 10%;
  }
`;
