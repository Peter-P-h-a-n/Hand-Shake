import { useEffect } from 'react';
import styled from 'styled-components/macro';

import { SubTitle } from 'components/Typography';
import { Loader } from './Loader';

import { useSelect, useDispatch } from 'hooks/useRematch';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 30px;
  right: left;
  transition: 0.3s;
  transform: ${({ $display }) => ($display ? 'translateX(-20px)' : 'translateX(-331px)')};
  z-index: 100;

  > .content {
    width: 200px;
    height: 60px;
    background-color: ${({ $color }) => $color};
    position: relative;
    right: -20px;
    padding-right: 30px;
    padding-right: 10px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const HandShakeLoader = () => {
  const {
    options: { isNotification, text, type, timeout },
  } = useSelect(({ modal }) => ({
    options: modal.selectOptions,
  }));

  const { setNotification } = useDispatch(({ modal: { setNotification } }) => ({
    setNotification,
  }));

  const colors = {
    error: '#c32530',
    loading: '#053c5e',
    success: '#3F6C51',
  };

  useEffect(() => {
    if (timeout) {
      setTimeout(() => {
        setNotification({ isNotification: false, timeout: 0 });
      }, 3000);
    }
  }, [timeout, setNotification]);

  return (
    <Wrapper $display={isNotification} $color={colors[type]}>
      <div className="content">
        <SubTitle className="md">{text || 'Loading ...'}</SubTitle>
      </div>
      <Loader color={colors[type]} />
    </Wrapper>
  );
};

export default HandShakeLoader;
