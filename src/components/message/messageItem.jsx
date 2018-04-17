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

const InfoImg = styled.img`
  width: 120px;
  height: 120px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;
const PreviewModal = styled(Modal)`
  width: 50%!important;
  .ant-modal-header,
  .ant-modal-body,
  .ant-modal-footer{
    padding: 0!important;
  }
`;
const PreviewImg = styled.img`
  width: 100%;
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

  state = { visible: false }
  componentDidMount() {
    this.props.infoStore.loadInfo();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  previewImg = (e,album) => {
    this.props.infoStore.setCurrentPreview(album);
    this.setState({
      visible: true,
    });
  }

  render() {
    const {message} = this.props;
    var list = message.ALBUMLIST;
    return (<div>
      <InfoDiv>
        <HeadImg src={message.HEADIMG} />
        <div>
          <p>{message.TITLE}</p>
          <p>{message.SUMMARY}</p>
          <div>
            {list.map((album,index) => {
              return (<InfoImg key={index} src={album} onClick={(e,index) => this.previewImg(e,album)}/>)
            })}
          </div>
        </div>
        <TimeBox>{message.TIME}</TimeBox>
      </InfoDiv>
      <PreviewModal
         visible={this.state.visible}
         onOk={this.handleOk}
         onCancel={this.handleCancel}
         destroyOnClose="true"
         footer={[]}
       >
         <PreviewImg src={this.props.infoStore.currentPreview} />
       </PreviewModal>
    </div>);
  }
}

export default Messages;
