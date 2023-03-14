const ORDER_STATE_SENT = 0;
const ORDER_STATE_LIVE = 1;
const ORDER_STATE_SENT_CANCELED = 2;
const ORDER_STATE_CANCELED = 3;
const ORDER_STATE_REJECTED = 4;
const ORDER_STATE_FILLED = 5;

var orderIdFountain = 0;
function getNewOrderId() {
  const id = orderIdFountain;
  orderIdFountain++;
  return id;
}

var clobIdFountain = 0;
function getNewClobId() {
  const id = clobIdFountain;
  clobIdFountain++;
  return id;
}

class Clob {
  constructor(feed, trader = null) {
    this.id = getNewClobId();
    this.feed = feed;
    this.trader = trader;
    this.isKilled = false;
  }

  kill() {
    if (this.isKilled) return;
    this.feed.kill();
    this.isKilled = true;
  }

  cancelOrders(orderIds) {
    this.trader.cancelOrders(this.feed.market.productIndex, orderIds);
    this.Render();
  }

  placeOrder(params) {
    if (this.isKilled) {
      console.log('did not render because clob', this.id, 'was killed already');
      return;
    }
    const { tickId, isBid, size, price } = params;
    if (
      typeof isBid === 'undefined' ||
      typeof size === 'undefined' ||
      typeof price === 'undefined'
    ) {
      console.error('placeOrder error message: one of tickId, isBid, size, price is undefined');
      console.error(tickId, isBid, size, price);
      console.error('params', params);
      console.error('clob', this);
      console.error('placeOrder error message done');
      return;
    }
    if (size <= 0) return;
    const order = {
      id: getNewOrderId(),
      isBid,
      size,
      price
    };
    this.trader.sendNewOrder(order, this.feed.market.productIndex);
    this.Render();
  }

  UpdateOpenOrders() {}

  RenderMarkPrices() {
    console.log('================', this.feed.markPrice.isNan());
  }

  Render() {
    console.log('===', this.feed);
  }
}

export { Clob };
