import React from 'react';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import { Icon } from 'antd';
import styled from 'styled-components';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { clPrimary, clBorder } from '../../constant';
import agent from '../../agent';

const Container = styled.div`
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
`;

const CropperContainer = styled.div`
  display: block;
  width: 370px;

  .ReactCrop {
    border: 1px solid ${clBorder};
  }
`;

const PreviewerContainer = styled.div`
  display: block;
  width: 250px;
  margin-left: 40px;
`;

const Previewer = styled.img`
  display: block;
  max-width: 100%;
  border: 1px solid ${clBorder};
`;

const UploadTrigger = styled.div`
  position: relative;
  margin: 10px;
  width: 160px;
  height: 100px;
  border: 1px dashed ${clBorder};
  border-radius: 4px;
  overflow: hidden;

  input {
    position: absolute;
    display: block;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
  }

  &:hover {
    border-color: ${clPrimary};
  }

  .plus-icon {
    font-size: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    color: ${clBorder};
  }

  &:hover .plus-icon {
    color: ${clPrimary};
  }
`;

function getBlobPath(blob) {
  if (blob) {
    return window.URL.createObjectURL(blob);
  } else {
    return '';
  }
}

function getCroppedBlob(image, pixelCrop, fileName) {
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(file => {
      if (file) {
        file.name = fileName;
      }

      resolve(file);
    }, 'image/jpeg');
  });
}

@inject(['editorStore'])
@observer
class FileSelector extends React.Component {
  state = {
    showModal: false,
    isUploading: false,
    crop: {},
    blobPath: '',
    blob: null,
    croppedBlob: '',
    croppedFile: null,
  };

  showModal = () => this.setState({ showModal: true });
  hideModal = () => this.setState({ showModal: false });

  // sync croppedBlobPath / croppedBlob with blobPath / blob
  syncCroppedImage = pixelCrop => {
    const image = document.querySelector('.ReactCrop__image');
    getCroppedBlob(image, pixelCrop, 'cropped').then(croppedBlob => {
      const croppedBlobPath = getBlobPath(croppedBlob);
      this.setState({
        croppedBlob,
        croppedBlobPath,
      });

      this.props.editorStore.forceRenderImageCroper();
    });
  };

  onFileChange = e => {
    const blob = e.target.files[0];
    const blobPath = getBlobPath(blob);
    this.setState({
      blob,
      blobPath,
    });

    if (blob) {
      this.showModal();
      this.props.editorStore.forceRenderImageCroper();
    }

    // reset input[type=file] value to make it possible to
    // upload same image.
    e.target.value = '';
  };

  onImageLoaded = image => {
    const crop = makeAspectCrop(
      {
        x: 0,
        y: 0,
        aspect: 16 / 10,
        width: 100,
      },
      image.width / image.height
    );

    this.setState({ crop });

    const pixelCrop = {
      x: Math.round(image.naturalWidth * (crop.x / 100)),
      y: Math.round(image.naturalHeight * (crop.y / 100)),
      width: Math.round(image.naturalWidth * (crop.width / 100)),
      height: Math.round(image.naturalHeight * (crop.height / 100)),
    };
    this.syncCroppedImage(pixelCrop);
  };

  onCropChange = (crop, pixelCrop) => {
    this.setState({ crop });
    this.syncCroppedImage(pixelCrop);
  };

  onCropComplete = (crop, pixelCrop) => {
    this.syncCroppedImage(pixelCrop);
  };

  onCancel = () => {
    this.hideModal();
  };

  onUpload = () => {
    const { editorStore } = this.props;

    const { croppedBlob } = this.state;
    return agent
      .upload(croppedBlob)
      .then(res => {
        this.setState({
          isUploading: true,
        });

        if (res.statusCode === 200) {
          editorStore.addThumbnail(`//${res.Location}`);
        } else {
          throw new Error('上传失败');
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({
          showModal: false,
          isUploading: false,
        });
      });
  };

  render() {
    const {
      showModal,
      isUploading,
      crop,
      blobPath,
      croppedBlobPath,
    } = this.state;

    return (
      <div>
        <Modal
          title="图片裁剪"
          visible={showModal}
          onOk={this.onUpload}
          confirmLoading={isUploading}
          onCancel={this.onCancel}
        >
          <Container>
            <CropperContainer>
              <ReactCrop
                crop={crop}
                src={blobPath}
                onImageLoaded={this.onImageLoaded}
                onChange={this.onCropChange}
                onComplete={this.onCropComplete}
              />
            </CropperContainer>

            <PreviewerContainer>
              <p>预览</p>
              <Previewer src={croppedBlobPath} alt="预览" />
            </PreviewerContainer>
          </Container>
        </Modal>

        <UploadTrigger>
          <Icon className="plus-icon" type="plus" />
          <input type="file" onChange={this.onFileChange} />
        </UploadTrigger>
      </div>
    );
  }
}

export default FileSelector;
