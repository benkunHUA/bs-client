import React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Upload, Icon, message, Select, Checkbox  } from 'antd';
import styled from 'styled-components';
const Dragger = Upload.Dragger;
const Option = Select.Option;

const StyleModal = styled(Modal)`
  width: 75%!important;
  height: 800px!important;
  .ant-modal-body{
    padding-top: 0!important;
  }
`;

const SelectBox = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  span{
    color: #333;
  }
  .ant-checkbox-wrapper{
    margin-left: 50px!important;
  }
`;

function handleChange(value) {
  console.log(`selected ${value}`);
}

@inject('albumStore')
@observer
class CreateAlbum extends React.Component {

  handleChange = (value) => {
    console.log(value);
    this.props.albumStore.setAlbumId(value);
  }

  isShare = (e) => {
    this.props.albumStore.setIsShare(e.target.checked);
  }

  render() {
    const {albumStore} = this.props;
    const props = {
      name: 'files',
      multiple: true,
      action: `http://127.0.0.1:5000/upload/file_upload?albumId=${albumStore.albumId}`,
      onChange(info) {
        const status = info.file.status;
        const response = info.file.response;
        if (status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          albumStore.addMultipleProgress();
          albumStore.addUploadList(response.data.url);
          if(info.fileList.length == albumStore.multipleProgress){
            albumStore.uploadAlbumPic();
          }
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    let defaultValue = '';
    const options = albumStore.albumList.map((item,index) => {
      if(0 == index){
        defaultValue = item.TITLE;
      }
      return (<Option value={item.ALBUMID}>{item.TITLE}</Option>)
    })

    return (
      <StyleModal
          title="图片上传"
          visible={albumStore.uploadShow}
          onOk={albumStore.handleCreate}
          onCancel={albumStore.closeUpload}
          destroyOnClose="true"
          footer={[]}
        >
          <SelectBox>
            <span>上传到：</span>
            <Select defaultValue={defaultValue} style={{ width: 200 }} onChange={this.handleChange}>
              {options}
            </Select>
            <Checkbox onChange={this.isShare}>是否分享</Checkbox>
          </SelectBox>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
          </Dragger>
        </StyleModal>
    );
  }
}

export default CreateAlbum;
