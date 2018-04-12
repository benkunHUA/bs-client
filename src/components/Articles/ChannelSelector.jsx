import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Menu } from 'antd';

import Search from './Search';

const MenuItem = Menu.Item;

const Container = styled.div`
  position: relative;
`;

const StyledMenuItem = styled(MenuItem)`
  user-select: none;
  padding: 10px 0 !important;
  margin-left: 1em !important;
  margin-right: 1em !important;
`;

const StyledSearch = styled(Search)`
  position: absolute;
  right: 0;
  top: 1.2em;
`;

@inject('articlesStore', 'channelStore')
@observer
class ChannelSelector extends React.Component {
  handleClick = e => {
    // const channel = Number.parseInt(e.key, 10);
    const channel = e.key;
    const { articlesStore } = this.props;
    articlesStore.setCurrentChannel(channel);
    articlesStore.setCurrentSubChannel(-2);
  };

  handleSubChannelClick = e => {
    // const channel = Number.parseInt(e.key, 10);
    const subChannel = e.key;
    const { articlesStore } = this.props;
    articlesStore.setCurrentSubChannel(subChannel);
  };

  render() {
    const { articlesStore, channelStore } = this.props;
    let subChannelMenu;
    channelStore.channels.map( channel => {
      if(channel.channel_id == articlesStore.currentChannel&&channel.children&&0!=channel.children.length){
        subChannelMenu = channel.children;
      }
    });
    return (
      <Container>
        <Menu
          onClick={this.handleClick}
          defaultSelectedKeys={['-1']}
          selectedKeys={[articlesStore.currentChannel.toString()]}
          mode="horizontal"
        >
          <StyledMenuItem key={-1}>全部</StyledMenuItem>

          {channelStore.channels.map(channel => {
            if("1" === channel.display&&"精选"!=channel.name){
              return (<StyledMenuItem key={channel.channel_id}>{channel.name}</StyledMenuItem>)
            }
            }
          )}
        </Menu>

        <Menu
          onClick={this.handleSubChannelClick}
          defaultSelectedKeys={['-2']}
          selectedKeys={[articlesStore.currentSubChannel.toString()]}
          mode="horizontal"
        >
          {subChannelMenu&&<StyledMenuItem key={-2}>全部</StyledMenuItem>}

          {subChannelMenu&&
            subChannelMenu.map( child => {
              return (<StyledMenuItem key={child.channel_id}>{child.name}</StyledMenuItem>)
            })
          }
        </Menu>

        <StyledSearch />
      </Container>
    );
  }
}

export default ChannelSelector;
