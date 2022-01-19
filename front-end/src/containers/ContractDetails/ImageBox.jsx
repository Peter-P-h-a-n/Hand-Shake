import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Text } from 'components/Typography';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

import { useDispatch } from 'hooks/useRematch';
import { getStorageRef } from '../../firebaseConfig';
import { getDownloadURL } from 'firebase/storage';

import watermark from 'watermarkjs';
import icon from 'assets/images/water-mark-icon.png';
import search from 'assets/images/search.png';

const Wrapper = styled.div`
  border: 3px dashed rgba(76, 51, 77, 0.5);
  height: 250px;
  margin-top: 80px;
  padding: 10px;
  border-radius: 10px;

  display: grid;
  place-items: center;

  .img-wrapper {
    position: relative;
    cursor: pointer;

    :hover {
      :after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: transparent center / 40% no-repeat url('${search}');
        opacity: 0.5;
      }
    }
  }

  img {
    width: 135px;
    max-height: 150px;
    opacity: 0.7;
  }

  > label {
    cursor: pointer;
    display: flex;
    align-items: center;

    svg {
      margin-right: 10px;
    }
  }

  #upload-photo {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }
`;

const ImageBox = ({ onChange, previewImage }) => {
  const [waterMakrFile, setWaterMarkFile] = useState();
  const [imageURL, setImageURL] = useState();

  const { openModal } = useDispatch(({ modal: { openModal } }) => ({
    openModal,
  }));

  useEffect(() => {
    if (previewImage) {
      getDownloadURL(getStorageRef(previewImage)).then((url) => {
        setImageURL(url);
      });
    }
  }, [previewImage]);

  const onPreview = () => {
    openModal({
      title: 'Preview',
      desc: '',
      children: <img src={waterMakrFile || imageURL} alt="image" />,
    });
  };

  const onFileChange = (event) => {
    const image = event.target.files[0];
    if (!image) return;
    if (image.size > 1024 * 1024) {
      openModal({ title: 'Error', desc: 'Only image under 1MB accepted!', children: null });
      return;
    }

    watermark([image, icon])
      .image(watermark.image.center())
      .then((img) => {
        setWaterMarkFile(img.src);
        onChange(image, img.src);
      });
  };

  return (
    <Wrapper>
      {!previewImage && (
        <>
          <label htmlFor="upload-photo">
            <FontAwesomeIcon icon={faUpload} size="2x" color="#4c334d" />
            <Text className="md">Upload A Image</Text>
          </label>
          <input
            type="file"
            name="photo"
            id="upload-photo"
            onChange={onFileChange}
            accept="image/*"
          />
        </>
      )}
      {(waterMakrFile || previewImage) && (
        <div className="img-wrapper" onClick={onPreview} title="click to preview">
          <img src={waterMakrFile || imageURL} alt="image" />
        </div>
      )}
    </Wrapper>
  );
};

export default ImageBox;
