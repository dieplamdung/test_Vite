import React from 'react';
import SelectCoin from '../SelectCoin';
import Button from '../../../Button';
import {
  Label,
  LabelNote,
  Title,
  TitleRow,
  ValueRow,
  WrapperButtonConfirm,
  WrapperContentDeposit,
  WrapperContentRows,
  WrapperRow,
  WrapperTitle
} from '../ContentDeposit/styled';

export default function ContentWithdraw({ onClose }) {
  return (
    <WrapperContentDeposit>
      <Label>Transfer type and Amount</Label>

      <WrapperTitle>
        <Title>Transfer type and Amount</Title>
        <LabelNote>Available: 0 USDC</LabelNote>
      </WrapperTitle>
      <SelectCoin />
      <WrapperContentRows>
        <WrapperRow>
          <TitleRow>Wallet Balance</TitleRow>
          <ValueRow>0 USDC</ValueRow>
        </WrapperRow>
        <WrapperRow>
          <TitleRow>Withdrawal limit</TitleRow>
          <ValueRow>0 USDC</ValueRow>
        </WrapperRow>
      </WrapperContentRows>
      <WrapperRow>
        <TitleRow>Asset balance</TitleRow>
        <ValueRow>0 USDC</ValueRow>
      </WrapperRow>

      <WrapperButtonConfirm>
        <Button className={'button-confirm'} onClick={onClose}>
          {' '}
          Confirm
        </Button>
      </WrapperButtonConfirm>
    </WrapperContentDeposit>
  );
}
