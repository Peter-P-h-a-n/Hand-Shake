import { memo } from 'react';
import styled from 'styled-components/macro';

import handShakeLoader from 'assets/images/hand-shake-loader.gif';

const Wapper = styled.div`
  z-index: 10;
  position: relative;

  > img {
    border-radius: 50%;
    width: ${({ $size }) => $size};
    height: ${({ $size }) => $size};
  }

  > .outline {
    border: 6px solid ${({ $color, lineColor }) => lineColor || $color};
    border-top: 6px solid transparent;

    width: ${({ $size }) => $size};
    height: ${({ $size }) => $size};
    border-radius: 50%;
    animation: spin 2s linear infinite;
    display: inline-block;

    position: absolute;
    right: 0;
    top: 0;
    z-index: 11;

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;

export const Loader = memo(({ color = '#053c5e', size = '80px', lineColor, className }) => {
  return (
    <Wapper $color={color} $size={size} lineColor={lineColor} className={className}>
      <img src={handShakeLoader} alt="loader" />
      <div className="outline"></div>
    </Wapper>
  );
});

Loader.displayName = 'Loader';
