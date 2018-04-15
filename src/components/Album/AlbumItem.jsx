import React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Carousel } from 'antd';
import styled from 'styled-components';

const AlbumCard = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e4e4;
  margin-left: 20px;
  margin-bottom: 20px;
  padding-bottom: 15px;
`;

const ImgBox = styled.div`
  width: 240px;
  height: 180px;
  text-align: center;
  overflow: hidden;
  margin-bottom: 15px;
  cursor: pointer;
  >img{
    width: 240px;
    min-height: 180px;
  }
`;

const InfoBox = styled.div`
  width: 240px;
  height: 70px;
  padding: 0 15px;
  >span{
    display: block;
    color: #333;
    font-size: 16px;
  }
  >span:last-child{
    color: #666;
    font-size: 14px;
    overflow:hidden;
  	text-overflow:ellipsis;
  	display:-webkit-box;
  	-webkit-box-orient:vertical;
  	-webkit-line-clamp:2;
  }
`;

const PreviewImg = styled.img`
  display:block;
  width: 240px;
  height: 240px;
`;


@inject('albumStore')
@observer
class AlbumItem extends React.Component {

  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  render() {
    const {album} = this.props;
    const firstPic =
      null == album.ALBUMLIST
      ?'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
      :this.props.album.ALBUMLIST[0];

    const picList =
      null == album.ALBUMLIST
      ?['https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png']
      :this.props.album.ALBUMLIST;

    return (<div>
      <AlbumCard>
        <ImgBox onClick={this.showModal}>
          <img alt="example" src={firstPic}/>
        </ImgBox>
        <InfoBox>
          <span>{album.TITLE}</span>
          <span>{album.SUMMARY}</span>
        </InfoBox>
      </AlbumCard>
      <Modal
         title="预览"
         visible={this.state.visible}
         onOk={this.handleOk}
         onCancel={this.handleCancel}
         destroyOnClose="true"
         footer={[]}
       >
         <Carousel effect="fade" autoplay>
           {picList.map(pic => {
             return (<img src={pic} />)
           })}
          </Carousel>
       </Modal>
    </div>);
  }
}

export default AlbumItem;
