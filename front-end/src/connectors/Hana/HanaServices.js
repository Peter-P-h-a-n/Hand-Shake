import { IconUtil, IconConverter, IconBuilder } from 'icon-sdk-js';
const { IcxTransactionBuilder, MessageTransactionBuilder, CallTransactionBuilder } = IconBuilder;

import {
  ADDRESS_LOCAL_STORAGE,
  iconService,
  signingActions,
  SIGNING_ACTION,
  CONTRACT_ID,
  CONTRACT_KEY,
  RECRUITMENT_ID,
} from 'connectors/constants';
import { requestSendTransaction } from './events';
import { convertToICX } from './utils';
import store from 'store';

const { modal } = store.dispatch;
const CONTRACT_ADDRESS = 'cx36daf8eb7828f399876c44e1d61e039af408996b';

export const getBalance = (address) => {
  // https://github.com/icon-project/icon-sdk-js/issues/26#issuecomment-843988076
  return iconService
    .getBalance(address)
    .execute()
    .then((balance) => {
      return convertToICX(balance);
    });
};

export const getTxResult = (txHash) => {
  try {
    return iconService
      .getTransactionResult(txHash)
      .execute()
      .then((rs) => {
        return rs;
      });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const signTx = (transaction = {}, options = {}) => {
  const { from = localStorage.getItem(ADDRESS_LOCAL_STORAGE), to, value } = transaction;
  const { method, params, builder, data } = options;

  modal.setNotification({
    type: 'loading',
    text: 'Requesting signing',
  });

  const txBuilder = builder || new IcxTransactionBuilder();

  let tx = txBuilder
    .from(from)
    .to(to || CONTRACT_ADDRESS)
    .stepLimit(IconConverter.toBigNumber(1000000000))
    .nid(IconConverter.toBigNumber('0x53'))
    .nonce(IconConverter.toBigNumber(1))
    .version(IconConverter.toBigNumber(3))
    .timestamp(new Date().getTime() * 1000);

  if (value) {
    tx = tx.value(value);
  }

  if (method) {
    tx = tx.method(method).params(params);
  }

  if (data) {
    tx = tx.data(data);
  }

  tx = tx.build();

  requestSendTransaction({
    jsonrpc: '2.0',
    method: 'icx_sendTransaction',
    params: IconConverter.toRawTransaction(tx),
    id: IconUtil.getCurrentTime(),
  });
};

export const sendMessage = (sessionID) => {
  const transaction = {
    to: CONTRACT_ADDRESS,
  };

  const options = {
    builder: new MessageTransactionBuilder(),
    data: IconConverter.fromUtf8(sessionID),
  };

  window[SIGNING_ACTION] = signingActions.login;
  signTx(transaction, options);
};

export const createContract = (id, value) => {
  const options = {
    builder: new CallTransactionBuilder(),
    method: 'createContract',
    params: {
      _contractId: id,
    },
  };

  window[SIGNING_ACTION] = signingActions.createContract;
  window[CONTRACT_ID] = id;
  signTx({ value }, options);
};

export const signContract = (contractId, contractKey, recruitmentId, value) => {
  const options = {
    builder: new CallTransactionBuilder(),
    method: 'signContract',
    params: {
      _id: contractId + '',
    },
  };

  window[SIGNING_ACTION] = signingActions.signContract;
  window[CONTRACT_ID] = contractId;
  window[CONTRACT_KEY] = contractKey;
  window[RECRUITMENT_ID] = recruitmentId;
  signTx({ value }, options);
};

export const completeContract = (recruitmentId, contractId) => {
  const options = {
    builder: new CallTransactionBuilder(),
    method: 'completeContract',
    params: {
      _id: contractId + '',
    },
  };

  window[SIGNING_ACTION] = signingActions.completeContract;
  window[CONTRACT_ID] = recruitmentId;
  signTx({}, options);
};
