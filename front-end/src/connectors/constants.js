import IconService, { HttpProvider } from 'icon-sdk-js';

export const TYPES = {
  REQUEST_HAS_ACCOUNT: 'REQUEST_HAS_ACCOUNT',
  RESPONSE_HAS_ACCOUNT: 'RESPONSE_HAS_ACCOUNT',
  REQUEST_ADDRESS: 'REQUEST_ADDRESS',
  RESPONSE_ADDRESS: 'RESPONSE_ADDRESS',
  REQUEST_HAS_ADDRESS: 'REQUEST_HAS_ADDRESS',
  RESPONSE_HAS_ADDRESS: 'RESPONSE_HAS_ADDRESS',
  REQUEST_SIGNING: 'REQUEST_SIGNING',
  RESPONSE_SIGNING: 'RESPONSE_SIGNING',
  CANCEL_SIGNING: 'CANCEL_SIGNING',
};

export const ADDRESS_LOCAL_STORAGE = 'address';

export const signingActions = {
  login: 'signingActions',
  createContract: 'createContract',
  signContract: 'signContract',
  completeContract: 'completeContract',
};

export const CONTRACT_ID = 'CONTRACT_ID';
export const RECRUITMENT_ID = 'RECRUITMENT_ID';
export const CONTRACT_KEY = 'CONTRACT_KEY';
export const SIGNING_ACTION = 'SIGNING_ACTION';

export const httpProvider = new HttpProvider('https://sejong.net.solidwallet.io/api/v3');
export const iconService = new IconService(httpProvider);
