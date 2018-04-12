import { observable, action, computed } from 'mobx';
import _ from 'lodash';

import agent from '../agent';

function convert(channels) {
  channels = _.sortBy(channels, 'channel_id');

  for (const channel of channels) {
    // add useful field in antd's Cascader
    channel.label = channel.name;
    channel.value = channel.channel_id;

    const { children } = channel;
    if (children) {
      convert(children);
    }
  }
  return channels;
}

class ChannelStore {

  @observable loading = false;
  @observable displayLoading = false;
  @observable visible = false;
  @observable redButtonVisible = 'none';
  @observable channels = [];
  @observable channelId = { value: ''};
  @observable channelName = { value: ''};
  @observable channelChild = { value: []};
  @observable channelChildLength = 0;
  @observable isShow = false;

  @computed
  get channelsFlat() {
    const channels = [];
    for (const channel of this.channels.toJS()) {
      if (channel.children) {
        for (const child of channel.children) {
          channels.push(child);
        }
      }
      channels.push(channel);
    }

    return channels;
  }

  @action
  setChannelName(channelName){
    this.channelName.value = channelName;
  }

  @action
  setChannelId(channelId){
    this.channelId.value = channelId;
  }

  @action
  setChannelChild(channelChild){
    this.channelChild.value = channelChild;
  }

  @action
  setDisplayLoading(display){
    this.displayLoading = display;
  }

  @action
  setCannelDisplay(display,id){
    display = display === true? 1 : 0;
    return agent.Channels.displayCannel(display,id)
      .then(res => console.log(res))
      .finally(() => {
        this.pullChannels();
        this.setDisplayLoading(false);
      });
  }

  @action
  setChannelChildById(index,value){
    if(this.channelChild.value[index].id){
      this.channelChild.value[index].channel_name = value;
    }else{
      this.channelChild.value[index] = {channel_name:value};
    }
  }

  @action
  addSubChannel(){
    this.channelChild.value.push('');
    this.setRedSubChannel('block');
  }

  @action
  redSubChannel(){
    this.channelChild.value.pop();
    if(this.channelChild.value.length === this.channelChildLength){
      this.setRedSubChannel('none');
    }
  }

  @action
  delSubChannelByIndex(index){
    let arr = [];
    this.channelChild.value.map( channel => {
      arr.push(channel);
    });
    arr.splice(index,1);
    this.setChannelChild([]);
    setTimeout(()=>{
      this.setChannelChild(arr);
    },100)


  }
  @action
  setRedSubChannel(visible){
    this.redButtonVisible = visible;
  }

  @action
  setChannelChildLength(length){
    this.channelChildLength = length;
  }
  @action
  setChannelEditor(id){
    this.channels.map( channel => {
      if(id == channel.id){
        let childArray = [];
        this.setChannelId(id);
        this.setChannelName(channel.name);
        if(channel.children){
          channel.children.map( child => {
            childArray.push({id:child.id,channel_name:child.name,channel_id:child.id});
          })
        }
        this.setChannelChild(childArray);
        this.setChannelChildLength(childArray.length);
      }
    });
  }

  @action
  pullChannels() {
    this.setLoading(true);

    return agent.Channels.index()
      .then(channels => this.setChannels(convert(channels)))
      .finally(() => {this.setLoading(false);console.log(this.channels)});
  }

  @action
  addChannels() {
    this.setLoading(true);
    const channelName = this.channelName.value;
    const channleId = this.channelId.value;
    const subChannel = this.channelChild.value;
    const display = '1';
    /*新增频道*/
    if('' === channleId){
      const channel = {
        channel_name: channelName,
        sub_channel: subChannel,
        display: display
      }
      return agent.Channels.addChannels(channel)
        .then(res => console.log(res))
        .finally(() => {
          this.pullChannels();
          this.setLoading(false);
          this.setVisible(false);
          this.setChannelId('');
        });
    }else{ /*修改频道*/
      const channel = {
        id: channleId,
        channel_id: channleId,
        channel_name: channelName,
        sub_channel: subChannel,
        display: display
      }
      return agent.Channels.editChannels(channel)
        .then(res => console.log(res))
        .finally(() => {
          this.pullChannels();
          this.setLoading(false);
          this.setVisible(false);
          this.setChannelId('');
        });
    }
  }
  @action
  deleteChannels(id) {
    return agent.Channels.deleteChannel(id)
      .then(res => console.log(res))
      .finally(() => {
        this.pullChannels();
      });
  }

  @action
  setChannels(channels) {
    this.channels = channels;
  }

  @action
  setLoading(status) {
    this.loading = status;
  }

  @action
  setVisible(status) {
    this.visible = status;
  }
}

export default new ChannelStore();
