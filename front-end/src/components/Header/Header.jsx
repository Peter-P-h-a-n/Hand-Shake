import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCopy } from '@fortawesome/free-solid-svg-icons';

import Nav from './Nav';
import { PrimaryButton, HamburgerButton, Button } from 'components/Button';
import { Avatar } from 'components/Avatar';
import WalletInstruction from 'components/NotificationModal/WalletInstruction';
import { Loader } from 'components/Loader';

import { useDispatch, useSelect } from 'hooks/useRematch';
import { requestAddress } from 'connectors/Hana/events';
import { hashShortener } from 'utils/app';

import { SubTitle, Text, Header as Heading } from 'components/Typography';
import { SubTitleMixin } from 'components/Typography/SubTitle';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import { ADDRESS_LOCAL_STORAGE } from 'connectors/constants';
import { PIECE_OF_CAKE } from 'utils/constants';

import { sendMessage } from 'connectors/Hana/HanaServices';
import { getSession } from 'services';
import { Link, useHistory } from 'react-router-dom';

const StyledHeader = styled.header`
  height: 80px;
  width: 100%;
  padding: 40px;
  color: ${colors.opal};
  background-color: #053c5e;

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .right-side {
    ${SubTitleMixin.smBold};

    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    min-width: 305px;

    > .main-title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .user-avatar {
      margin: 0 10px;
    }

    .account-info {
      display: flex;
      align-items: center;

      .wallet-info {
        text-align: right;

        .address {
          margin-bottom: 4px;
          cursor: pointer;

          > a {
            color: inherit;

            :hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }

  .connect-to-wallet-btn {
    ${SubTitleMixin.smBold};
    height: 44px;
    min-width: 170px;
    text-align: center;

    svg {
      transition: 0.3s;
    }

    :hover {
      svg {
        transform: translateX(6px);
      }
    }
  }

  .menu-icon {
    display: none;
  }

  ${media.minWidthHeader`
    padding: 0 20px;
    position: relative;

    .menu-icon {
      display: block;
    }

    .right-side {
      display: ${({ $showMenu }) => ($showMenu ? 'flex' : 'none')};
      position: absolute;
      top: 80px;
      left: 0;
      z-index: 101;
      padding: 0 20px;


      min-height: calc(100vh - 80px);
      width: 100%;
      background-color: ${colors.quickSilver};
      flex-direction: column-reverse;
      justify-content: flex-end;

      .connect-to-wallet-btn {
        margin-top: 100px;
      }

      .account-info {
        flex-direction: column;
        align-items: center;
        margin-top: 50px;

        .user-avatar, .wallet-info {
          margin: 5px 0;
          text-align: center;
        }
      }
    }
  `}
`;

const SignInOutButton = styled(Button)`
  text-decoration: underline;
  background-color: transparent;
  ${SubTitleMixin.sm};
`;

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { push } = useHistory();

  const {
    accountInfo: { address, balance, unit, isAuthenticated },
  } = useSelect(({ account }) => ({
    accountInfo: account.selectAccountInfo,
  }));

  const { resetAccountInfo, setIsAuthenticated, setNotification, openModal } = useDispatch(
    ({
      account: { resetAccountInfo, setIsAuthenticated },
      modal: { setNotification, openModal },
    }) => ({
      resetAccountInfo,
      setIsAuthenticated,
      setNotification,
      openModal,
    }),
  );

  const shortedAddress = hashShortener(address);
  const localAddress = localStorage.getItem(ADDRESS_LOCAL_STORAGE);
  const jwtToken = localStorage.getItem(PIECE_OF_CAKE);

  useEffect(() => {
    if (jwtToken) {
      setIsAuthenticated(true);
    }
  }, [jwtToken, setIsAuthenticated]);

  const handleConnect = async (e) => {
    e.preventDefault();
    resetAccountInfo();

    setNotification({ text: 'Connecting ...', type: 'loading' });

    requestAddress();
    setTimeout(() => {
      if (!window.hasIONAddress)
        openModal({
          title: 'Instruction',
          children: <WalletInstruction />,
          onClose: () => {
            setNotification({ isNotification: false });
          },
        });
    }, 1000);
  };

  const handleSignInOut = async () => {
    if (address && isAuthenticated) {
      resetAccountInfo();
      push('/recruitment');
    } else {
      const { loginSession } = await getSession(address);
      sendMessage(loginSession);
    }
  };

  return (
    <StyledHeader $showMenu={showMenu}>
      <HamburgerButton
        className={`menu-icon ${showMenu && 'active'}`}
        onClick={() => setShowMenu(!showMenu)}
      />

      <div className="right-side">
        <Nav
          setShowMenu={setShowMenu}
          isAuthenticated={isAuthenticated}
          openModal={openModal}
          push={push}
        />
        <Heading className="sm bold main-title">HAND SHAKE</Heading>

        {address ? (
          <div className="account-info">
            <span className="wallet-info">
              <Text className="xs address" title={address}>
                <CopyToClipboard text={address}>
                  <FontAwesomeIcon icon={faCopy} />
                </CopyToClipboard>{' '}
                <a
                  href={'https://sejong.tracker.solidwallet.io/address/' + address}
                  target="_bLank"
                  rel="noreferrer"
                >
                  {shortedAddress} (Sejong)
                </a>
              </Text>
              <SubTitle className="md bold">
                {balance} {unit}
              </SubTitle>
            </span>
            <Link to={'/user/' + address}>
              <Avatar className="user-avatar" size={48} />
            </Link>
            <SignInOutButton onClick={handleSignInOut}>
              {isAuthenticated ? 'Sign out' : 'Sign in'}
            </SignInOutButton>
          </div>
        ) : (
          <>
            {localAddress ? (
              <Loader size="50px" lineColor="#F58F29" />
            ) : (
              <PrimaryButton className="connect-to-wallet-btn" onClick={handleConnect}>
                Connect Wallet <FontAwesomeIcon icon={faArrowRight} />
              </PrimaryButton>
            )}
          </>
        )}
      </div>
    </StyledHeader>
  );
};

export default Header;
