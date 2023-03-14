import { useContext } from 'react';
import { WalletContext } from '../contexts/walletContext';

export const useWallet = () => {
  const { dataPnL, connectWallet, disableConnectWallet, dataOrders, dataPosition } =
    useContext(WalletContext);
  return { dataPnL, connectWallet, disableConnectWallet, dataOrders, dataPosition };
};
