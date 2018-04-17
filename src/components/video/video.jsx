import React from 'react';
import { inject, observer } from 'mobx-react';
import { Upload, Icon, Modal, Button } from 'antd';
import styled from 'styled-components';

import VideoUpload from './upload';
import VideoItem from './videoItem';

const ButtonGroup = styled.div`
  display:flex;
  >button{
    margin-right: 30px;
  }
`;

const VideoBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  video{
    margin-left: 30px;
    margin-bottom: 30px;
  }
`;

@inject('videoStore')
@observer
class Messages extends React.Component {
  componentDidMount() {
    this.props.videoStore.loadVideo()
  }

  uploadVideo = () => {
    this.props.videoStore.setVideoVisible(true);
  }
  render() {
    const {videoStore} = this.props;
    return (
      <div>
        <ButtonGroup>
          <Button type="primary" icon="cloud" onClick={this.uploadVideo}>上传视频</Button>
        </ButtonGroup>
        <VideoBox>
          {videoStore.videoList.map(item => {
            return (<VideoItem video={item}/>);
          })}
        </VideoBox>

        <VideoUpload />
      </div>
    );
  }
}

export default Messages;
