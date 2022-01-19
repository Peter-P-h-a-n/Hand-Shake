import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'components/Helmet';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import { getStorageRef } from '../../firebaseConfig';

import { Header, SubTitle, Text } from 'components/Typography';
import { Button } from 'components/Button';
import Stamp from 'components/Stamp';
import ImageBox from './ImageBox';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrashAlt,
  faPrint,
  faThumbsUp,
  faThumbsDown,
  faPaperPlane,
  faCopy,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

import { hashShortener } from 'utils/app';
import { CONTRACT_STATUS } from 'utils/constants';
import { useDispatch, useSelect } from 'hooks/useRematch';
import {
  getOneContract,
  deleteContract,
  getContractPrivateKey,
  getOneContractByKey,
  submitImages,
  reportContract,
} from 'services';
import { createContract, signContract, completeContract } from 'connectors/Hana/HanaServices';
import { convertToICX } from 'connectors/Hana/utils';

const Wrapper = styled.div`
  position: relative;
  padding: 30px 0;
  max-width: 1000px;
  min-height: 1100px;
  margin: 0 auto;

  .stage {
    width: 100%;
    height: 1000px;
    position: absolute;
    top: 30px;
    left: 0;

    > .box {
      position: absolute;
      width: 50%;
      height: 500px;
      background: #abc7c9;
      border: 25px solid #f8f3e8;
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.07);
      overflow: hidden;
      border-radius: 4px;

      &:nth-child(1) {
        background: #f6efe0;
        border-radius: 5px 0 0 0;
        border-right: none;
        border-bottom: none;
        animation: clr 1.5s 0s ease forwards;
      }
      &:nth-child(2) {
        background: #f6efe0;
        border-radius: 0 5px 0 0;
        left: 50%;
        border-left: none;
        border-bottom: none;
        transform-origin: 0 0;
        transform: rotateY(180deg);
        animation: fold 1.5s 0s ease forwards;
      }
      &:nth-child(3) {
        background: #f6efe0;
        border-radius: 0 0 0 5px;
        top: 500px;
        /* width: 150px; */
        opacity: 0;
        border-top: none;
        border-right: none;
        transform: rotateX(180deg);
        transform-origin: 0 0;
        animation: fold2 1.5s 1s ease forwards;
      }

      &:nth-child(4) {
        background: #f6efe0;
        border-radius: 0 0 5px 0;
        top: 500px;
        left: 50%;
        opacity: 0;
        border-top: none;
        border-left: none;
        transform: rotateX(180deg);
        transform-origin: 0 0;
        animation: fold2 1.5s 1s ease forwards;
      }
    }
  }

  .frame {
    width: 100%;
    height: 1000px;
    padding: 50px;

    opacity: 0;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.06);
    animation: show 0.5s 1.7s ease forwards;

    position: absolute;
    top: 30px;
    left: 0;
    z-index: 10;
  }

  @keyframes clr {
    99.99% {
      background: #f6efe0;
    }
    100% {
      background: #abc7c9;
    }
  }

  @keyframes fold {
    99.99% {
      background: #f6efe0;
    }
    100% {
      background: #abc7c9;
      transform: rotateY(360deg);
    }
  }

  @keyframes fold2 {
    0% {
      opacity: 1;
      background: #f6efe0;
    }
    25% {
      opacity: 1;
      background: #f6efe0;
    }
    40% {
      opacity: 1;
      background: #abc7c9;
    }
    100% {
      opacity: 1;
      background: #abc7c9;
      transform: rotateX(0deg);
    }
  }

  @keyframes show {
    100% {
      opacity: 1;
    }
  }
`;

const Content = styled.div`
  position: relative;

  .subtitle-text,
  .header-text,
  .plain-text {
    color: #4c334d;
  }

  > .header-text {
    text-align: center;
    text-transform: uppercase;
    max-width: 600px;
    margin: auto;
  }

  > .created-at {
    margin-bottom: 50px;
    text-align: center;

    a {
      color: inherit;

      :hover {
        text-decoration: underline;
      }
    }
  }

  > .information {
    display: flex;
    justify-content: space-between;
    margin-bottom: 100px;

    > .description {
      width: 60%;
      white-space: pre-wrap;
      max-height: 250px;
      overflow-y: scroll;

      /* width */
      &::-webkit-scrollbar {
        width: 5px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        background: #abc7c9;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        background: #888;
      }

      .subtitle-text {
        margin-bottom: 30px;
      }
    }

    > .meta {
      width: 35%;

      svg {
        cursor: pointer;
      }

      .subtitle-text {
        margin-bottom: 5px;
      }
    }
  }
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 50px;

  > button {
    color: #4c334d;

    :hover {
      text-decoration: underline;
    }
  }
`;

const InviteButton = styled(Button)`
  color: #4c334d;
  position: absolute;
  top: 5px;
  right: 0;
  border: 2px solid #4c334d;
  padding: 5px 10px;
`;

const StyledStamp = styled(Stamp)`
  position: absolute;
  top: 0;
  left: 0;
`;

const ExchangeSection = styled.div`
  display: flex;
  justify-content: space-around;

  a {
    color: inherit;

    :hover {
      text-decoration: underline;
    }
  }

  > div {
    width: 25%;
  }

  .side-title {
    text-align: center;
  }

  .side-address {
    text-align: center;
    margin-bottom: 150px;
  }

  .image-section {
    .plain-text {
      text-align: center;
      margin-top: 10px;
    }
  }
`;

const seJongTracker = 'https://sejong.tracker.solidwallet.io/address/';

const ContractDetails = ({ isInvitation }) => {
  const [details = {}, setDetails] = useState({});
  const {
    id: recruitmentId,
    contractId,
    title,
    description,
    salary,
    created_at,
    deadline,
    contact,
    deposit,
    status,
    recruiter = {},
    employee = {},
    product = {},
  } = details;

  const [image, setImage] = useState();
  const [contractKey, setContractKey] = useState();
  const [waterMarkImage, setWaterMarkImage] = useState();
  const [uploading, setUploading] = useState(false);
  const { id, key } = useParams();
  const { push } = useHistory();
  const { state = {} } = useLocation();

  const { changed } = state;

  const {
    accountInfo: { address, isContractUpdated, balance },
  } = useSelect(({ account }) => ({
    accountInfo: account.selectAccountInfo,
  }));

  const { setNotification, setAccountInfo, openModal, setDisplay } = useDispatch(
    ({ modal: { setNotification, openModal, setDisplay }, account: { setAccountInfo } }) => ({
      setNotification,
      setAccountInfo,
      openModal,
      setDisplay,
    }),
  );

  const recruiterAdd = recruiter ? recruiter.address : '';
  const employeeAdd = employee ? employee.address : '';

  const isCreator = address === recruiterAdd;
  const isFreelancer = address === employeeAdd;

  useEffect(() => {
    if (isInvitation && employeeAdd) {
      push('/404');
    }
  }, [isInvitation, employeeAdd, push]);

  useEffect(() => {
    if (key && !status) {
      getOneContractByKey(key).then((results) => {
        setDetails(results);
      });
      return;
    }

    if (!title || isContractUpdated || changed) {
      getOneContract(id).then((rs) => setDetails(rs));
    }

    if (status === CONTRACT_STATUS.ON_PROCESS && isCreator && !contractKey) {
      getContractPrivateKey(id).then(({ slug }) => {
        setContractKey(slug);
      });
    }

    return () => {
      setAccountInfo({ isContractUpdated: false });
    };
  }, [id, status, key, isContractUpdated, isCreator, setAccountInfo, title, changed, contractKey]);

  const onImageBoxChanged = (file, wFile) => {
    setImage(file);
    setWaterMarkImage(wFile);
  };

  const onDelete = async () => {
    try {
      openModal({
        title: 'Confirmation',
        desc: 'Are you sure to delete this contract?',
        buttons: {
          onYes: async () => {
            await deleteContract(id);
            setNotification({ type: 'success', text: 'Deteleted!', timeout: true });
            setDisplay(false);
            push('/my-contract');
          },
        },
      });
    } catch (err) {
      setNotification({ type: 'error', text: 'Failed!' });
    }
  };

  const onEdit = () => {
    push('/edit-recruitment', details);
  };

  const onInvite = () => {
    if (balance < convertToICX(salary)) {
      openModal({ title: 'Balance Check', desc: `Don't have enough ICX for this action!` });
      return;
    }
    createContract(id, salary);
  };

  const onJoin = () => {
    if (balance < convertToICX(deposit)) {
      openModal({ title: 'Balance Check', desc: `Don't have enough ICX for this action!` });
      return;
    }
    signContract(contractId, key, recruitmentId, deposit);
  };

  const onApprove = () => {
    completeContract(recruitmentId, contractId);
  };

  const onDownload = () => {
    getDownloadURL(getStorageRef(product.url)).then((url) => {
      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const onSend = async () => {
    if (image && waterMarkImage) {
      try {
        setNotification({ type: 'loading', text: 'Uploading ...' });
        setUploading(true);

        const ref = getStorageRef(new Date().getTime() + '-' + image.name);
        const refW = getStorageRef(new Date().getTime() + '-water-marked');

        const i = await uploadBytes(ref, image);
        const iW = await uploadString(refW, waterMarkImage.split(',')[1], 'base64');
        await submitImages(id, { url: i.metadata.name, watermark: iW.metadata.name });

        setNotification({ type: 'success', text: 'Uploaded!', timeout: true });
        setUploading(true);
      } catch (err) {
        console.log('-- Err', err);
        setNotification({ type: 'error', text: 'Failed!', timeout: true });
        setUploading(true);
      }
    }
  };

  const onReport = () => {
    openModal({
      title: 'Report',
      children: null,
      desc:
        'Your salary, deposit and working files will be locked until the report process ends. Proceed?',
      buttons: {
        onYes: async () => {
          await reportContract(id);
          setNotification({ type: 'success', text: 'Reported!', timeout: true });
          getOneContract(id).then((rs) => setDetails(rs));
        },
      },
    });
  };

  return (
    <Wrapper>
      <Helmet title="Contract Details" />

      <div className="frame">
        {title && (
          <Content>
            <StyledStamp text={status} />
            {status === CONTRACT_STATUS.NEW && isCreator && (
              <InviteButton onClick={onInvite}>
                <FontAwesomeIcon icon={faPrint} color="#4c334d" /> Invite
              </InviteButton>
            )}
            {key && !employeeAdd && (
              <InviteButton onClick={onJoin}>
                <FontAwesomeIcon icon={faPrint} color="#4c334d" /> Join
              </InviteButton>
            )}
            <Header className="md bold">{title}</Header>
            <Text className="sm created-at">
              Created by{' '}
              <a href={seJongTracker + recruiterAdd} target="_blank" rel="noopener noreferrer">
                <strong>{hashShortener(recruiterAdd)}</strong>
              </a>{' '}
              at {new Date(created_at).toLocaleDateString()}
            </Text>

            <div className="information">
              <div className="description">
                <SubTitle className="md">{description}</SubTitle>
              </div>

              <div className="meta">
                <ul>
                  <li>
                    <SubTitle className="md">
                      - Deadline: {new Date(deadline).toLocaleDateString()}
                    </SubTitle>
                  </li>
                  <li>
                    <SubTitle className="md">- Salary: {convertToICX(salary)} ICX</SubTitle>
                  </li>
                  {deposit && (
                    <li>
                      <SubTitle className="md">
                        - Freelance&apos;s deposit: {convertToICX(deposit)} ICX
                      </SubTitle>
                    </li>
                  )}
                  <li>
                    <SubTitle className="md">- Contact: {contact}</SubTitle>
                  </li>
                  {contractKey && (
                    <CopyToClipboard text={location.origin + '/invite/' + contractKey}>
                      <li>
                        <SubTitle className="md">
                          - Invitation Link <FontAwesomeIcon icon={faCopy} color="#4c334d" />
                        </SubTitle>
                      </li>
                    </CopyToClipboard>
                  )}
                </ul>
                {status === CONTRACT_STATUS.NEW && isCreator && (
                  <ControlButtons>
                    <Button onClick={onEdit}>
                      <FontAwesomeIcon icon={faEdit} color="#4c334d" /> Edit
                    </Button>

                    <Button onClick={onDelete}>
                      <FontAwesomeIcon icon={faTrashAlt} color="#4c334d" /> Remove
                    </Button>
                  </ControlButtons>
                )}
              </div>
            </div>

            {recruiterAdd && employeeAdd && (
              <ExchangeSection>
                <div className="recruiter">
                  <SubTitle className="md side-title">Recruiter</SubTitle>
                  <SubTitle className="md bold side-address">
                    <a href={seJongTracker + recruiterAdd} target="_blank" rel="noreferrer">
                      {hashShortener(recruiterAdd)}
                    </a>
                  </SubTitle>

                  {isCreator && status !== CONTRACT_STATUS.DONE && (
                    <ControlButtons>
                      <Button
                        disabled={!product.watermark || status === CONTRACT_STATUS.REPORT}
                        onClick={onApprove}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} color="#4c334d" /> Approve
                      </Button>

                      <Button
                        disabled={!product.watermark || status === CONTRACT_STATUS.REPORT}
                        onClick={onReport}
                      >
                        <FontAwesomeIcon icon={faThumbsDown} color="#4c334d" /> Report
                      </Button>
                    </ControlButtons>
                  )}
                  {status === CONTRACT_STATUS.DONE && (
                    <ControlButtons>
                      <Button disabled={!product.watermark} onClick={onDownload}>
                        <FontAwesomeIcon icon={faDownload} color="#4c334d" /> Download
                      </Button>
                    </ControlButtons>
                  )}
                </div>
                <div className="image-section">
                  <ImageBox
                    onChange={onImageBoxChanged}
                    previewImage={product ? product.watermark : ''}
                  />
                  <Text className="sm">Attached Image</Text>
                </div>
                <div className="freelancer">
                  <SubTitle className="md side-title">Freelancer</SubTitle>
                  <SubTitle className="md bold side-address">
                    <a href={seJongTracker + employeeAdd} target="_blank" rel="noreferrer">
                      {hashShortener(employeeAdd)}
                    </a>
                  </SubTitle>
                  {isFreelancer && (
                    <ControlButtons>
                      <Button
                        onClick={onSend}
                        disabled={uploading || (product && product.watermark) || !waterMarkImage}
                      >
                        <FontAwesomeIcon icon={faPaperPlane} color="#4c334d" /> Send
                      </Button>
                    </ControlButtons>
                  )}
                </div>
              </ExchangeSection>
            )}
          </Content>
        )}
      </div>
      <div className="stage">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </Wrapper>
  );
};

export default ContractDetails;
