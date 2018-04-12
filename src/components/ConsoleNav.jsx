import React from 'react';
import { Link, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, Icon, Button } from 'antd';

import Messages from './message/message';
import Album from './Album/Album';

const SubMenu = Menu.SubMenu;

const Container = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  z-index: 1;

  flex-basis: 240px;
  min-height: calc(100vh - 54px);
  background-color: rgb(255, 255, 255);
`;

const ButtonContainer = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  border-radius: 4px;
`;

const StyledMenu = styled(Menu)`
  border-right: none;
`;

const Main = styled.div`
  padding-top: 20px;
  padding-bottom: 34px;
  padding-left: 22px;
  padding-right: 18px;

  flex-basis: calc(100% - 240px);
  max-width: calc(100% - 240px);
  min-width: 860px;

`;

class ConsoleMain extends React.Component {

  render() {
    const defaultSelectedKeys = [];
    defaultSelectedKeys[0] = window.location.pathname;
    const defaultOpenKeys = [];
    defaultOpenKeys[0] = defaultSelectedKeys[0].split('/')[1];
    return (
      <Container style={{ width: 200 }}>
        <Sidebar>
        <Menu
          defaultSelectedKeys={defaultOpenKeys}
          defaultOpenKeys={['sub1']}
           mode="horizontal"
        >
          <Menu.Item key="message">

            <Link to="/message"><Icon type="home" />首页</Link>
          </Menu.Item>
          <Menu.Item key="album">

            <Link to="/album"><Icon type="folder" />相册</Link>
          </Menu.Item>
          <Menu.Item key="video">

            <Link to="/message"><Icon type="youtube" />视频</Link>
          </Menu.Item>
        </Menu>
      </Sidebar>
        <Main>
          <Route exact path="/message" component={Messages} />
          <Route path="/album" component={Album} />
        </Main>
      </Container>
    );
  }
}

export default ConsoleMain;
