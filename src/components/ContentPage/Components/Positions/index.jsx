import React from 'react';
import { useWallet } from '../../../../hooks/useWallet';
import ContentPosition from './Component/ContentPosition';
import { WrapperContentPosition, Label } from './style';
export default function Position() {
  const { dataPosition } = useWallet();

  const renderContent = React.useMemo(() => {
    return <ContentPosition dataPosition={dataPosition} />;
  }, [JSON.stringify(dataPosition)]);
  return (
    <WrapperContentPosition>
      <Label>Position</Label>
      {renderContent}
    </WrapperContentPosition>
  );
}
