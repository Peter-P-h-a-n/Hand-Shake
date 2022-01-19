import { getBalance } from './HanaServices';
import { requestHasAddress } from './events';

import store from 'store';
import {
  TYPES,
  ADDRESS_LOCAL_STORAGE,
  signingActions,
  SIGNING_ACTION,
  CONTRACT_ID,
  CONTRACT_KEY,
  RECRUITMENT_ID,
} from 'connectors/constants';
import { PIECE_OF_CAKE } from 'utils/constants';
import {
  getAuth,
  createContract,
  signContract,
  getContractPrivateKey,
  completeContract,
} from 'services';

import { push } from 'connected-react-router';

import InvitationLinkBox from 'components/NotificationModal/InvitationLinkBox';

const { modal, account } = store.dispatch;

const eventHandler = async (event) => {
  const { type, payload = {} } = event.detail;
  const address = localStorage.getItem(ADDRESS_LOCAL_STORAGE);

  console.info('%cHana event', 'color: green;', event.detail);

  switch (type) {
    // request for wallet address confirm
    case TYPES.RESPONSE_ADDRESS:
      getAccountInfo(payload);
      window.hasIONAddress = true;

      localStorage.setItem(ADDRESS_LOCAL_STORAGE, payload);
      modal.setNotification({ isNotification: false });
      modal.setDisplay(false);
      break;

    // check if the wallet includes the current address
    case TYPES.RESPONSE_HAS_ADDRESS:
      if (payload.hasAddress) {
        getAccountInfo(address);
        window.hasIONAddress = true;
      }
      break;

    case 'RESPONSE_JSON-RPC':
      try {
        const { result } = payload;

        switch (window[SIGNING_ACTION]) {
          case signingActions.login:
            const { jwt } = await getAuth({ address, trxId: result });
            localStorage.setItem(PIECE_OF_CAKE, jwt);
            account.setIsAuthenticated(true);
            modal.setNotification({ isNotification: false });
            break;

          case signingActions.createContract:
            modal.setNotification({ type: 'loading', text: 'Waiting transaction' });
            setTimeout(() => {
              return createContract(window[CONTRACT_ID], result).then(() => {
                modal.setNotification({ type: 'success', text: 'Success!', timeout: true });
                account.setAccountInfo({ isContractUpdated: true });

                getContractPrivateKey(window[CONTRACT_ID]).then(({ slug }) => {
                  modal.openModal({
                    title: 'Invitation',
                    desc: 'Please send the link below to your freelancer',
                    children: (
                      <InvitationLinkBox invitationLink={location.origin + '/invite/' + slug} />
                    ),
                  });
                });
              });
            }, 5000);
            break;

          case signingActions.signContract:
            modal.setNotification({ type: 'loading', text: 'Waiting transaction' });
            setTimeout(() => {
              return signContract(window[CONTRACT_KEY], result).then(() => {
                modal.setNotification({ type: 'success', text: 'Success!', timeout: true });
                store.dispatch(push('/details/' + window[RECRUITMENT_ID], { changed: true }));
              });
            }, 5000);

            break;

          case signingActions.completeContract:
            modal.setNotification({ type: 'loading', text: 'Waiting transaction' });
            setTimeout(() => {
              return completeContract(window[CONTRACT_ID], result).then(() => {
                account.setAccountInfo({ isContractUpdated: true });
                modal.setNotification({ type: 'success', text: 'Success!', timeout: true });
              });
            }, 5000);

            break;

          default:
            console.log('Does not match any signing actions');
            break;
        }
      } catch (err) {
        modal.setNotification({ type: 'error', text: 'Failed!', timeout: true });
      }

      break;

    case 'CANCEL_JSON-RPC':
    case TYPES.CANCEL_SIGNING:
      modal.setNotification({
        type: 'error',
        text: 'Rejected',
        timeout: true,
      });
      break;

    default:
      break;
  }
};

const getAccountInfo = async (address) => {
  try {
    const balance = +(await getBalance(address));
    await account.setAccountInfo({
      address,
      balance,
      wallet: 'Hana',
      unit: 'ICX',
      currentNetwork: 'ICON',
    });
  } catch (err) {
    console.log('Err: ', err);
    account.resetAccountInfo();
  }
};

export const addHanaListener = () => {
  window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler);

  const address = localStorage.getItem(ADDRESS_LOCAL_STORAGE);
  if (address) {
    setTimeout(() => {
      requestHasAddress(address);
    }, 2000);

    // Hana wallet is locked
    setTimeout(() => {
      if (!window.hasIONAddress) {
        account.resetAccountInfo();
      }
    }, 2100);
  }
};
