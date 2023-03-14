import React, { memo } from 'react';
import { WrapperButton, WrapperOrdersContent, WrapperRowContent, WrapperTitle } from '../styled';
import { Label, Title } from '../../Positions/style';
import Button from '../../../../Button';

function ContentOrder({ dataOrders }) {
  const TITLE_LIST = ['Instrument', 'Side', 'Qty', 'Price', 'ID'];
  return (
    <WrapperOrdersContent>
      <Label>Orders</Label>
      <WrapperTitle>
        {TITLE_LIST.map((item, index) => {
          return (
            <Title key={index} className={item.trim().toLowerCase().replace(/\s+/g, '-')}>
              {item}
            </Title>
          );
        })}
      </WrapperTitle>
      {!!dataOrders?.length &&
        dataOrders.map((item, index) => {
          return (
            <WrapperRowContent
              color={`${item?.side}`.toLowerCase() === 'sell' ? '#A23D52' : '#096C7B'}
              key={item?.id}
              index={0}>
              <p className="instrument">{item?.instrument}</p>
              <p className="side">{item?.side}</p>
              <p className="qty">{item?.qty}</p>
              <p className="price">{item?.price}</p>
              <WrapperButton className="id">
                <Button className="style-button" onClick={() => console.log(item?.id)}>
                  Copy
                </Button>
                <Button className="style-button" onClick={() => console.log(item?.id)}>
                  Cancel
                </Button>
              </WrapperButton>
            </WrapperRowContent>
          );
        })}
    </WrapperOrdersContent>
  );
}

export default memo(ContentOrder);
