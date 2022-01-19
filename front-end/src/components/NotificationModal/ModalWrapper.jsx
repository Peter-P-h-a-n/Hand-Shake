import { useCallback } from 'react';
import { Modal } from './Modal';
import { useSelect, useDispatch } from 'hooks/useRematch';

export const ModalWrapper = () => {
  const { options } = useSelect(({ modal }) => ({
    options: modal.selectOptions,
  }));

  const { setDisplay } = useDispatch(({ modal: { setDisplay } }) => ({
    setDisplay,
  }));

  const memoizedSetDisplay = useCallback((param) => setDisplay(param), [setDisplay]);
  const { children, ...others } = options;

  return (
    <Modal {...others} display={options.isModal} setDisplay={memoizedSetDisplay}>
      {children || ''}
    </Modal>
  );
};
