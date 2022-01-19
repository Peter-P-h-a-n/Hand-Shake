import { TYPES } from '../constants';

const createICONexEvent = (type, payload) => {
  const event = new CustomEvent('ICONEX_RELAY_REQUEST', { detail: { type, payload } });
  window.dispatchEvent(event);
};

export const requestHasAccount = () => {
  createICONexEvent(TYPES.REQUEST_HAS_ACCOUNT);
};

export const requestAddress = () => {
  createICONexEvent(TYPES.REQUEST_ADDRESS);
};

export const requestHasAddress = (address) => {
  createICONexEvent(TYPES.REQUEST_HAS_ADDRESS, address);
};

export const requestSigning = (transaction) => {
  createICONexEvent(TYPES.REQUEST_SIGNING, transaction);
};

export const requestSendTransaction = (transaction) => {
  createICONexEvent('REQUEST_JSON-RPC', transaction);
};
