import React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Icon } from 'antd';
import styled from 'styled-components';
import CreateAlbum from './creatAlbum';
import UploadAlbum from './uploadAlbum';
import AlbumItem from './AlbumItem';

const ButtonGroup = styled.div`
  display:flex;
  >button{
    margin-right: 30px;
  }
`;

const AlbumWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
`;

@inject('albumStore')
@observer
class Album extends React.Component {

  componentDidMount() {
    this.props.albumStore.loadAlbums();
  }

  createAlbum = () =>{
    const {albumStore} = this.props;
    albumStore.setCreateShow(true)
  }

  uploadAlbum = () =>{
    const {albumStore} = this.props;
    albumStore.setUploadShow(true)
  }

  render() {
    const {albumStore} = this.props;

    return (<div>
      <ButtonGroup>
        <Button type="primary" icon="cloud" onClick={this.uploadAlbum}>上传照片</Button>
        <Button onClick={this.createAlbum}>创建相册</Button>
      </ButtonGroup>
      <CreateAlbum />
      <UploadAlbum />
      <AlbumWrapper>
        {albumStore.albumList.map(item => {
          return (<AlbumItem album={item} style={{marginLeft:"15px"}}/>)
        })}
      </AlbumWrapper>
    </div>);
  }
}

export default Album;
