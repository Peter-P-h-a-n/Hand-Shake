import styled from 'styled-components';
import { SubTitle } from 'components/Typography';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  padding: 10px;
  position: relative;
  width: 120px;
  height: 150px;
  cursor: pointer;
  display: inline-block;

  > .content {
    z-index: 10;
    position: relative;
    height: 100%;
    display: grid;
    place-items: center;

    > .subtitle-text {
      color: #4c334d;
      text-align: center;
      text-transform: uppercase;
      word-break: break-all;
    }
  }

  :hover {
    :before {
      transform: rotate(-5.5deg);
    }

    :after {
      transform: rotate(4.4deg);
    }
  }

  :before,
  :after {
    content: '';
    height: 98%;
    position: absolute;
    width: 100%;
    transition: 0.5s;
  }

  :before {
    background: #fafafa;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    left: -5px;
    top: 4px;
    transform: rotate(-2.5deg);
  }

  :after {
    background: #f6f6f6;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    right: -3px;
    top: 1px;
    transform: rotate(1.4deg);
  }
`;

const ContractCard = ({ color, title, id }) => {
  return (
    <Link to={'/details/' + id}>
      <Wrapper title={title}>
        <div className="content">
          <SubTitle className="md bold">
            {title.slice(0, 16)}
            {title.length > 16 && '...'}
          </SubTitle>
          <FontAwesomeIcon icon={faCircle} color={color} size="lg" />
        </div>
      </Wrapper>
    </Link>
  );
};

export default ContractCard;
