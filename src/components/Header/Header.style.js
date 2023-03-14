import styled from 'styled-components';

export const StyledHeader = styled.header`
  background: transparent;
  width: 100%;
  /* min-height: 68px; */
  display: flex;
  position: sticky;
  top: 0px;
  left: 0px;
  background: #141c28;
  border: 1px solid #262c2e;
`;

export const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: 32px;
`;

export const WrapperRowsTitle = styled.div`
  width: 100%;
  display: flex;
  border: 1px solid #262c2e;
  border-left: none;
  border-top: none;
`;

export const WrapperRowsValue = styled.div`
  width: 100%;
  display: flex;
  min-height: 38px;
  border-right: 1px solid #262c2e;
`;

export const WrapperGroupButton = styled.div`
  display: flex;

  .button-deposit,
  .connect-wallet {
    height: 28px;
    border: 1px solid #fff;
    border-radius: 2px;
    padding: 0px 12px;
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: #fff;
    margin: 0px 4px;
  }

  .connect-wallet {
    background-color: #fff;
    color: #262c2e;
  }
`;

export const Title = styled.p`
  text-align: center;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  width: 100%;
  max-width: calc(100% / 7);
  padding: 0 4px;
`;

export const Value = styled.p`
  text-align: center;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  max-width: calc(100% / 7);
  color: ${(props) => props.color || '#096C7B'};
`;

export const WrapperAccount = styled.div`
  display: flex;
  width: fit-content;
  white-space: nowrap;
  margin-right: 4px;
  min-width: 144px;
  background: transparent;

  .select-account {
    width: 100%;
    height: 28px;
    background: transparent;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 2px;
  }
`;
