import styled from 'styled-components';

export const WrapperContentPosition = styled.div`
  width: 375px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  border: 1px solid #262c2e;
  border-top: none;
`;

export const Label = styled.div`
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0px 8px;
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
    width: 60%;
  }

  .position {
    width: 40%;
  }
`;

export const Title = styled.div`
  display: flex;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
  padding: 0px 8px;
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

  .value-instrument {
    width: 60%;
  }

  .value-position {
    width: 40%;
  }
`;
