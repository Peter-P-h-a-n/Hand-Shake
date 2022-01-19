import styled from 'styled-components/macro';
import { Helmet } from 'components/Helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGhost } from '@fortawesome/free-solid-svg-icons';

import { SubTitle, Text } from 'components/Typography';

const NotFoundPageWrapper = styled.div`
  text-align: center;
  padding: 80px;

  > h1 {
    color: white;
    font-size: 12.5rem;
    letter-spacing: 0.1em;
    margin: 0.025em 0;
    text-shadow: 0.05em 0.05em 0 rgba(0, 0, 0, 0.25);
    white-space: nowrap;

    @media (max-width: 30rem) {
      font-size: 8.5rem;
    }

    & > span {
      animation: spooky 2s alternate infinite linear;
      color: #528cce;
      display: inline-block;
      margin-right: 8px;
      margin-left: 6px;
    }
  }

  > .subtitle-text,
  .plain-text {
    color: #4c334d;
    margin-bottom: 0.4em;
  }

  @keyframes spooky {
    from {
      transform: translatey(0.15em) scaley(0.95);
    }

    to {
      transform: translatey(-0.15em);
    }
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundPageWrapper>
      <Helmet title="Not Found" />

      <h1>
        4
        <span>
          <FontAwesomeIcon icon={faGhost} />
        </span>
        4
      </h1>
      <SubTitle className="md bold">Error: 404 page not found</SubTitle>
      <Text className="md">Sorry, the page you are looking for cannot be accessed</Text>
    </NotFoundPageWrapper>
  );
};

export default NotFoundPage;
