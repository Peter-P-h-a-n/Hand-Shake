import styled from 'styled-components/macro';
import { NavLink } from 'react-router-dom';
import { SubTitleMixin } from 'components/Typography/SubTitle';
import { PrimaryButton } from 'components/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import SearchBox from 'components/NotificationModal/SearchBox';

const NavStyled = styled.ul`
  display: flex;
  flex-flow: nowrap;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto 0 0;

  > li {
    position: relative;

    :after {
      content: '';
      position: absolute;
      transform: skewX(30deg);
      top: -4px;
      right: 0;
      height: 44px;
      border: 2px solid #053c5e;
    }

    a[disabled] {
      pointer-events: none;
    }

    a.active {
      .nav-link:before {
        width: 100%;
      }
    }

    .nav-link {
      ${SubTitleMixin.smBold};
      color: ${colors.brandSecondaryBG};
      transform: skewX(30deg);

      padding: 8px 35px;
      position: relative;
      height: 44px;

      :before {
        transition: 300ms;
        height: 5px;
        content: '';
        position: absolute;
        background-color: #c32530;
        width: 0%;
        bottom: 0;
        left: 0;
      }

      :focus,
      :hover {
        :before {
          width: 100%;
        }
      }
    }

    :last-child:after {
      display: none;
    }
  }

  ${media.minWidthHeader`
    flex-direction: column;
    margin: auto;

    li {
      margin-bottom: 10px;

      :after {
        display: none;
      }
    }
  `}
`;

const Button = ({ text, pathname, disabled, ...ots }) => {
  return (
    <li>
      <NavLink to={`/${pathname}`} disabled={disabled}>
        <PrimaryButton className="nav-link" disabled={disabled} {...ots}>
          {text}
        </PrimaryButton>
      </NavLink>
    </li>
  );
};

const SearchButton = styled.button`
  background-color: transparent;
  margin-left: 15px;
`;

const Nav = ({ setShowMenu, isAuthenticated, openModal, push }) => {
  const buttonContents = [
    { text: 'Recruitment', pathname: 'recruitment', disabled: false },
    { text: 'My Contract', pathname: 'my-contract', disabled: !isAuthenticated },
  ];

  const onSearch = () => {
    openModal({
      title: 'Search',
      desc: '',
      children: <SearchBox push={push} openModal={openModal} />,
    });
  };

  return (
    <NavStyled>
      {buttonContents.map(({ text, pathname, disabled }) => (
        <Button
          key={text}
          text={text}
          pathname={pathname}
          disabled={disabled}
          onClick={() => {
            setShowMenu(false);
          }}
        />
      ))}
      <SearchButton onClick={onSearch}>
        <FontAwesomeIcon icon={faSearch} color="white" size="lg" />
      </SearchButton>
    </NavStyled>
  );
};

export default Nav;
