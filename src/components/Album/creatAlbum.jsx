import React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Input } from 'antd';
import styled from 'styled-components';
const { TextArea } = Input;

const FormControl = styled.div`
  display: flex;
  margin-bottom: 15px;
  >label{
    width: 100px;
    font-weight: bold;
  }
`;

@inject('albumStore')
@observer
class CreateAlbum extends React.Component {

  changeTitle = (e) => {
    this.props.albumStore.setAlbumTitle(e.target.value);
  }

  changeSummary = (e) => {
    this.props.albumStore.setAlbumSummary(e.target.value);
  }

  render() {
    const {albumStore} = this.props;
    return (
      <Modal
          title="创建相册"
          visible={albumStore.createShow}
          onOk={albumStore.handleCreate}
          onCancel={albumStore.handleCancel}
        >
          <FormControl>
            <label>相册名称：</label>
            <Input placeholder="相册名称" onChange={(e) => this.changeTitle(e)}/>
          </FormControl>
          <FormControl>
            <label>相册简介：</label>
            <TextArea rows={4} placeholder="相册简介" onChange={(e) => this.changeSummary(e)}/>
          </FormControl>
        </Modal>
    );
  }
}

export default CreateAlbum;
