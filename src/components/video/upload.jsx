import React from 'react';
import { inject, observer } from 'mobx-react';
import { Upload, Icon, Modal } from 'antd';
import styled from 'styled-components';
import defaultImg from '../../assets/list/placeholder.jpg';



@inject('videoStore')
@observer
class Messages extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => {
    this.props.videoStore.setVideoVisible(false);
  }


  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    const status = fileList[0].status;
    const response = fileList[0].response;
    if(status === 'done'){
      this.props.videoStore.setVideoUrl(response.data.url);
      this.props.videoStore.uploadVideo();
    }
  }

  render() {
    const { fileList } = this.state;
    const { videoStore } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Modal visible={videoStore.videoVisible} footer={null} onCancel={this.handleCancel}
        destroyOnClose="true">
          <Upload
            name="files"
            action="http://127.0.0.1:5000/upload/videoUpload"
            listType="picture-card"
            fileList={fileList}
            onChange={this.handleChange}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <video src={videoStore.videoUrl} controls="controls" width="100%" height="300">
            您的浏览器不支持 video 标签。
          </video>
        </Modal>
      </div>
    );
  }
}

export default Messages;
