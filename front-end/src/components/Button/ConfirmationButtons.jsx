import styled from 'styled-components/macro';
import { PrimaryButton } from 'components/Button';

const Wrapper = styled.div`
  margin-top: 40px;

  > button {
    padding: 5px 50px;
    border: 1px solid #0970b0;

    &.no-btn {
      background-color: transparent;
      background-image: none;
      color: #0970b0;
    }
  }
`;

const ConfirmationButtons = ({ onYes, onNo, setDisplay }) => {
  const handleCancel = onNo || (() => setDisplay(false));
  const handleYes = () => {
    onYes();
    setDisplay(false);
  };

  return (
    <Wrapper>
      <PrimaryButton onClick={handleYes}>Yes</PrimaryButton>
      <PrimaryButton className="no-btn" onClick={handleCancel}>
        No
      </PrimaryButton>
    </Wrapper>
  );
};

export default ConfirmationButtons;
