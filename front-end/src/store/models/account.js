import { ADDRESS_LOCAL_STORAGE } from 'connectors/constants';
import { PIECE_OF_CAKE } from 'utils/constants';
import { roundNumber } from 'utils/app';

const initState = {
  unit: '',
  wallet: '',
  address: '',
  balance: 0,
  isContractUpdated: false,
  currentNetwork: '',
  isAuthenticated: false,
};

const account = {
  name: 'account',
  state: {
    ...initState,
  },
  reducers: {
    setAccountInfo(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
    setIsAuthenticated(state, payload) {
      return {
        ...state,
        isAuthenticated: payload,
      };
    },
    resetAccountInfo() {
      localStorage.removeItem(ADDRESS_LOCAL_STORAGE);
      localStorage.removeItem(PIECE_OF_CAKE);

      window.hasIONAddress = false;
      return initState;
    },
  },
  effects: () => ({}),
  selectors: (slice) => ({
    selectAccountInfo() {
      return slice((state) => ({
        ...state,
        balance: roundNumber(state.balance, 4),
      }));
    },
    selectIsConnected() {
      return slice((state) => !!state.address);
    },
  }),
};

export default account;
