import { IconAmount, IconUtil } from 'icon-sdk-js';
import { httpProvider } from 'connectors/constants';

export default class Request {
  constructor(id, method, params) {
    this.jsonrpc = '2.0';
    this.id = id;
    this.method = method;
    this.params = params;
  }
}

export const convertToICX = (balance) => {
  return IconAmount.of(balance, IconAmount.Unit.LOOP).convertUnit(IconAmount.Unit.ICX).toString();
};

export const formatICXAmount = (amount) => {
  return IconAmount.of(amount, IconAmount.Unit.ICX).toLoop();
};

export const makeICXCall = async (payload) => {
  try {
    const requestId = IconUtil.getCurrentTime();
    const request = new Request(requestId, 'icx_call', payload);

    const result = await httpProvider.request(request).execute();
    return result;
  } catch (err) {
    console.log('err', err);
    return 0;
  }
};
