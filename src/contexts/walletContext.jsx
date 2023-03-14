import { useEffect, useState, createContext } from 'react';

import * as BN from 'bn.js';
import dexterity from '@hxronetwork/dexterity-ts';
import { PublicKey } from '@solana/web3.js';
import TraderFunction from '@utils/trader.js';
// import * as markets from '../utils/markets.js';

window.web3 = { PublicKey };
window.BN = { ...BN };
window.dexterity = { ...dexterity };

export const WalletContext = createContext({
  dataPnL: '',
  walletPubkey: '',
  walletAddress: '',
  connectWallet: () => {},
  disableConnectWallet: () => {},
  dataOrders: [],
  dataPosition: []
});

const traderFunction = new TraderFunction();

export const WalletProvider = ({ children }) => {
  const [dataPnL, setDataPnL] = useState({});
  const [dataOrders, setDataOrders] = useState([]);
  const [dataPosition, setDataPosition] = useState([]);

  useEffect(() => {
    window.BN.BN.prototype.toJSON = function () {
      return window.BN.BN.prototype.toString.call(this, 10);
    }; // toJSON was originally alias for toString(16); we want decimal not hex

    window.network2rpc = new Map();
    let network2rpc = window.network2rpc;
    let rpc = localStorage.getItem('rpc');
    network2rpc.set('Mainnet', 'https://hxro.rpcpool.com/6be46084-82a3-43fe-a4dd-5aef7b8b2426');
    network2rpc.set('Devnet', 'https://hxro-hxro-b289.devnet.rpcpool.com/');
    let network = 'Mainnet';
    if (rpc === null || typeof rpc !== 'string') {
      rpc = network2rpc.get(network);
    } else {
      let isNetworkSet = false;
      for (const [n, r] of network2rpc) {
        if (r === rpc) {
          isNetworkSet = true;
          break;
        }
      }
      if (!isNetworkSet) {
        network = rpc;
        network2rpc.set(network, rpc);
      }
    }
    localStorage.setItem('rpc', rpc);
    localStorage.setItem('network', network);

    const provider = localStorage.getItem('provider');
    if (provider === 'phantom') {
      connectWallet();
    }
  }, []);

  const connectWallet = () => {
    traderFunction.connect(async (data) => {
      setDataPnL(data?.dataWallet || {});
      setDataOrders(data?.dataOrders || []);
      setDataPosition(data?.dataPosition || []);

      localStorage.setItem('provider', 'phantom');
      // const manifest = await traderFunction.getManifest(true);
      // const market = new markets.Market(
      //   manifest,
      //   window.dexterity.bytesToString(traderFunction.activeMpg.name),
      //   traderFunction.activeProductName,
      //   'books'
      // );
      // await market.updateBook();
      // console.log('market', market);
      // const someClob = new Clob(new Feed(market), traderFunction);
      // someClob.feed.onMarkPrices = (msg) => {
      //   someClob.RenderMarkPrices();
      // };
      // console.log('someClob', `$${someClob.feed.markPrice.toString()}`);
    });
  };

  const disableConnectWallet = () => {
    localStorage.removeItem('provider');
    setDataPnL({});
    setDataOrders([]);
    setDataPosition([]);
    traderFunction.disConnect();
  };

  return (
    <WalletContext.Provider
      value={{ dataPnL, dataOrders, dataPosition, connectWallet, disableConnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
