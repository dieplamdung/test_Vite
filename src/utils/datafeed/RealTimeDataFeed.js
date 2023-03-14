import { getSymbolPrecision } from '../utils';
import FeedAPI from './FeedAPI';

const timeMap = {
  1: '1m',
  5: '5m',
  15: '15m',
  60: '1h',
  1440: '1d'
};

const symbolNames = {
  BNB: { symbol: 'BNB/USDT', name: 'HXRO:BNB/USDT' },
  BTC: { symbol: 'BTC/USD', name: 'HXRO:BTC/USD' },
  ETH: { symbol: 'ETH/USD', name: 'HXRO:ETH/USD' },
  LINK: { symbol: 'LINK/USD', name: 'HXRO:LINK/USD' },
  XRP: { symbol: 'XRP/USD', name: 'HXRO:XRP/USD' },
  XTZ: { symbol: 'XTZ/USD', name: 'HXRO:XTZ/USD' },
  UNI: { symbol: 'UNI/USD', name: 'HXRO:UNI/USD' },
  YFI: { symbol: 'YFI/USD', name: 'HXRO:YFI/USD' },
  LTC: { symbol: 'LTC/USD', name: 'HXRO:LTC/USD' },
  DOT: { symbol: 'DOT/USD', name: 'HXRO:DOT/USD' },
  COMP: { symbol: 'COMP/USD', name: 'HXRO:COMP/USD' },
  AAVE: { symbol: 'AAVE/USD', name: 'HXRO:AAVE/USD' },
  SUSHI: { symbol: 'SUSHI/USD', name: 'HXRO:SUSHI/USD' },
  SNX: { symbol: 'SNX/USD', name: 'HXRO:SNX/USD' },
  DEFI: { symbol: 'DEFI/USD', name: 'HXRO:DEFI/USD' },
  SOL: { symbol: 'SOL/USD', name: 'HXRO:SOL/USD' },
  FTT: { symbol: 'FTT/USD', name: 'HXRO:FTT/USD' },
  DOGE: { symbol: 'DOGE/USD', name: 'HXRO:DOGE/USD' }
};

const configurationData = {
  supported_resolutions: ['1', '5', '15', '60', '1D'],
  exchanges: [{ value: 'HXRO', name: 'HXRO', desc: 'HXRO' }],
  symbols_types: [{ name: 'crypto', value: 'crypto' }]
};

const getHistories = async (source, symbol, resolution, from, to) => {
  let url, opts;
  const [coin] = symbol.split('/');
  const duration = resolution === '1D' ? 1440 : +resolution;

  if (source === 'tixwix') {
    const res = duration * 60; // resolution in second
    url = `/ftx/api/indexes/${coin}/candles?resolution=${res}&start_time=${from}&end_time=${to}`;
    opts = { method: 'GET' };
  } else {
    url = `${'https://tickingprice-dev.hxro.trade'}/history/${coin}?interval=${
      timeMap[duration]
    }&start=${from}&end=${to}`;
    opts = { method: 'GET' };
  }

  const response = await fetch(url, opts);
  const data = await response.json();

  return source === 'tixwix' ? data.result : data;
};

export default class RealTimeDataFeed {
  constructor(symbol, source) {
    this.symbol = symbol;
    this.source = source;
    this.feedId = Math.random().toString(36).substring(7);
  }

  setSource(source) {
    this.source = source;
  }

  setSymbol(symbol) {
    this.symbol = symbol;
  }

  onReady(cb) {
    setTimeout(() => cb(configurationData));
  }

  resolveSymbol(symbolName, onResolve, onError) {
    const { symbol } = symbolNames[this.symbol];

    const symbolInfo = {
      name: symbol,
      description: symbol,
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: 'HXRO',
      minmov: 1,
      pricescale: 10 ** getSymbolPrecision(this.symbol),
      has_intraday: true,
      has_no_volume: true,
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: 'streaming'
    };

    setTimeout(() => onResolve(symbolInfo));
  }

  async getBars(symbolInfo, resolution, { from, to, firstDataRequest }, onResult, onError) {
    try {
      const bars = await getHistories(this.source, this.symbol, resolution, from, to);

      if (firstDataRequest && bars.length > 0) {
        this.lastBar = bars[bars.length - 1];
      }

      // console.log(`df.getBars returned ${bars.length} bar(s)`);
      onResult(bars, { noData: !bars.length });
    } catch (error) {
      // console.error("df.getBars Get error", error);
      onError(error);
    }
  }

  subscribeBars(symbolInfo, resolution, onTick, listenerGuid, onResetCacheNeededCallback) {
    FeedAPI.subscribe(listenerGuid, this.feedId, (ticker) => {
      const coeff = 60000 * (resolution.includes('D') ? 1440 : resolution);
      const rounded = Math.floor(ticker.ts / coeff) * coeff;

      if (rounded > this.lastBar.time) {
        this.lastBar = {
          time: rounded,
          open: this.lastBar.close,
          high: this.lastBar.close,
          low: this.lastBar.close,
          close: ticker.price,
          volume: ticker.volume
        };
      } else {
        // update lastBar candle!
        if (ticker.price < this.lastBar.low) {
          this.lastBar.low = ticker.price;
        } else if (ticker.price > this.lastBar.high) {
          this.lastBar.high = ticker.price;
        }

        this.lastBar.volume += ticker.volume;
        this.lastBar.close = ticker.price;
      }

      onTick(this.lastBar);
    });
  }

  unsubscribeBars(listenerGuid) {
    FeedAPI.unsubscribe(listenerGuid, this.feedId);
  }
}
