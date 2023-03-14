const subscribers = {};

export default {
  subscribe: (name, subscriberId, listener) => {
    const [coin] = name.split('/');
    subscribers[coin] = subscribers[coin] || {};
    subscribers[coin][subscriberId] = listener;
  },

  unsubscribe: (name, subscriberId) => {
    const [coin] = name.split('/');
    delete subscribers[coin][subscriberId];
  },

  updatePrice: (name, data) => {
    const listeners = Object.values(subscribers[name] || {});
    if (!listeners.length) {
      return;
    }

    const ticker = {
      ts: data.ts,
      symbol: ` ${data.from_sym}/${data.to_sym}`,
      price: data.price,
      volume: data.volume,
    };
    listeners.forEach((listener) => listener(ticker));
  }
};
