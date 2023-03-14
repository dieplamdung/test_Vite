class TraderFunction {
  constructor() {
    this.rpc = null;
    this.network = 'Mainnet';
    this.isConnected = false;
    this.trader = null;
    this.traderUpdateIntervalId = null;
    this.activeMpgPk = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.activeMpg = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.activeMpgName = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.activeProduct = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.activeProductIndex = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.activeProductName = null; // has to be de-coupled from trader because could be viewing markets without trg
    this.mpgs = new Map();
    this.trgs = new Map();
    this.pubkey = null;
    this.provider = null;
    this.walletPubkey = null;
    this.dataOption = [];
  }

  returnDataOrder() {
    if (this.trader) {
      const rows = [];
      const openOrders = this.trader.getOpenOrders();

      openOrders.forEach((order) => {
        let side = 'BUY';
        if (!order.isBid) {
          side = 'SELL';
        }
        rows.push({
          instrument: order.productName,
          productIndex: order.productIndex.toString(),
          id: order.id.toString(),
          price: order.price.toString(),
          qty: order.qty.toString(),
          side: side
        });
      });

      return rows;
    }
  }

  async returnDataPosition() {
    if (this.trader) {
      const position = this.trader.getPositions();

      const rows = [];
      for (const [name, amt] of position) {
        if (amt.isZero()) {
          continue;
        }
        rows.push({ instrument: name, position: amt.toString() });
      }

      return rows;
    }
  }

  returnData() {
    const portfolio = this.trader
      ? this.trader.getPortfolioValue()
      : window.dexterity.Fractional.Zero();

    const positionVal = this.trader
      ? this.trader.getPositionValue()
      : window.dexterity.Fractional.Zero();

    const excess = this.trader ? this.trader.getExcessMargin() : window.dexterity.Fractional.Zero();
    const excessPercent = excess?.mul(window.dexterity.Fractional.New(100, 0)).div(portfolio);
    const requiredPercent = window.dexterity.Fractional.New(100, 0).sub(excessPercent);
    const required = portfolio.sub(excess);
    const requiredMargin = (requiredPercent.textContent =
      required.toString(2) + ' (' + requiredPercent?.toString(2) + '%)');

    const excessMargin = excess?.toString(2) + ' (' + excessPercent?.toString(2) + '%)';

    const pnlValue = this.trader ? this.trader.getPnL() : window.dexterity.Fractional.Zero();
    const pnl = pnlValue?.toString(2);

    const newData = {
      walletPubkey: this.walletPubkey,
      walletAddress: this.pubkey + '',
      portfolio: portfolio?.toString(2),
      positionVal: positionVal?.toString(2),
      requiredMargin,
      excessMargin,
      pnl,
      dataOption: this.dataOption
    };
    return newData;
  }

  connect(callback) {
    this.provider = window.phantom.solana;
    window.dexterityWallet = this.provider;
    this.provider?.on('connect', async (pk) => {
      this.walletPubkey = this.shortPkStr(pk);
      await this.updateMPGs();
      await this.updateTrgSelect(callback);
      this.isConnected = true;

      const dataWallet = this.returnData();
      callback({ dataWallet });
    });
    this.provider.connect();
  }

  setActiveProduct(productIndex = null, productName = null) {
    if (this.activeMpg == null) {
      return;
    }
    if (productIndex !== null) {
      this.activeProductIndex = productIndex;
    } else if (productName !== null) {
      let i = -1;
      for (const p of this.activeMpg.marketProducts.array) {
        i++;
        if (
          window.dexterity.productStatus(p, this.activeMpg.marketProducts.array) === 'uninitialized'
        ) {
          continue;
        }
        if (
          window.dexterity.bytesToString(window.dexterity.productToMeta(p).name).trim() ===
          productName
        ) {
          this.activeProductIndex = i;
          break;
        }
      }
    }
    this.activeProduct = this.activeMpg.marketProducts.array[this.activeProductIndex];
    const meta = window.dexterity.productToMeta(this.activeProduct);
    this.activeProductName = window.dexterity.bytesToString(meta.name).trim();
  }

  async getManifest(useCache = true) {
    if (!window.dexterityWallet) {
      return;
    }
    const manifest = await window.dexterity.getManifest(
      'https://hxro.rpcpool.com/6be46084-82a3-43fe-a4dd-5aef7b8b2426',
      useCache,
      window.dexterityWallet
    );
    return manifest;
  }

  async updateMPGs() {
    const manifest = await this.getManifest(false);
    if (!manifest) {
      return;
    }

    for (const [_, { pubkey, mpg, orderbooks }] of manifest.fields.mpgs) {
      const rpc = localStorage.getItem('rpc');
      if (
        (rpc === 'https://hxro.rpcpool.com/6be46084-82a3-43fe-a4dd-5aef7b8b2426' &&
          pubkey.toBase58() !== 'HiCy6vzuN3yLXD3z35D6nV7bzNLcyrvGLf3uSKuutSLo') ||
        (rpc === 'https://hxro-hxro-b289.devnet.rpcpool.com/' &&
          pubkey.toBase58() !== 'HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB')
      ) {
        continue;
      }

      this.mpgs.clear();
      this.mpgs.set(pubkey, mpg);
      this.activeMpg = mpg;
      this.activeMpgPk = pubkey;
      this.setActiveProduct(0);
    }
  }

  async updateTrgSelect(callback) {
    const manifest = await this.getManifest();
    const trgs = await manifest.getTRGsOfWallet(this.activeMpgPk);
    trgs.sort((a, b) => a.pubkey < b.pubkey);
    if (trgs.length === 0) {
      this.pubkey = '';
    } else {
      this.pubkey = trgs[0].pubkey;
    }
    await this.selectTrg(trgs[0].pubkey, callback);
  }

  async selectTrg(pubkey, callback) {
    const manifest = await this.getManifest();
    this.trader = new window.dexterity.Trader(manifest, pubkey);
    await this.trader.connect(
      (async () => {
        if (this.isConnected) {
          const dataWallet = this.returnData();

          const dataOrders = this.returnDataOrder();

          const dataPosition = await this.returnDataPosition();

          callback({ dataWallet, dataOrders, dataPosition });
        }
      }).bind(this)
    );
  }

  shortPkStr(pk) {
    const pkstr = pk.toBase58();
    return pkstr.slice(0, 4) + '...' + pkstr.slice(-4);
  }

  disConnect() {
    window.dexterityWallet = null;
    this.provider.off('disconnect');
    this.provider.on('disconnect', (_) => {
      this.isConnected = false;
      this.trader.disconnect();
      this.trader = null;
    });
    this.provider?.disconnect();
  }
}
export default TraderFunction;
