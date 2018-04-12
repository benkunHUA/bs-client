import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Switch, Icon, Button, Modal, Popconfirm, Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import ChannelEditor from './channelEditor';

const ChannelTable = styled(Table)`
  background-color: #fff;
  text-align: center;

  > th,td {
    text-align: center!important;
  }

`;

const OperateButton = styled.span`
  color: rgb(0,204,255);
  margin-left: 35px;
  :first-child{
    margin-left: 0;
  }
  :hover{
    cursor: pointer;
  }
`;

const HeaderDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 20px 60px 20px 30px;
  >span{
    font-size: 18px;
    color: #333;
  }
  >button{
    color: #333;
    padding: 5px 10px;
    background-color: #fff;
    border: 1px solid #333;
    border-radius: 3px;
  }
  >button:hover{
    cursor: pointer;
  }
`

@inject('channelStore')
@observer
class Channel extends React.Component {
  showModal = () => {
    this.props.channelStore.setChannelName('');
    this.props.channelStore.setChannelChild([]);
    this.props.channelStore.setVisible(true);
  }

  handleOk = () => {
    this.props.channelStore.addChannels();
  }

  handleCancel = () => {
    this.props.channelStore.setVisible(false);
  }

  updateChannel = id => {
    this.props.channelStore.setVisible(true);
    this.props.channelStore.setChannelEditor(id);
  }

  deleteChannel = id => {
    this.props.channelStore.deleteChannels(id);
  }

  displayChannel = (checked,id) => {
    this.props.channelStore.setDisplayLoading(true);
    this.props.channelStore.setCannelDisplay(checked,id);
  }

  tableKey = (n) => {
    var rnd="";
    for(var i=0;i<n;i++){
      rnd+=Math.floor(Math.random()*10);
    }
    return rnd;
  }

  render(){
    const { channelStore } = this.props;
    const dataSource = [];
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    channelStore.channels.map( channel => {
      channel.key = this.tableKey(5);
      if(channel.children){
        channel.children.map( child => {
          child.key = this.tableKey(4);
        })
      }
      dataSource.push(channel);
    })
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: '频道名称',
        dataIndex: 'label',
        key: 'label'
      }, {
        title: '是否展示',
        key: 'isshow',
        render: (text, record) => {
          if("1" === record.display){
            return(
              <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={(checked,id) => {this.displayChannel(checked,record.id)}} />
            )}else{
              return(
                <Switch checkedChildren="开" unCheckedChildren="关" onChange={(checked,id) => {this.displayChannel(checked,record.id)}} />
              )
            }
          },
      },  {
        title: '操作',
        key: 'action',
        render: (text, record) => (<div>
          <OperateButton onClick={(id) => {this.updateChannel(record.id)}}>编辑</OperateButton>
          <Popconfirm placement="leftTop" title="是否删除" onConfirm={(id) => {this.deleteChannel(record.id)}} okText="Yes" cancelText="No">
            <OperateButton>删除</OperateButton>
          </Popconfirm>
        </div>),
      }
    ];
    return(
      <div>
        <HeaderDiv>
          <span>频道列表</span>
          <button onClick={this.showModal}>新增</button>
        </HeaderDiv>
        <Spin spinning={channelStore.displayLoading}>
          <ChannelTable dataSource={dataSource} columns={columns} />
        </Spin>

        <Modal
          visible={channelStore.visible}
          title="频道编辑"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose="true"
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={channelStore.loading} onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <ChannelEditor />
        </Modal>
      </div>
    );
  }
}
export default Channel;
