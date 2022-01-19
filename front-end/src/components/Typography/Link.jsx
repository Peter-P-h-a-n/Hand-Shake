import styled from 'styled-components/macro';
import { Link as RouterLink } from 'react-router-dom';
import { SubTitleMixin } from 'components/Typography/SubTitle';
import { TextMixin } from 'components/Typography/Text';

const Wrapper = styled.p`
  border: 1px solid #0970b0;
  display: inline-block;
  padding: 10px 15px;
  position: relative;
  font-weight: 300;

  &:hover {
    border-color: transparent;

    .line-1 {
      animation: move1 1500ms infinite ease;
    }

    .line-2 {
      animation: move2 1500ms infinite ease;
    }

    .line-3 {
      animation: move3 1500ms infinite ease;
    }

    .line-4 {
      animation: move4 1500ms infinite ease;
    }
  }

  .line-1 {
    content: '';
    display: block;
    position: absolute;
    width: 1px;
    background-color: #0970b0;
    left: 0;
    bottom: 0;
  }

  .line-2 {
    content: '';
    display: block;
    position: absolute;
    height: 1px;
    background-color: #0970b0;
    left: 0;
    top: 0;
  }

  .line-3 {
    content: '';
    display: block;
    position: absolute;
    width: 1px;
    background-color: #0970b0;
    right: 0;
    top: 0;
  }

  .line-4 {
    content: '';
    display: block;
    position: absolute;
    height: 1px;
    background-color: #0970b0;
    right: 0;
    bottom: 0;
  }

  @keyframes move1 {
    0% {
      height: 100%;
      bottom: 0;
    }
    54% {
      height: 0;
      bottom: 100%;
    }
    55% {
      height: 0;
      bottom: 0;
    }
    100% {
      height: 100%;
      bottom: 0;
    }
  }

  @keyframes move2 {
    0% {
      width: 0;
      left: 0;
    }
    50% {
      width: 100%;
      left: 0;
    }
    100% {
      width: 0;
      left: 100%;
    }
  }

  @keyframes move3 {
    0% {
      height: 100%;
      top: 0;
    }
    54% {
      height: 0;
      top: 100%;
    }
    55% {
      height: 0;
      top: 0;
    }
    100% {
      height: 100%;
      top: 0;
    }
  }

  @keyframes move4 {
    0% {
      width: 0;
      right: 0;
    }
    55% {
      width: 100%;
      right: 0;
    }
    100% {
      width: 0;
      right: 100%;
    }
  }
  > a {
    color: #0970b0;
    display: inline-block;
  }

  &.md {
    ${SubTitleMixin.md};
  }

  &.xs {
    ${TextMixin.xsBold};
  }

  &.sm {
    font-size: 14px;
    line-height: 20px;
  }

  &.bold {
    ${TextMixin.bold};
  }
`;

export const Link = ({ children, to, className, disabled, ...props }) => {
  return (
    <Wrapper className={className} disabled={disabled}>
      <RouterLink to={to} {...props}>
        {children}
      </RouterLink>
      <span className="line-1"></span>
      <span className="line-2"></span>
      <span className="line-3"></span>
      <span className="line-4"></span>
    </Wrapper>
  );
};
