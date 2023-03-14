function clean(s) {
  return window.dexterity.bytesToString(s).trim();
}

class Market {
  constructor(manifest, mpgName, productName, kind) {
    this.manifest = manifest;
    this.mpgName = mpgName;
    this.productName = productName;
    this.kind = kind;
    for (const [pk, { mpg, orderbooks }] of this.manifest.fields.mpgs) {
      if (clean(mpg.name) !== mpgName.trim()) {
        continue;
      }
      if (
        (manifest.fields.rpc === 'https://hxro.rpcpool.com/6be46084-82a3-43fe-a4dd-5aef7b8b2426' &&
          mpgName.trim() === 'BTCUSD' &&
          pk !== 'HiCy6vzuN3yLXD3z35D6nV7bzNLcyrvGLf3uSKuutSLo') ||
        (manifest.fields.rpc === 'https://hxro-hxro-b289.devnet.rpcpool.com/' &&
          pk !== 'HyWxreWnng9ZBDPYpuYugAfpCMkRkJ1oz93oyoybDFLB')
      ) {
        continue;
      }
      this.mpg = mpg;
      this.mpgPk = pk;
    }
  }

  async updateBook() {
    for (const [_, { index, product }] of window.dexterity.Manifest.GetProductsOfMPG(this.mpg)) {
      const meta = window.dexterity.productToMeta(product);
      if (clean(meta.name) === this.productName.trim()) {
        await this.manifest.fetchOrderbook(meta.orderbook);
        const { orderbooks } = this.manifest.fields.mpgs.get(this.mpgPk);
        this.marketState = orderbooks.get(meta.orderbook.toBase58());
        this.productIndex = index;
        // eslint-disable-next-line no-prototype-builtins
        if (product.hasOwnProperty('outright')) {
          this.product = product.outright.outright;
        } else {
          this.product = product.combo.combo;
        }
        break;
      }
    }
  }
}

function Filter(market, f) {
  market.filter = f;
  return market;
}
function FilterBestN(market, n) {
  return Filter(market, (ask_levels, bid_levels) => [
    ask_levels.slice(0, n),
    bid_levels.slice(0, n)
  ]);
}
function FilterBest5(market) {
  return FilterBestN(market, 5);
}
function FilterBest10(market) {
  return FilterBestN(market, 10);
}
function FilterBest15(market) {
  return FilterBestN(market, 15);
}
function Market2String(market) {
  return market.productName;
}

export { Filter, FilterBestN, FilterBest5, FilterBest10, FilterBest15, Market2String, Market };
