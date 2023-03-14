import React, { memo, useRef, useState } from 'react';
import styled from 'styled-components';
import { VALUE_BET } from '../../../../../../utils/constant';
import Button from '../../../../../Button';
import Input from '../../../../../Input';

function Sweep() {
  const defaultQty = '.01';
  const defaultToler = '1';

  const [qty, setQty] = useState(defaultQty);
  const [toler, setToler] = useState(defaultToler);

  const refType = useRef('.01');

  const handleClickItem = (value) => {
    if (value === refType.current) {
      const newValue = qty * 1 + value * 1;
      setQty(newValue.toFixed(2));
      return;
    }
    refType.current = value;
    setQty(value);
  };

  return (
    <WrapperSweep>
      <WrapperQuantity>
        <Title> Quantity</Title>
        <Input
          type="number"
          value={qty}
          onChange={(e) => {
            setQty(e?.target?.value || defaultQty);
          }}
        />
      </WrapperQuantity>
      <WrapperQuantity>
        <Title> Slippage Tolerance</Title>
        <Input
          type="number"
          percent
          value={toler}
          onChange={(e) => {
            setToler(e?.target?.value || defaultToler);
          }}
        />
      </WrapperQuantity>
      <WrapperQuantity>
        <Title> Estimated Price</Title>
        <Label>22,252.52</Label>
      </WrapperQuantity>
      <TableValueBet>
        {VALUE_BET.map((item) => {
          return (
            <ValueBet key={item} onClick={() => handleClickItem(item)}>
              {item}
            </ValueBet>
          );
        })}
      </TableValueBet>
      <ButtonClear
        onClick={() => {
          setQty(defaultQty);
          refType.current = defaultQty;
          setToler(defaultToler);
        }}>
        Clear
      </ButtonClear>
      <GroupButton>
        <Button className="button-buy">Buy</Button>
        <Button className="button-sell">Sell</Button>
      </GroupButton>
    </WrapperSweep>
  );
}

export default memo(Sweep);

const WrapperSweep = styled.div`
  width: 100%;
  height: 100%;
`;
export const WrapperQuantity = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const Title = styled.p`
  width: fit-content;
  font-family: 'Roboto';
  white-space: nowrap;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

const Label = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

const TableValueBet = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export const ValueBet = styled.div`
  width: calc(50% - 2px);
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #262c2e;
  cursor: pointer;
  :hover {
    background-color: #262c2e;
  }
`;

export const ButtonClear = styled.div`
  width: calc(100% -2px);
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ffffff;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  border-radius: 2px;
  cursor: pointer;
  :hover {
    background-color: #262c2e;
  }
`;

export const GroupButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;

  button {
    width: calc(50% - 10px);
    border: none;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    :hover {
      background-color: #262c2e;
    }
  }

  .button-buy {
    background: #14a5be;
  }

  .button-sell {
    background: #a23d52;
  }
`;
