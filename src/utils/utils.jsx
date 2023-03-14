import React from 'react';
import axios from 'axios';
import * as moment from 'moment';
import colors from './colors';
// import { getTransactions } from '../IdentityAPI/Transactions/index';
// import { removeRefreshToken, removeToken } from '../../utils/auth';

const REACT_APP_HXROBOT_WS = 'wss://staging.hxrobot.io';
const REACT_APP_LOCALE_URL = 'https://8snq4ajzub.execute-api.eu-west-2.amazonaws.com/uat';
// Setup the default axios instance
axios.defaults.headers.common['X-Trader-Type'] = 'Manual';

// axios.interceptors.response.use(
//   (r) => r,
//   (e) => {
//     const msg = e.response?.data?.message || e.response?.data?.detail || e.message;

//     if (msg === 'Your account is locked' && !window.location.pathname.includes('/login')) {
//       removeToken();
//       removeRefreshToken();
//       window.location = `${getWebsiteUrl()}/login`;
//     }
//     return Promise.reject(e);
//   }
// );

export const getBasename = () => {
  const path = window.location.pathname;
  const regex = /^\/(dev|uat|live)\//;
  return regex.test(path) ? path.match(regex)[1] : '';
};

export const getWebsiteUrl = () => {
  const basename = getBasename();
  return basename ? `${window.location.origin}/${getBasename()}` : window.location.origin;
};

export const calculateTimeLeft = (expiryDate, trimDays = true) => {
  let difference = new Date(expiryDate) - new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    duration: 0
  };

  if (difference > 0) {
    timeLeft = {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      duration: Math.floor(difference / 1000)
    };

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    if (trimDays) {
      timeLeft.hours += days * 24;
    } else {
      timeLeft.days = days;
    }
  }

  return timeLeft;
};

export function addZero(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

export function msToTime(s, clock) {
  if (s <= 0) return ':00';
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  if (clock) {
    if (hrs) {
      secs = addZero(secs);
      mins = addZero(mins);
      return hrs + ':' + mins;
    }
  }

  if (hrs) {
    secs = addZero(secs);
    mins = addZero(mins);
    return hrs + ':' + mins + ':' + secs;
  }
  if (mins) {
    secs = addZero(secs);
    return mins + ':' + secs;
  }
  if (10 > secs) {
    secs = addZero(secs);
    return ':' + secs;
  }

  if (0 >= secs) return ':00';
  return ':' + secs;
}

export function currencyFormat(num, locale) {
  let curr = '$';

  switch (locale) {
    case 'en-US':
      curr = '$';
      break;
    case 'DE':
      curr = ' €';
      break;
    default:
      curr = '$';
  }

  return (
    num
      .toFixed(2) // always two decimal digits
      .replace('.', ',') // replace decimal point character with ,
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + curr
  ); // use . as a separator
}

export function formatNumber(num, decimal, min = decimal) {
  if (num === null || num === undefined || isNaN(num)) return 0;

  const numberFormat = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: min,
    maximumFractionDigits: decimal
  });
  return numberFormat.format(+num);
}

export function satsFormat(assetType, value, unit = false) {
  const { pair } = coinMap[assetType] || {};

  const formattedVal = value
    ? assetType === 'BTC'
      ? formatNumber(value * 100000000, 0)
      : formatPairNumber(pair, value)
    : '0';
  const suffix = assetType === 'BTC' ? ' Sats' : unit ? ` ${assetType}` : '';
  return `${formattedVal}${suffix}`;
}

const countDecimals = (value) => {
  if (Math.floor(value) === value) return 0;
  return value.toString().split('.')[1]?.length || 0;
};

export function formattedStrike(strike) {
  if (!strike || strike === null || strike === undefined || isNaN(strike)) {
    return 0;
  }
  let strikeval = strike;
  let numDecimals = countDecimals(strike);
  if (numDecimals > 0) {
    if (numDecimals % 2 == 0) {
      strikeval = formatNumber(strike, numDecimals);
      return strikeval;
    } else {
      strikeval = formatNumber(strike, numDecimals + 1);
      return strikeval;
    }
  } else {
    return formatNumber(strikeval);
  }
}

export function truncateAssetNumber(assetType, number, useGrouping = true, map = assetMap) {
  const formatter = new Intl.NumberFormat('en-US', {
    useGrouping,
    minimumFractionDigits: 0,
    maximumFractionDigits: 20
  });

  const digits = map[assetType];
  return formatter
    .formatToParts(+number)
    .map(({ type, value }) => {
      if (type !== 'fraction' || !value || value.length < digits) {
        return value;
      }
      return value.substring(0, digits);
    })
    .join('');
}

// Setting list of coins twice to avoid ticker flickering on wider screen
export const allCoinLists = {
  moonrekt: ['BTC'], // Network does not have 'BNB', and We don't have SOL pricing yet, let just support BTC and ETH only
  tixwix: [
    'BTC',
    'ETH',
    'BNB',
    'LINK',
    'XRP',
    'XTZ',
    'UNI',
    'YFI',
    'LTC',
    'DOT',
    'COMP',
    'AAVE',
    'SUSHI',
    'SNX',
    'SOL',
    'DEFI',
    'FTT',
    'DOGE'
  ].sort()
};

export const acceptedCurrency = [
  'BTC',
  'ETH',
  'BNB',
  'LINK',
  'XRP',
  'XTZ',
  'UNI',
  'YFI',
  'LTC',
  'DOT',
  'COMP',
  'AAVE',
  'SUSHI',
  'SNX',
  'SOL',
  'DEFI',
  'FTT',
  'DOGE'
];

export const coinMap = {
  BTC: {
    label: 'BTC/USD',
    pair: 'BTCUSD',
    fullLabel: 'Bitcoin (BTC) / USD Dollar',
    shortLabel: 'Bitcoin (BTC)'
  },
  ETH: {
    label: 'ETH/USD',
    pair: 'ETHUSD',
    fullLabel: 'Ethereum (ETH) / USD Dollar',
    shortLabel: 'Ethereum (ETH)'
  },
  BNB: {
    label: 'BNB/USDT',
    pair: 'BNBUSDT',
    fullLabel: 'Binance (BNB) / USDT',
    shortLabel: 'Binance (BNB)'
  },
  LINK: {
    label: 'LINK/USD',
    pair: 'LINKUSD',
    fullLabel: 'Link (LINK) / USD Dollar',
    shortLabel: 'Link (LINK)'
  },
  XRP: {
    label: 'XRP/USD',
    pair: 'XRPUSD',
    fullLabel: 'XRP (XRP) / USD Dollar',
    shortLabel: 'XRP (XRP)'
  },
  XTZ: {
    label: 'XTZ/USD',
    pair: 'XTZUSD',
    fullLabel: 'Tezos (XTZ) / USD Dollar',
    shortLabel: 'Tezos (XTZ)'
  },
  UNI: {
    label: 'UNI/USD',
    pair: 'UNIUSD',
    fullLabel: 'Uniswap (UNI) / USD Dollar',
    shortLabel: 'Uniswap (UNI)'
  },
  YFI: {
    label: 'YFI/USD',
    pair: 'YFIUSD',
    fullLabel: 'yearn.finance (YFI) / USD Dollar',
    shortLabel: 'yearn.finance (YFI)'
  },
  LTC: {
    label: 'LTC/USD',
    pair: 'LTCUSD',
    fullLabel: 'Litecoin (LTC) / USD Dollar',
    shortLabel: 'Litecoin (LTC)'
  },
  DOT: {
    label: 'DOT/USD',
    pair: 'DOTUSD',
    fullLabel: 'Polkadot (DOT) / USD Dollar',
    shortLabel: 'Polkadot (DOT)'
  },
  COMP: {
    label: 'COMP/USD',
    pair: 'COMPUSD',
    fullLabel: 'Compound (COMP) / USD Dollar',
    shortLabel: 'Compound (COMP)'
  },
  AAVE: {
    label: 'AAVE/USD',
    pair: 'AAVEUSD',
    fullLabel: 'Aave (AAVE) / USD Dollar',
    shortLabel: 'Aave (AAVE)'
  },
  SUSHI: {
    label: 'SUSHI/USD',
    pair: 'SUSHIUSD',
    fullLabel: 'SushiSwap (SUSHI) / USD Dollar',
    shortLabel: 'SushiSwap (SUSHI)'
  },
  SNX: {
    label: 'SNX/USD',
    pair: 'SNXUSD',
    fullLabel: 'Synthetix (SNX) / USD Dollar',
    shortLabel: 'Synthetix (SNX)'
  },
  SOL: {
    label: 'SOL/USD',
    pair: 'SOLUSD',
    fullLabel: 'Solana (SOL) / USD Dollar',
    shortLabel: 'Solana (SOL)'
  },
  DEFI: {
    label: 'DEFI/USD',
    pair: 'DEFIUSD',
    fullLabel: 'DeFiChain (DFI) / USD Dollar',
    shortLabel: 'DeFiChain (DFI)'
  },
  FTT: {
    label: 'FTT/USD',
    pair: 'FTTUSD',
    fullLabel: 'FTX Token (FTT) / USD Dollar',
    shortLabel: 'FTX Token (FTT'
  },
  DOGE: {
    label: 'DOGE/USD',
    pair: 'DOGEUSD',
    fullLabel: 'Dogecoin (DOGE) / USD Dollar',
    shortLabel: 'Dogecoin (DOGE)'
  }
};

const assetMap = {
  HXRO: 2,
  BTC: 8,
  USDT: 6,
  ETH: 8,
  USDC: 2,
  USDC_SPL: 2,
  USD: 2,
  LINK: 3,
  XRP: 4,
  XTZ: 3,
  UNI: 3,
  YFI: 2,
  LTC: 2,
  DOT: 3,
  COMP: 2,
  AAVE: 2,
  SUSHI: 4,
  SNX: 3,
  SOL: 2,
  DEFI: 1,
  FTT: 3,
  DOGE: 5
};
export function formatAssetNumber(assetType, num, map = assetMap) {
  return formatNumber(num, map[assetType]);
}

const pairMap = {
  BTCUSD: 2,
  ETHUSD: 3,
  BNBUSDT: 3,
  LINKUSD: 3,
  XRPUSD: 4,
  XTZUSD: 3,
  UNIUSD: 3,
  YFIUSD: 2,
  LTCUSD: 2,
  DOTUSD: 3,
  COMPUSD: 2,
  AAVEUSD: 2,
  SUSHIUSD: 4,
  SNXUSD: 3,
  SOLUSD: 2,
  DEFIUSD: 1,
  FTTUSD: 3,
  DOGEUSD: 5
};
export function formatPairNumber(pair, num) {
  return formatNumber(num, pairMap[pair]);
}

export const getSymbolPrecision = (coin) => {
  const { pair } = coinMap[coin];
  return pairMap[pair];
};

export function findIndexByClosePriceUnplayed(pricing, position) {
  const { livePrice, closePrice } = pricing[0];

  if (position === 'moon') {
    if (livePrice?.blendedPrice > closePrice?.blendedPrice) {
      return 12;
    } else {
      return 11;
    }
  }
  if (position === 'rekt') {
    if (livePrice?.blendedPrice > closePrice?.blendedPrice) {
      return 13;
    } else {
      return 14;
    }
  }
  if (livePrice?.blendedPrice > closePrice?.blendedPrice) {
    //if live is larger, then its moon
    return 15;
  } else return 16;
}

export function shotClockColorizer(
  date,
  pathName,
  time,
  setSoundStatePlay,
  soundStatePlay,
  colorDefault
) {
  let s = Date.parse(date) - time;
  if (isNaN(s) || (pathName !== '/' && pathName !== '/labs')) {
    return (
      <>
        <span style={colorDefault ? { color: colorDefault } : { color: colors.gray }}>00</span>
        <span style={colorDefault ? { color: colorDefault } : { color: colors.gray }}>:00</span>
        <span>:00</span>
      </>
    );
  }
  if (s < 0) {
    return (
      <>
        <span style={colorDefault ? { color: colorDefault } : { color: colors.gray }}>00:</span>
        <span style={colorDefault ? { color: colorDefault } : { color: colors.gray }}>00</span>
        <span style={{ color: colors.pink }}>:00</span>
      </>
    );
  } else {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;

    if (hrs) {
      secs = addZero(secs);
      mins = addZero(mins);

      return (
        <>
          <span>{hrs}:</span> <span>{mins}</span> <span> :{secs}</span>
        </>
      );
    }
    if (mins) {
      secs = addZero(secs);
      hrs = addZero(hrs);
      mins = addZero(mins);

      return (
        <>
          <span style={colorDefault ? { color: colorDefault } : { color: colors.gray }}>
            {hrs}:
          </span>{' '}
          <span>{mins}</span>
          <span>:{secs}</span>
        </>
      );
    }

    hrs = addZero(hrs);
    mins = addZero(mins);
    if (secs < 0) {
      return (
        <>
          <span style={colorDefault ? { color: colorDefault } : { color: colors.gray }}>00:</span>
          <span style={colorDefault ? { color: colorDefault } : { color: colors.gray }}>00</span>
          <span style={{ color: colors.pink }}>:00</span>
        </>
      );
    }
    if (secs <= 5 && !soundStatePlay) {
      setSoundStatePlay(true);
    }
    secs = addZero(secs);

    return (
      <>
        <span style={colorDefault ? { color: colorDefault } : { color: colors.gray }}>{hrs}:</span>
        <span style={colorDefault ? { color: colorDefault } : { color: colors.gray }}>{mins}</span>
        <span style={{ color: 10 > parseInt(secs) ? colors.pink : colors.green }}>:{secs}</span>
      </>
    );
  }
}

export const BTC = 'wss://btc.data.hxro.io/live';
export const BNB = 'wss://bnb.live.hxro.io/live';
export const ETH = 'wss://eth.live.hxro.io/live';

const noop = () => {};
export const wsConnect = (
  link,
  { retry = Infinity, onMessage, onOpen = noop, onClose = noop, onReconnect = noop, ping }
) => {
  const ws = new WebSocket(link);
  let pingInterval;
  ws.onopen = () => {
    console.log(`ws-connect: ${link} opened`);
    onOpen(ws);
    if (ping) {
      pingInterval = ping(ws);
    }
  };

  ws.onmessage = onMessage;

  ws.onclose = (e) => {
    console.log(`ws-connect: ${link} closed`, e);
    if (pingInterval) {
      clearInterval(pingInterval);
    }
    if (retry === 0) {
      return onClose(e);
    }

    setTimeout(() => {
      console.log(`ws-connect: retry ${link} - remaining: ${retry}`);
      onReconnect();
      wsConnect(link, { retry: retry - 1, onMessage, onOpen, onClose, onReconnect, ping });
    }, 1000);
  };

  ws.onerror = (e) => {
    console.error(`ws-connect error`, e);
    ws.close();
  };
};

export const ftxWebSocket = ({
  retry = Infinity,
  onMessage,
  onClose = noop,
  onReconnect = noop
}) => {
  wsConnect('wss://ftx.com/ws', {
    retry,
    ping: (ws) => setInterval(() => ws.send(JSON.stringify({ op: 'ping' })), 15000),
    onOpen: (ws) => {
      // Subscribe to market price change
      ['LINK-PERP', 'XRP-PERP', 'XTZ-PERP', 'BTC-PERP', 'ETH-PERP', 'BNB/USDT', 'UNI-PERP'].forEach(
        (market) => {
          ws.send(JSON.stringify({ op: 'subscribe', channel: 'ticker', market }));
        }
      );
    },
    onMessage: (evt) => {
      const { market, data, type } = JSON.parse(evt.data);
      if (type === 'update') {
        const [from_sym] = market.split(/[-/]/);
        const to_sym = from_sym === 'BNB' ? 'USDT' : 'USD';
        onMessage({
          from_sym,
          to_sym,
          price: data.last,
          ts: Math.round(data.time),
          volume: 0,
          source: 'tixwix'
        });
      }
    },
    onReconnect,
    onClose
  });
};

const ftxFutureIndices = [
  'LINK-PERP',
  'XRP-PERP',
  'XTZ-PERP',
  'BTC-PERP',
  'ETH-PERP',
  'BNB-PERP',
  'UNI-PERP',
  'YFI-PERP',
  'LTC-PERP',
  'DOT-PERP',
  'COMP-PERP',
  'AAVE-PERP',
  'SUSHI-PERP',
  'SNX-PERP',
  'SOL-PERP',
  'DEFI-PERP',
  'FTT-PERP',
  'DOGE-PERP'
];

export const ftxFuture = async ({ onMessage }) => {
  try {
    const { data } = await axios('/ftx/api/futures');

    (data?.result || []).forEach(({ name, index }) => {
      if (!ftxFutureIndices.includes(name)) {
        return;
      }

      const [from_sym] = name.split(/[-/]/);
      const to_sym = from_sym === 'BNB' ? 'USDT' : 'USD';
      onMessage({
        from_sym,
        to_sym,
        price: index,
        ts: Date.now(),
        volume: 0,
        source: 'tixwix'
      });
    });
  } catch (err) {
    console.error('Error fetching ftx', err);
  }
};

export const getBodPrices = async () => {
  const endTime = moment.utc().unix();
  const startTime = moment.utc().add(-1, 'day').unix();

  // const tixwix = allCoinLists.tixwix.map((market) => {
  //   return axios
  //     .get(`/ftx/api/indexes/${market}/candles?resolution=86400&start_time=${startTime}&end_time=${endTime}`)
  //     .then(({ data }) => ({ market, type: 'tixwix', price: data?.result[0]?.open }));
  // });

  const moonrekt = allCoinLists.moonrekt.map((market) => {
    const url = `${"https://tickingprice-dev.hxro.trade"}/${market.toLowerCase()}/last/day`;
    return fetch(url)
      .then((r) => r.json())
      .then((data) => ({ market, type: 'moonrekt', price: data?.open }));
  });

  return Promise.allSettled([...moonrekt]).then((data) =>
    data.reduce((acc, { status, value, reason }) => {
      if (status === 'fulfilled') {
        acc.push(value);
      } else {
        console.error('getBodPrice rejected', reason);
      }
      return acc;
    }, [])
  );
};

export const reduceWalletForAssetType = (assetType, accountType, key) => {
  return (all, item) => {
    if (assetType === 'HXRO' && item.assetType === 'HXRO') {
      if (accountType === item.accountType) {
        return item[key];
      }
    } else if (assetType === 'BTC' && item.assetType === 'BTC') {
      if (accountType === item.accountType) {
        return item[key];
      }
    } else if (assetType === 'ETH' && item.assetType === 'ETH') {
      if (accountType === item.accountType) {
        return item[key];
      }
    } else if (assetType === 'USDT' && item.assetType === 'USDT') {
      if (accountType === item.accountType) {
        return item[key];
      }
    }

    return all;
  };
};

export const getAvailableBalance = (accounts, assetType) => {
  const { balance = 0, pendingWithdrawals = 0 } =
    (accounts || []).find((a) => a.assetType === assetType) || {};
  return balance - pendingWithdrawals;
};

export const removeContest = async (props) => {
  const response = await fetch(
    `${process.env.REACT_APP_URL_HXROAPI}/contestentry/remove-contest-entry`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`
      },
      body: JSON.stringify({
        contestId: props.contestId,
        userId: props.id
      })
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
};

export const enterContest = async ({
  contestId,
  wager: contestWager,
  assetType,
  token,
  cardType,
  userId
}) => {
  let wager = contestWager;
  const response = await fetch(
    `${process.env.REACT_APP_URL_HXROAPI}/contestentry/add-contest-entry`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        contestType: 'OverUnder',
        direction: cardType,
        contestId,
        userId,
        wager,
        assetType
      })
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
};

export function payoutMultiMoon({ prizePool, moonPool }) {
  return ((prizePool - prizePool * 0.03) / moonPool).toFixed(2);
}

export function payoutMultiRekt({ prizePool, rektPool }) {
  return ((prizePool - prizePool * 0.03) / rektPool).toFixed(2);
}

export function winCheck(contest) {
  const { livePrice, closePrice } = contest.instrumentPrices[0];
  const { position } = contest;

  if (!position) {
    return false;
  }
  if (position === 'moon') {
    if (closePrice.blendedPrice > livePrice.blendedPrice) {
      return true;
    } else {
      return false;
    }
  }
  if (position === 'rekt') {
    if (livePrice.blendedPrice > closePrice.blendedPrice) {
      return true;
    } else {
      return false;
    }
  }
}

export const classNameAllocation = (item) => {
  const spaceRegex = / /gi;
  if (item === '#') {
    return 'col-rank';
  } else {
    return 'col-' + item.replace(spaceRegex, '');
  }
};

export function scrollHorizontally(e) {
  e = window.event || e;
  var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
  document.getElementsByClassName('scroll-btn-container')[0].scrollLeft -= delta * 40; // Multiplied by 40
  e.preventDefault();
}

export function getContestName(contest) {
  const cryptoMap = {
    BNB: 'BNB',
    ETH: 'ETH',
    BTC: 'BTC'
  };
  let contestName = contest.name.slice(0, 3);

  return cryptoMap[contestName] ? cryptoMap[contestName] : contest.name;
}

export const roundDown = (value, decimals) => {
  return Number(Math.floor(value + 'e' + decimals) + 'e-' + decimals);
};

// export const checkDeposits = async (auth) => {
//   const transactionResponse = await getTransactions(auth.id, auth.token);

//   const depositList = transactionResponse.filter((a) => a.transactionType === 'Deposit');

//   if (depositList.length > 0) {
//     return true;
//   } else {
//     return false;
//   }
// };

export const copyToClipboard = (text) => {
  const textArea = document.createElement('textarea');
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';

  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    return document.execCommand('copy');
  } catch (err) {
    console.error('Oops, unable to copy', err);
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
};

export const downloadImage = async (src, fileName) => {
  const image = await fetch(src);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const link = document.createElement('a');
  link.href = imageURL;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function validEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const loadSavedStatte = (name, initialState) => {
  try {
    const savedState = JSON.parse(localStorage.getItem(name));
    return {
      ...initialState,
      ...savedState,
      assetType: 'USDC'
    };
  } catch (err) {
    return initialState;
  }
};

function getCookie(cname) {
  let name = cname + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function buildWsUrl(channel, token) {
  let url = REACT_APP_HXROBOT_WS + '/ws/' + channel;
  if (channel === 'dashboard') {
    url += '?token=' + token;
  }
  return url;
}

export async function updateLanguage(auth, language) {
  const { id, token } = auth;
  const postData = JSON.stringify({
    UserID: id,
    Language: language
  });

  await axios.post(`${REACT_APP_LOCALE_URL}/u/lang`, postData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function acceptTos(auth, field, value) {
  const { id, token } = auth;
  const postData = JSON.stringify({
    UserID: id,
    Field: field,
    Value: value,
    Title: field,
    Version: '1'
  });

  await axios.post(`${REACT_APP_LOCALE_URL}/u/tos`, postData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function getTOSState(auth, field) {
  const resp = await axios.get(`${REACT_APP_LOCALE_URL}/u/tos?field=${field}`, {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  });
  return resp?.data;
}
