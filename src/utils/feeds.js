let feedIdFountain = 0;
function getNewFeedId() {
  const id = feedIdFountain;
  feedIdFountain++;
  return id;
}

class Feed {
  constructor(market, manifest) {
    this.id = getNewFeedId();
    this.market = market;
    this.manifest = manifest;
    this.ticks = [];
    this.tradesRingBuf = [];
    this.ws = null;
    this.solanaConnection = null;
    this.bestask = window.dexterity.Fractional.Nan();
    this.bestbid = window.dexterity.Fractional.Nan();
    this.minprice = window.dexterity.Fractional.Nan();
    this.maxprice = window.dexterity.Fractional.Nan();
    this.bbo = window.dexterity.Fractional.Nan();
    this.markPrice = window.dexterity.Fractional.Nan();
    this.markPriceSpreadEMA = window.dexterity.Fractional.Nan();
    this.fundingRate = window.dexterity.Fractional.Nan();
    this.hasSentFirstMsg = false;
    if (market === null) {
      return;
    }
    this.priceDecimals = window.dexterity.getPriceDecimals(this.market.product.metadata);
    this.startStreaming();
    console.log('FEEDS');

    if (this.market.kind === 'books') {
      console.log('BOOKS');
      this.pollBooks();
    }
  }
  startStreaming() {
    const { asksSocket, bidsSocket } = this.market.manifest.streamBooks(
      this.market.product,
      this.market.marketState,
      this.booksHandler.bind(this)
    );
    this.asksSocket = asksSocket;
    this.bidsSocket = bidsSocket;
    this.tradesSocket = this.market.manifest.streamTrades(
      this.market.product,
      this.market.marketState,
      this.tradesHandler.bind(this)
    );
  }
  addRef() {
    this.asksSocket?.addRef();
    this.bidsSocket?.addRef();
    this.tradesSocket?.addRef();
    return this;
  }
  async pollBooks() {
    const { asksSocket, bidsSocket, markPricesSocket } = this.market.manifest.streamBooks(
      this.market.product,
      this.market.marketState,
      this.booksHandler.bind(this),
      this.markPricesHandler.bind(this)
    );
    this.asksSocket = asksSocket;
    this.bidsSocket = bidsSocket;
    this.markPricesSocket = markPricesSocket;
  }

  markPricesHandler(markPrices) {
    this.markPrice = window.dexterity.Manifest.GetMarkPrice(
      markPrices,
      this.market.product.metadata.productKey
    );
    this.markPriceSpreadEMA = window.dexterity.Manifest.GetMarkPriceOracleMinusBookEwma(
      markPrices,
      this.market.product.metadata.productKey
    );
    this.indexPrice = this.markPrice.add(this.markPriceSpreadEMA);
    if (!this.markPrice.isNan() && !this.markPriceSpreadEMA.isNan()) {
      const prodName = window.dexterity.bytesToString(this.market.product.metadata.name);
      if (prodName.trim().indexOf('PERP') > 0) {
        this.fundingRate = this.markPrice
          .sub(this.indexPrice)
          .div(this.indexPrice)
          .mul(window.dexterity.Fractional.New(100, 0).div(window.dexterity.Fractional.New(24, 0)));
      }
    }
    // this.onMarkPrices();
  }

  kill() {
    this.asksSocket?.close();
    this.bidsSocket?.close();
    this.tradesSocket?.close();
  }
  booksHandler(book) {
    //        const toFractionals = level => {
    //            return {
    //                ...level,
    //                price: window.dexterity.Fractional.From(level.price),
    //                quantity: window.dexterity.Fractional.From(level.quantity)
    //            };
    //        };
    const tickSize = window.dexterity.Fractional.From(this.market.product.metadata.tickSize);
    const toFractionals = (level) => {
      return {
        ...level,
        price: new window.dexterity.Fractional(level.price, new window.BN.BN(0)).mul(tickSize),
        quantity: new window.dexterity.Fractional(
          level.quantity,
          this.market.product.metadata.baseDecimals
        )
      };
    };
    // if (book.asks.length > 0) {const f = toFractionals(book.asks[0]); console.log(book.asks[0].price.toString(), f.price.m.toString(), f.price.exp.toString());}
    const byKey = (a, b) =>
      a.key.length !== b.key.length ? a.key.length < b.key.length : a.key < b.key; // I think this is okay???
    let { ask_orders, bid_orders } = {
      ask_orders: book.asks.map(toFractionals).sort(byKey),
      bid_orders: book.bids.map(toFractionals).sort(byKey)
    };
    if (typeof this.market.filter === 'function') {
      [ask_orders, bid_orders] = this.market.filter(ask_orders, bid_orders);
    }
    this.maxEmptyLevels = 6;
    let hasChanged = this.ticks.length !== ask_orders.length + bid_orders.length;
    for (let i = 0, j = 0; i < this.ticks.length; i++, j++) {
      let orders;
      let offset = 0;
      if (j < ask_orders.length) {
        orders = ask_orders;
      } else if (j < ask_orders.length + bid_orders.length) {
        orders = bid_orders;
        offset = -ask_orders.length;
      } else {
        hasChanged = true;
        break;
      }
      if (
        !this.ticks[i].price.eq(orders[j + offset].price) ||
        !this.ticks[i].quantity.eq(orders[j + offset].quantity)
      ) {
        hasChanged = true;
        break;
      }
    }
    if (!hasChanged && this.hasSentFirstMsg) {
      return;
    }
    if (ask_orders.length > 0 && bid_orders.length > 0) {
      this.maxprice = ask_orders[ask_orders.length - 1].price;
      this.minprice = bid_orders[bid_orders.length - 1].price;
      this.bestask = ask_orders[ask_orders.length - 1].price;
      this.bestbid = bid_orders[0].price;
      this.bestask.add(this.bestbid);
      this.bbo = this.bestask.add(this.bestbid).div(window.dexterity.Fractional.New(2, 0));
    } else if (ask_orders.length > 0) {
      this.maxprice = ask_orders[0].price;
      this.minprice = ask_orders[ask_orders.length - 1].price.sub(
        window.dexterity.Fractional.New(this.maxEmptyLevels, 0)
      );
      this.bestask = ask_orders[ask_orders.length - 1].price;
      this.bestbid = window.dexterity.Fractional.Nan();
      this.bbo = this.bestask;
    } else if (bid_orders.length > 0) {
      this.maxprice = bid_orders[0].price.add(
        window.dexterity.Fractional.New(this.maxEmptyLevels, 0)
      );
      this.minprice = bid_orders[bid_orders.length - 1].price;
      this.bestask = window.dexterity.Fractional.Nan();
      this.bestbid = bid_orders[0].price;
      this.bbo = this.bestbid;
    } else {
      this.bbo = window.dexterity.Fractional.Nan();
      this.bestask = window.dexterity.Fractional.Nan();
      this.bestbid = window.dexterity.Fractional.Nan();
      // don't update min/maxprice so we can render an empty book with those bounds
    }
    // console.log(this.minprice, this.bestbid, this.bbo, this.bestask, this.maxprice, ask_orders, bid_orders);
    this.ticks = [];
    ask_orders.forEach((o) => {
      this.ticks.push({
        id: o.key,
        price: o.price.reduced(), // reduced() copies
        quantity: o.quantity.reduced(),
        isBid: false
      });
    });
    bid_orders.forEach((o) => {
      this.ticks.push({
        id: o.key,
        price: o.price.reduced(), // reduced() copies
        quantity: o.quantity.reduced(), // reduced() copies
        isBid: true
      });
    });
    if (typeof this.onSnapshot === 'function') {
      this.onSnapshot(book);
      this.hasSentFirstMsg = true;
    }
  }
  tradesHandler(trades) {
    // for (const t of trades) {
    //     this.tradesRingBuf.unshift({
    //         takerSide: t.taker_side,
    //         totalQuoteSize: window.dexterity.Fractional.From(t.total_quote_size),
    //         totalBaseSize: window.dexterity.Fractional.From(t.total_base_size),
    //     });
    //     if (this.tradesRingBuf.length > TRADES_RING_BUF_CAP) {
    //         this.tradesRingBuf.splice(TRADES_RING_BUF_CAP);
    //     }
    // }
    const currDate = new Date();
    const currTime =
      String(currDate.getHours()).padStart(2, '0') +
      ':' +
      String(currDate.getMinutes()).padStart(2, '0') +
      ':' +
      String(currDate.getSeconds()).padStart(2, '0');
    // window.ordersAndFillsGridOptions.api.applyTransaction({
    //   add: trades.reverse().map((trade) => {
    //     let takerSide = 'BUY';
    //     if (!trade.isBidAgressor) {
    //       takerSide = 'SELL';
    //     }

    //     return {
    //       qty: trade.quantity,
    //       instrument: this.market.productName,
    //       price: trade.price,
    //       time: currTime,
    //       takerSide: takerSide
    //     };
    //   }),
    //   addIndex: 0
    // });
    if (typeof this.onTrade === 'function') {
      this.onTrade(trades);
    }
  }
}

export { Feed };
