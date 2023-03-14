import { StyledHeader, WrapperGroupButton, WrapperAccount } from './Header.style';
import Button from '../Button';
import { useWallet } from '../../hooks/useWallet';
import { memo, useEffect, useMemo, useState } from 'react';
import IconLoading from '../IconLoading';
import ModalComponent from './Component/Modal';
import ContentHeader from './Component/ContentHeader';

const Header = () => {
  const { dataPnL, connectWallet, disableConnectWallet } = useWallet();
  const [dataWallet, setDataWallet] = useState({});
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const provider = localStorage.getItem('provider');
    if (provider === 'phantom') {
      setLoading(true);
    }
    setDataWallet(dataPnL);
    if (Object.keys(dataPnL).length) {
      setLoading(false);
    }
  }, [dataPnL]);
  const handleClickConnect = () => {
    setLoading(true);
    connectWallet?.();
  };
  const handleClickDisconnect = () => {
    disableConnectWallet?.();
  };

  const formatWallet = (wallet) => {
    if (!wallet) {
      return '';
    }
    const lentWallet = wallet.length;

    return `${wallet.substring(0, 5)}***${wallet.substring(lentWallet - 5, lentWallet)}`;
  };

  const Header = useMemo(() => {
    return <ContentHeader dataWallet={dataWallet} />;
  }, [JSON.stringify(dataWallet)]);

  return (
    <StyledHeader>
      {Header}
      <WrapperGroupButton>
        <WrapperAccount>
          <select
            value={dataWallet?.walletAddress || ''}
            className="select-account"
            onChange={() => {}}>
            <option value="" defaultValue disabled hidden>
              Account...
            </option>
            <option value={dataWallet?.walletAddress || ''}>
              {formatWallet(dataWallet?.walletAddress || '')}
            </option>
          </select>
        </WrapperAccount>
        <Button
          className="button-deposit"
          onClick={() => {
            dataWallet?.walletPubkey && setOpenModal(true);
          }}>
          Deposit/Withdraw
        </Button>
        <Button
          className="connect-wallet"
          onClick={() => {
            loading
              ? ''
              : dataWallet?.walletPubkey
              ? handleClickDisconnect()
              : handleClickConnect();
          }}>
          {dataWallet?.walletPubkey ? 'Wallet Connected' : 'Connect Wallet'}
          {loading && <IconLoading />}
        </Button>
      </WrapperGroupButton>
      <ModalComponent
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </StyledHeader>
  );
};

export default memo(Header);
