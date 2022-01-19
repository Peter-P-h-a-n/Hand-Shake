import styled from 'styled-components/macro';
import { useParams } from 'react-router-dom';

import { Avatar } from 'components/Avatar';
import { SubTitle, Text } from 'components/Typography';

const Wrapper = styled.div`
  padding: 30px 50px;

  .comment-title {
    color: #4c334d;
    margin-top: 30px;
  }

  .info {
    background-color: rgba(175, 191, 192, 0.5);
    padding: 10px 20px;
    border-radius: 4px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .plain-text {
      color: white;
      font-size: 12px;
    }

    .bio {
      margin-left: 10px;
      background-color: rgba(37, 89, 87, 0.5);
      flex: 1;
      margin: 0 50px;
      padding: 10px 30px;
      transform: skewX(30deg);
      text-align: center;

      > h4 {
        transform: skewX(-30deg);
      }
    }

    .rating {
      display: flex;
      flex-direction: column;
      align-items: center;

      .stats {
        display: flex;
      }

      .plain-text {
        margin-right: 10px;
        margin-top: 10px;
        color: #4c334d;

        :last-child {
          margin-right: 0;
        }

        strong {
          font-size: 12px;
        }
      }
    }
  }
`;

const CommentWrapper = styled.div`
  padding: 30px 50px;
  background-color: rgba(175, 191, 192, 0.5);

  .item {
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #4c334d21;
    padding: 10px;

    .plain-text {
      color: #4c334d;
    }
    .subtitle-text {
      color: white;
    }
  }
`;

const UserProfile = () => {
  const { address } = useParams();

  return (
    <Wrapper>
      <div className="info">
        <div className="rating">
          <Avatar size={48} />
          <div className="stats">
            <Text>
              <strong>10</strong> contracts
            </Text>
            <Text>
              <strong>100</strong> stars
            </Text>
          </div>
        </div>
        <div className="bio">
          <SubTitle className="md bold">
            &ldquo;Free, young and wild&ldquo; <Text> - By {address}</Text>
          </SubTitle>
        </div>
      </div>
      <SubTitle className="md bold comment-title">Comments:</SubTitle>
      <CommentWrapper>
        <div className="item">
          <Text>hxae520d3b3e92fbb38dcf013023d12092299fa1a8b:</Text>
          <SubTitle className="md bold">&ldquo;It is great to work with him&ldquo;</SubTitle>
        </div>
        <div className="item">
          <Text>hxb6b5791be0b5ef67063b3c10sb840fb81514db2fd:</Text>
          <SubTitle className="md bold">&ldquo;His Working is amazing!&ldquo;</SubTitle>
        </div>
        <div className="item">
          <Text>hxcf3af6a05c8f1d6a8eb9f53fef555f4fdf4316262:</Text>
          <SubTitle className="md bold">&ldquo;Will contact next time!&ldquo;</SubTitle>
        </div>
        <div className="item">
          <Text>hx548a976f8eda5d7c0afcb99110ca4d9434cdf921b:</Text>
          <SubTitle className="md bold">&ldquo;Just Love!&ldquo;</SubTitle>
        </div>
      </CommentWrapper>
    </Wrapper>
  );
};

export default UserProfile;
