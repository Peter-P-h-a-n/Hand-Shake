import Button from './Button';
import styled from 'styled-components/macro';

const PrimaryButtonStyled = styled(Button)`
  transform: skewX(30deg);
  padding: 0 10px;
  background-color: #0970b0;

  > p {
    transform: skewX(-30deg);
  }

  :hover {
    background-image: linear-gradient(
      90deg,
      #0970b0 0px,
      rgba(232, 232, 232, 0.3) 40px,
      #0970b0 80px
    );
    background-size: 600px;
    animation: shine-md 1.6s infinite linear;

    @keyframes shine-md {
      0% {
        background-position: 0;
      }

      40%,
      100% {
        background-position: 200px;
      }
    }
  }

  &.lg:hover {
    animation: shine-lg 1.6s infinite linear;

    @keyframes shine-lg {
      0% {
        background-position: 0;
      }

      40%,
      100% {
        background-position: 500px;
      }
    }
  }
`;

const PrimaryButton = ({ children, ...rest }) => {
  return (
    <PrimaryButtonStyled {...rest}>
      <p>{children}</p>
    </PrimaryButtonStyled>
  );
};

export default PrimaryButton;
