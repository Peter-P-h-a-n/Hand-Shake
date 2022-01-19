import styled from 'styled-components';
import { Text } from 'components/Typography';

const Wrapper = styled.div`
  text-align: left;
  padding: 0 10px;

  > ul {
    list-style: initial;
  }

  .plain-text {
    color: #4c334d;

    &.bold {
      margin-bottom: 20px;
      text-align: center;
    }

    > a {
      font-weight: bold;
      color: inherit;
      text-decoration: underline;
    }
  }
`;

const WalletInstruction = () => {
  return (
    <Wrapper>
      <Text className="md bold">
        Please select your account, and then click &apos;Authorize&apos; to connect your Hana wallet
        to Hand Shake.
      </Text>
      <ul>
        <li>
          <Text className="md">If your wallet is locked, please unlock it first</Text>
        </li>
        <li>
          <Text className="md">
            If you don&apos;t have Hana, install{' '}
            <a
              href="https://chrome.google.com/webstore/detail/hana/jfdlamikmbghhapbgfoogdffldioobgl"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </Text>
        </li>
      </ul>
    </Wrapper>
  );
};

export default WalletInstruction;
