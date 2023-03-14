import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { getMarKet } from '../../../../axios/getMarket';
import { useWallet } from '../../../../hooks/useWallet';
import { Label, Title } from '../Positions/style';
import ContentMarket from './Component/ContentMarket';
import {
  WrapperContentMarket,
  WrapperTitle,
  WrapperRowContent,
  WrapperRowsContent
} from './styled';

function Market() {
  const { dataPnL } = useWallet();
  const refTimeout = useRef(null);
  const [dataMarket, setDataMarket] = useState([]);

  useEffect(() => {
    if (refTimeout.current) {
      window.clearTimeout(refTimeout.current);
    }
    refTimeout.current = setTimeout(() => {
      refTimeout.current = null;
      getMarKet()
        .then((res) => {
          if (res?.status !== 200) {
            throw res;
          }
          const data = res?.data?.fills;
          setDataMarket(data || []);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);
  }, [dataPnL]);

  const renderContentMarket = useMemo(() => {
    return <ContentMarket dataMarket={dataMarket} />;
  }, [JSON.stringify(dataMarket)]);

  return (
    <WrapperContentMarket>
      <Label>Market</Label>
      {renderContentMarket}
    </WrapperContentMarket>
  );
}

export default memo(Market);
