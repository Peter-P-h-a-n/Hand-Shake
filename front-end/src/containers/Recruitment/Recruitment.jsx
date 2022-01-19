import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'components/Helmet';

import { useSelect } from 'hooks/useRematch';
import { getContract } from 'services';

import { JobCard } from 'components/Card';
import { Link } from 'components/Typography';
import Stamp from 'components/Stamp';

import { media } from 'components/Styles/Media';

const JobWrapper = styled.div`
  padding: 30px 50px;

  > .create-contract-btn {
    margin-bottom: 20px;

    &[disabled] {
      pointer-events: none;
      opacity: 0.5;
    }
  }
`;

const JobList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 45px;

  background-color: rgba(175, 191, 192, 0.5);
  padding: 50px;
  border-radius: 5px;
  min-height: 80vh;
  position: relative;

  ${media.smallDesktop`
    grid-template-columns: 1fr 1fr 1fr;
  `};

  ${media.xl`
    grid-template-columns: 1fr 1fr;
  `};
`;

const StyledStamp = styled(Stamp)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateZ(-30deg);
`;

const Recruitment = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    accountInfo: { isAuthenticated },
  } = useSelect(({ account: { selectAccountInfo } }) => ({
    accountInfo: selectAccountInfo,
  }));

  useEffect(() => {
    setLoading(true);
    getContract({ status: 'NEW' }).then((rs) => {
      setLoading(false);
      setJobs(rs.results || []);
    });
  }, []);

  return (
    <JobWrapper>
      <Helmet title="Recruitment" />
      <Link
        to="/create-recruitment"
        className="md bold create-contract-btn"
        disabled={!isAuthenticated}
      >
        + Create Recruitment
      </Link>
      <JobList>
        {!loading && jobs.length === 0 ? (
          <StyledStamp text="EMPTY" />
        ) : (
          <>
            {jobs.map((props) => (
              <JobCard key={props.id} {...props} />
            ))}
          </>
        )}
      </JobList>
    </JobWrapper>
  );
};

export default Recruitment;
