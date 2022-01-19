import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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
      pointer-events: none;
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

const InvitationLinkBox = ({ invitationLink }) => {
  return (
    <Wrapper>
      <TextInput defaultValue={invitationLink} />
      <CopyToClipboard text={invitationLink}>
        <PrimaryButton>Copy</PrimaryButton>
      </CopyToClipboard>
    </Wrapper>
  );
};

export default InvitationLinkBox;
