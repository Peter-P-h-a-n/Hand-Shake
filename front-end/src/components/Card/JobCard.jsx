import styled from 'styled-components/macro';
import { SubTitle, Text } from 'components/Typography';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Stamp from 'components/Stamp';

import { convertToICX } from 'connectors/Hana/utils';

const Wapper = styled.div`
  width: 100%;
  height: 300px;

  position: relative;
  border-radius: 2px;
  z-index: 100;

  ::before,
  ::after {
    content: '';
    position: absolute;
    bottom: 8px;
    width: 40%;
    height: 10px;
    box-shadow: 0 5px 14px rgba(0, 0, 0, 0.7);
    display: inline-block;
    z-index: 0;
    transition: all 0.3s ease-in-out;
  }

  :before {
    left: 15px;
    transform: skew(-5deg) rotate(-5deg);
  }

  :after {
    right: 15px;
    transform: skew(5deg) rotate(5deg);
  }

  :hover::before,
  :hover::after {
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.4);
  }

  :hover::before {
    left: 5px;
  }

  :hover::after {
    right: 5px;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 20px 20px 10px;
  z-index: 10;
  position: relative;
  overflow: hidden;

  .md,
  .sm {
    color: #4c334d;

    &.bold {
      text-transform: uppercase;
    }

    > span {
      background-color: #0970b033;
      padding: 0 5px;
      border-radius: 3px;
      margin-bottom: 5px;
      display: inline-block;
    }
  }

  > .desc {
    margin: 20px 0;
    min-height: 120px;
  }

  > .detail-btn {
    margin-top: 20px;
  }

  > .title {
    display: flex;
    justify-content: space-between;

    > a {
      display: flex;
      align-items: center;

      svg {
        transition: 0.3s;
        margin-left: 5px;
      }

      :hover {
        svg {
          transform: translateX(6px);
        }
      }
    }
  }
`;

const StyledStamp = styled(Stamp)`
  position: absolute;
  bottom: 14px;
  right: -22px;
  transform: rotateZ(-45deg);
  font-size: 1.2rem;
  border-width: 0.2rem;
  padding: 0.5rem 1rem;
`;

const JobCard = ({ title, description = '', salary, deadline, id }) => {
  return (
    <Wapper>
      <Content>
        <div className="title">
          <Link to={'/details/' + id}>
            <SubTitle className="md bold">{title}</SubTitle>
            <FontAwesomeIcon icon={faArrowRight} size="lg" color="#4c334d" />
          </Link>
        </div>

        <SubTitle className="md desc">
          {description.slice(0, 140)}
          {description.length > 140 && '...'}
        </SubTitle>

        <Text className="sm">
          <span>Deadline:</span> {new Date(deadline).toLocaleDateString()}
        </Text>
        <Text className="sm">
          <span>Salary:</span> {convertToICX(salary)} ICX
        </Text>

        <StyledStamp text="HAND SHAKE" />
      </Content>
    </Wapper>
  );
};

export default JobCard;
