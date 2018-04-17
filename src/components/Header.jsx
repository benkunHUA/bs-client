import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Avatar, Menu, Dropdown, Icon } from 'antd';
import SVG from 'react-inlinesvg';

import { clHeader } from '../constant';
import logo from '../assets/logo2.svg';
import bgtop from '../assets/bg_top.jpg';

const Container = styled.header`
  width: 100%;
  height: 150px;
  padding: 1em 2em;
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: #333;
  background-image: url(${bgtop});
  background-size: 100%;
  background-repeat: no-repeat;
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 0.8em !important;
`;

const HeadBox = styled.div`
  display: flex;
  flex-direction: column;
  span{
    color: #666;
    font-size: 18px;
    margin-top: 15px;
  }
`;

const HeadAvatar = styled(Avatar)`
  width: 48px!important;
  height: 48px!important;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DropdownTrigger = styled.div`
  color: #333;
  cursor: pointer;
  user-select: none;
`;

@inject('userStore', 'authStore', 'commonStore')
@withRouter
@observer
class Header extends React.Component {
  handleClickLogout = () => {
    this.props.authStore.logout();
  };

  render() {
    const {commonStore} = this.props;
    console.log(commonStore.headImg);
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="" onClick={this.handleClickLogout}>
            注销
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Container>
        <HeadBox>
          <HeadAvatar src={window.localStorage.getItem('headImg')} />
          <span>{window.localStorage.getItem('nickname')}</span>
        </HeadBox>

        <InfoContainer>
          <StyledAvatar size="small" icon="user" />
          <Dropdown overlay={menu} trigger={['click']}>
            <DropdownTrigger>
              {this.props.userStore.currentUser} <Icon type="down" />
            </DropdownTrigger>
          </Dropdown>
        </InfoContainer>
      </Container>
    );
  }
}

export default Header;
