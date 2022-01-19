import styled from 'styled-components/macro';
import defaultAvatar from 'assets/images/hs-bear-avatar.png';

const Wapper = styled.img`
  border-radius: 50%;

  ${({ size }) => `
    width: ${size}px;
    height: ${size}px;
    `}
`;

export const Avatar = ({ src = defaultAvatar, size = 20, ...props }) => {
  return <Wapper src={src} size={size} alt="avatar" {...props} />;
};
