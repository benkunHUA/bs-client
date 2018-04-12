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
  display: flex;
  padding: 10px;
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
  cursor: pointer;
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

  previewImg = (e,albums) => {
    this.setState({
      visible: true,
    });
  }
  render() {
    const {message} = this.props;
    return (<div>
      <InfoDiv>
        <HeadImg src="http://127.0.0.1:5000/uploads/head02.jpg" />
        <div>
          <p>{message.TITLE}</p>
          <p>{message.SUMMARY}</p>
          <div onClick={(e,albums) => this.previewImg(e,message.ALBUM)}>
            {message.ALBUM.map(album => {
              return (<InfoImg src={album} />)
            })}
          </div>
        </div>
      </InfoDiv>
      <Modal
         title="预览"
         visible={this.state.visible}
         onOk={this.handleOk}
         onCancel={this.handleCancel}
         destroyOnClose="true"
         footer={[]}
       >
         <Carousel effect="fade">
           {message.ALBUM.map(album => {
             return (<InfoImg src={album} />)
           })}
          </Carousel>
       </Modal>
    </div>);
  }
}

export default Messages;
