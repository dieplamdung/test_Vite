import React, { memo, useMemo } from 'react';
import { useWallet } from '../../../../hooks/useWallet';
import ContentOrder from './Components/ContentOrder';

function Orders() {
  const { dataOrders } = useWallet();

  const renderContent = useMemo(() => {
    return <ContentOrder dataOrders={dataOrders} />;
  }, [JSON.stringify(dataOrders)]);

  return <>{renderContent}</>;
}

export default memo(Orders);
