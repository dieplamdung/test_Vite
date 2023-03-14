import React, { memo } from 'react';
import { Title } from '../../Positions/style';
import { WrapperTitle, WrapperRowContent, WrapperRowsContent } from '../styled';
function ContentMarket({ dataMarket }) {
  return (
    <>
      <WrapperTitle>
        <Title className="instrument">Instrument</Title>
        <Title className="position">Position</Title>
        <Title className="mark-price">Mark Price</Title>
        <Title className="est">Est. Liq Price</Title>
        <Title className="funding">Funding Rate</Title>
        <Title className="basis">Basis</Title>
      </WrapperTitle>

      <WrapperRowsContent>
        {!!dataMarket?.length &&
          dataMarket.map((item, index) => {
            return (
              <WrapperRowContent
                color={item?.taker_side === 'bid' ? '#096C7B' : '#A23D52'}
                index={0}
                key={item?.maker_order_id}>
                <p className="instrument">{item?.product}</p>
                <p className="position">{item?.base_size}</p>
                <p className="mark-price">{item?.price}</p>
                <p className="est">{item?.quote_size}</p>
                <p className="funding">{item?.price}</p>
                <p className="basis">{item?.taker_side === 'bid' ? 'BUY' : 'SELL'}</p>
              </WrapperRowContent>
            );
          })}
      </WrapperRowsContent>
    </>
  );
}

export default memo(ContentMarket);
