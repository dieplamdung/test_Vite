import React from 'react';
import { Title, Value, WrapperContent, WrapperRowsTitle, WrapperRowsValue } from '../Header.style';

function ContentHeader({ dataWallet }) {
  const TITLE_LIST = [
    'Required Margin',
    'Excess Margin',
    'Position Value',
    'Collateral + Unrealized PnL',
    'Leverage (Effective)',
    'Health',
    'Total PnL'
  ];
  return (
    <WrapperContent>
      <WrapperRowsTitle>
        {TITLE_LIST.map((title) => {
          return <Title key={title}>{title}</Title>;
        })}
      </WrapperRowsTitle>
      <WrapperRowsValue>
        <Value>{dataWallet?.requiredMargin || '-'}</Value>
        <Value>{dataWallet?.excessMargin || '-'}</Value>
        <Value>{dataWallet?.positionVal || '-'}</Value>
        <Value>{dataWallet?.portfolio || '-'}</Value>
        <Value>-</Value>
        <Value>-</Value>
        <Value color={`${dataWallet?.pnl}`.includes('-') ? 'red' : ''}>
          {dataWallet?.pnl || '-'}
        </Value>
      </WrapperRowsValue>
    </WrapperContent>
  );
}

export default React.memo(ContentHeader);
