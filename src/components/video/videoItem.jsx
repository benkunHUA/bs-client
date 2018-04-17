import React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Carousel } from 'antd';
import styled from 'styled-components';


@inject('videoStore')
@observer
class VideoItem extends React.Component {

  render() {
    const {video} = this.props;

    return (<div>
      <video src={video.ALBUMLIST} controls="controls" width="340" height="220">
        您的浏览器不支持 video 标签。
      </video>
    </div>);
  }
}

export default VideoItem;
