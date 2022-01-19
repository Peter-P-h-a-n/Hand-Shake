import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { SubTitle } from 'components/Typography';

const StyledBackButton = styled.button`
  background-color: transparent;
  display: flex;
  align-items: center;
  margin-top: 10px;

  > .subtitle-text {
    color: #0970b0;
    margin-left: 10px;
  }

  svg {
    transition: 0.3s;
  }

  :hover {
    svg {
      transform: translateX(-6px);
    }
  }
`;

export const BackButton = ({ children, onClick, url }) => {
  const { goBack, push } = useHistory();

  const onBack = url
    ? () => {
        push(url);
      }
    : goBack;

  return (
    <StyledBackButton type="button" onClick={onClick || onBack}>
      <FontAwesomeIcon icon={faArrowLeft} color="#0970b0" size="1x" />
      <SubTitle className="lg bold">{children}</SubTitle>
    </StyledBackButton>
  );
};

BackButton.propTypes = {
  /** Handle when click */
  onClick: PropTypes.func,
  /** If defined, push to this URL. Otherwise, redirect back */
  url: PropTypes.string,
};
