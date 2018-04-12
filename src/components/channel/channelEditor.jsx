import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import EditForm from './channelForm';

@inject('channelStore')
@observer
class channelEditor extends React.Component {
  onFormChange = changedFields => {
    const { channelStore } = this.props;
    for (const [field, { value }] of Object.entries(changedFields)) {
      field === 'channelName' && channelStore.setChannelName(value);
    }
  };

  render(){
    const {
      // eslint-disable-next-line no-unused-vars
      render, // force rerender, don't remove it.
      channelName,
    } = this.props.channelStore;

    const fields = {
      channelName,
    };
    return(
      <EditForm {...fields} onFormChange={this.onFormChange}/>
    )
  }
}

export default channelEditor;
