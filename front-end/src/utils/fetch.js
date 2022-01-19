import { PIECE_OF_CAKE } from './constants';
import store from 'store';
import { push } from 'connected-react-router';

const { modal, account } = store.dispatch;

const endpoint = 'https://be.handshake-contract.live';

export const fetchAPI = (uri, config = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem(PIECE_OF_CAKE);
  if (token) headers.Authorization = 'Bearer ' + token;

  return fetch(`${endpoint}/${uri}`, {
    ...config,
    credentials: 'omit',
    headers,
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          modal.openModal({ title: 'Session Ends', desc: 'Please sign-in again!' });
          account.resetAccountInfo();
          store.dispatch(push('/recruitment'));
        } else {
          modal.setNotification({ type: 'error', text: res.statusText, timeout: true });
        }
        return {};
      }
      return res.json();
    })
    .catch((error) => {
      throw error;
    });
};
