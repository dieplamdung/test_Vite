import axios from 'axios';
import request from './request';

let cancelToken = undefined;

export const getMarKet = () => {
  if (typeof cancelToken !== typeof undefined) {
    cancelToken.cancel('cancelToken');
  }
  cancelToken = axios.CancelToken.source();
  return request({
    method: 'GET',
    url: 'https://dexterity.hxro.com/fills?product=BTCUSD-PERP',
    cancelToken: cancelToken.token
  });
};
