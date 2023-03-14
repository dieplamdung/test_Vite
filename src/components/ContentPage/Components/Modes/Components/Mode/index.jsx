import React, { memo, useRef, useState } from 'react';
import styled from 'styled-components';
import { VALUE_BET } from '../../../../../../utils/constant';
import Button from '../../../../../Button';
import Input from '../../../../../Input';
import { ButtonClear, GroupButton, Title, ValueBet, WrapperQuantity } from '../Sweep';

function Mode() {
  const defaultQty = '.01';
  const defaultPrice = '1';

  const [qty, setQty] = useState(defaultQty);
  const [price, setPrice] = useState(defaultPrice);

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
    <WrapperMode>
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
        <Title> Price</Title>
        <Input
          type="number"
          percent
          value={price}
          onChange={(e) => {
            setPrice(e?.target?.value || defaultPrice);
          }}
        />
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
          setPrice(defaultPrice);
        }}>
        Clear
      </ButtonClear>
      <GroupButton>
        <Button className="button-buy">Buy</Button>
        <Button className="button-sell">Sell</Button>
      </GroupButton>
    </WrapperMode>
  );
}

export default memo(Mode);

const WrapperMode = styled.div`
  width: 100%;
  height: 100%;
`;
const TableValueBet = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
`;
