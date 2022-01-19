import { memo } from 'react';
import styled from 'styled-components/macro';

import { TextMixin } from 'components/Typography/Text';
import { HeaderMixin } from 'components/Typography/Header';
import { media } from 'components/Styles/Media';
import ConfirmationButtons from 'components/Button/ConfirmationButtons';

import closeIcon from 'assets/images/close-icon.svg';

const Wapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: ${({ isShowed }) => (isShowed ? 'grid' : 'none')};
  place-items: center;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 105;

  background-color: rgba(10, 9, 11, 0.5);
`;

const Content = styled.div`
  width: ${({ width }) => width};
  padding: 23px 32px 32px;
  word-break: break-word;

  display: flex;
  flex-direction: column;

  border-radius: 4px;

  img {
    width: 100%;
  }

  .heading {
    display: flex;
    position: relative;
    padding: 5px 10px;
    background-color: #0970b0;

    h3.title {
      flex: 1;
      margin-bottom: 0;

      text-align: center;
      ${HeaderMixin.smBold};
    }

    .close-btn {
      background: url('${closeIcon}');
      width: 18px;
      height: 18px;

      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      border: none;
    }
  }

  .content {
    flex: 1;
    text-align: center;
    background-color: white;
    padding: 20px;

    img.icon {
      width: 91.67px;
      height: 91.67px;
    }

    p.desc {
      max-width: 392px;
      text-align: center;
      ${TextMixin.md};
      color: #4c334d;
    }
  }

  ${media.md`
    width: 100%;
    overflow: auto;
  `}
`;

export const Modal = memo(
  ({
    title,
    desc,
    buttons,
    width = '500px',
    children,
    display,
    marginTop = '0px',
    setDisplay = () => {},
    hasClosedBtn = true,
    hasHeading = true,
    onClose,
  }) => {
    return (
      <Wapper isShowed={display}>
        <Content width={width} marginTop={marginTop}>
          {hasHeading && (
            <div className="heading">
              {title && <h3 className="title">{title}</h3>}
              {hasClosedBtn && (
                <button
                  className="close-btn"
                  onClick={() => {
                    if (onClose) onClose();
                    setDisplay(false);
                  }}
                ></button>
              )}
            </div>
          )}
          <div className="content">
            {desc && <p className="desc">{desc}</p>}
            {children}
            {buttons && <ConfirmationButtons {...buttons} setDisplay={setDisplay} />}
          </div>
        </Content>
      </Wapper>
    );
  },
);

Modal.displayName = 'Modal';
