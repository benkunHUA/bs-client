import React from 'react';
import { inject, observer } from 'mobx-react';
import { Upload, Icon, Modal } from 'antd';
import styled from 'styled-components';

import MessageItem from './messageItem';

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
  componentDidMount() {
    this.props.infoStore.loadInfo();
  }
  render() {
    const {infoStore} = this.props;
    return (
      <div>
        {infoStore.infoList.map(info => {
          return (<MessageItem message={info} key={info.INFOID}/>)
        })}
      </div>
    );
  }
}

export default Messages;
