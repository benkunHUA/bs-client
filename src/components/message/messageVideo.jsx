import React from 'react';
import { inject, observer } from 'mobx-react';
import { Upload, Icon, Modal, Carousel  } from 'antd';
import styled from 'styled-components';

const HeaderDiv = styled.div`
  position: relative;
  width: 100%;
  height: 110px;
  display: flex;
`;

const PersonInfoDiv = styled.div`
  position: absolute;
  top: 60px;
  left: 60px;
`;

const InfoDiv = styled.div`
  position: relative;
  display: flex;
  padding: 10px;
  padding-bottom: 30px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e4e4e4;
`;

const HeadImg = styled.img`
  width: 64px;
  height: 64px;
  margin-right: 30px;
`;

const TimeBox = styled.span`
  position:absolute;
  right: 10px;
  bottom: 5px;
  color: #666;
  font-size: 14px;
  float: right;
`;

@inject('infoStore')
@observer
class Messages extends React.Component {

  render() {
    const {message} = this.props;
    return (<div>
      <InfoDiv>
        <HeadImg src={message.HEADIMG} />
        <div>
          <video src={message.ALBUMLIST} controls="controls" width="340" height="220">
            您的浏览器不支持 video 标签。
          </video>
        </div>
        <TimeBox>{message.TIME}</TimeBox>
      </InfoDiv>
    </div>);
  }
}

export default Messages;
