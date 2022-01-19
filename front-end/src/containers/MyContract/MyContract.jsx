import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'components/Helmet';

import ContractCard from 'components/Card/ContractCard';
import { Text } from 'components/Typography';
import { BackButton } from 'components/Button';
import Stamp from 'components/Stamp';

import { getMyContract } from 'services';
import { CONTRACT_STATUS } from 'utils/constants';

const Wrapper = styled.div`
  padding: 30px 50px;
  min-height: 100vh;

  > button {
    margin-bottom: 20px;
  }

  > section {
    display: flex;

    > .tags {
      display: flex;
      flex-direction: column;
      position: relative;
      top: 10px;

      .plain-text {
        transform: skewY(30deg);
        color: white;
      }
    }

    > .content {
      position: relative;
      min-height: 85vh;
      background-color: ${({ bgColor }) => bgColor};

      border-radius: 5px;
      padding: 50px;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
      flex: 1;

      > a {
        margin-right: 10px;
        margin-bottom: 40px;
        display: inline-block;

        :last-child {
          margin-right: 0;
        }
      }
    }
  }
`;

const Tag = styled.li`
  border: 0.1px solid rgba(255, 255, 255, 0.5);
  border-left: none;
  padding: 15px 2px;
  transform: skewY(-30deg);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  background-color: ${({ $color }) => $color};
  cursor: pointer;
  transition: 0.3s;

  &.active {
    transform: scale(1.2) skewY(-30deg);
    z-index: 5;

    .plain-text {
      font-weight: bold;
    }
  }
`;

const tags = [
  { label: 'All', bgColor: 'rgba(5, 60, 94, 0.5)', color: '#053c5e', code: '' },
  {
    label: 'New',
    bgColor: 'rgba(175, 191, 192, 0.5)',
    color: '#AFBFC0',
    code: CONTRACT_STATUS.NEW,
  },
  {
    label: 'Doing',
    bgColor: 'rgba(9, 112, 176, 0.5)',
    color: '#0970b0',
    code: CONTRACT_STATUS.ON_PROCESS,
    code1: CONTRACT_STATUS.SUBMITTED,
  },
  {
    label: 'Done',
    bgColor: 'rgba(37, 89, 87, 0.5)',
    color: '#255957',
    code: CONTRACT_STATUS.DONE,
  },
  {
    label: 'Uncomplete',
    bgColor: 'rgba(125, 70, 0, 0.5)',
    color: '#7D4600',
    code: CONTRACT_STATUS.UN_COMPLETE,
  },
  {
    label: 'Reported',
    bgColor: 'rgba(245, 143, 41, 0.5)',
    color: '#F58F29',
    code: CONTRACT_STATUS.REPORT,
  },
];

const StyledStamp = styled(Stamp)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateZ(-30deg);
`;

const MyContract = () => {
  const [currentTag, setCurrentTag] = useState('');
  const [contracts, setContract] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMyContract(currentTag ? { status: currentTag } : '').then(({ results }) => {
      setContract(results || []);
      setLoading(false);
    });
  }, [currentTag]);

  const onTagChange = (value) => {
    setCurrentTag(value);
  };

  const getBgColor = (selectedTag) =>
    tags.filter((tag) => [tag.code, tag.code1].includes(selectedTag))[0];

  return (
    <Wrapper bgColor={getBgColor(currentTag).bgColor}>
      <Helmet title="My Contract" />
      <BackButton url="/recruitment">My Contract</BackButton>
      <section>
        <div className="content">
          {!loading && contracts.length === 0 ? (
            <StyledStamp text="EMPTY" />
          ) : (
            <>
              {contracts.map(({ id, status, title }) => {
                return (
                  <ContractCard key={id} id={id} title={title} color={getBgColor(status).color} />
                );
              })}
            </>
          )}
        </div>
        <ul className="tags">
          {tags.map(({ label, code, color }) => (
            <Tag
              className={currentTag === code ? 'active' : ''}
              key={code}
              $color={color}
              onClick={() => {
                onTagChange(code);
              }}
            >
              <Text className="sm">{label}</Text>
            </Tag>
          ))}
        </ul>
      </section>
    </Wrapper>
  );
};

export default MyContract;
