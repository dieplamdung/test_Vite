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
} from './styled';

export default function ContentDeposit({ onClose }) {
  return (
    <WrapperContentDeposit>
      <Label>
        Deposited assets automatically earn yield through lending.{' '}
        <a href="/" className="link-more">
          Learn more.
        </a>
      </Label>

      <WrapperTitle>
        <Title>Transfer type and Amount</Title>
        <LabelNote>Deposit APR 1.3015% </LabelNote>
      </WrapperTitle>
      <SelectCoin />
      <WrapperContentRows>
        <WrapperRow>
          <TitleRow>Wallet Balance</TitleRow>
          <ValueRow>4.576905 USDC</ValueRow>
        </WrapperRow>
        <WrapperRow>
          <TitleRow>Global USDC Deposits / Max</TitleRow>
          <ValueRow>2.12M / 10.0M</ValueRow>
        </WrapperRow>
      </WrapperContentRows>
      <WrapperRow>
        <TitleRow>Asset balance</TitleRow>
        <ValueRow>0 USDC</ValueRow>
      </WrapperRow>
      <WrapperRow>
        <TitleRow>Net Account Balance (USD)</TitleRow>
        <ValueRow>$0.00</ValueRow>
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
