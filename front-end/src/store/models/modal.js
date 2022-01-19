const modal = {
  name: 'modal',
  state: {
    isNotification: false,
    isModal: false,
  },
  reducers: {
    setDisplay(state, display) {
      return {
        ...state,
        isModal: display,
      };
    },
    openModal(state, payload = {}) {
      return {
        ...state,
        isModal: true,
        children: null,
        buttons: null,
        desc: null,
        ...payload,
      };
    },
    setNotification(state, payload = {}) {
      return {
        ...state,
        isNotification: true,
        ...payload,
      };
    },
  },
  effects: () => ({
    handleError(error) {
      console.log('error', error);
      this.openModal({
        title: 'Opps!',
        desc: (error && error.message) || error || 'Something went wrong.',
      });
    },
  }),

  selectors: (slice) => ({
    selectOptions() {
      return slice((state) => state);
    },
  }),
};

export default modal;
