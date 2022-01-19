import styled from 'styled-components/macro';

import { SubTitleMixin } from 'components/Typography/SubTitle';
import { colors } from 'components/Styles/Colors';

const ButtonStyle = styled.button`
  ${SubTitleMixin.mdBold};
  color: ${(props) => props.$textColor};
  width: ${(props) => props.$width || ''};
  height: ${(props) => props.$height || ''};
  background-color: transparent;

  &:disabled {
    opacity: 0.5;
    text-decoration: none !important;
    pointer-events: none;
  }
`;
const Button = ({ height, width, textColor, children, className, ...rest }) => {
  return (
    <ButtonStyle
      $height={`${height}px`}
      $width={`${width}px`}
      $textColor={textColor}
      className={className}
      {...rest}
    >
      {children}
    </ButtonStyle>
  );
};

Button.defaultProps = {
  textColor: colors.primaryBrandBG,
  borderRadius: 4,
};

export default Button;
