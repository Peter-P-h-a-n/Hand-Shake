import { useState } from 'react';
import styled from 'styled-components';

import { TextInput } from 'components/Input';
import { PrimaryButton } from 'components/Button';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 20px 10px;

  div {
    border-radius: 0;
    padding: 0;

    input {
      padding-left: 10px;
      font-size: 12px;
    }
  }

  > button {
    width: 100px;
    height: 36px;

    transform: skewX(-30deg);
    p {
      transform: skewX(30deg);
    }
  }
`;

const SearchBox = ({ push, openModal }) => {
  const [address, setAddress] = useState('');
  const onSearch = () => {
    if (address) {
      setAddress('');
      push('/user/' + address);
      openModal({ isModal: false });
    }
  };
  return (
    <Wrapper>
      <TextInput
        placeholder="Enter wallet address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        autoFocus
      />
      <PrimaryButton onClick={onSearch}>Go</PrimaryButton>
    </Wrapper>
  );
};

export default SearchBox;
