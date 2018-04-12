import React from 'react';
import {inject, observer} from 'mobx-react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import styled from 'styled-components';

const FormItem = Form.Item;

const FlexDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ChannelInput = styled(Input)`
  width: 20%;
  margin-left: 10px;
  margin-bottom: 5px;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

@inject('channelStore')
@observer
class channelForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
  }

  addSubChannel = () => {
    this.props.channelStore.addSubChannel();
  }

  redSubChannel = () => {
    this.props.channelStore.redSubChannel();
  }

  changeSubChannel = (e,index) => {
    this.props.channelStore.setChannelChildById(index,e.target.value);
  }

  delSubChannelByIndex(e,index) {
    this.props.channelStore.delSubChannelByIndex(index);
  }
  render() {

    const { getFieldDecorator } = this.props.form;
    const { channelStore } = this.props;

    const channelItems = channelStore.channelChild.value.map((k, index) => {
      return (
        <ChannelInput key={'input'+index} defaultValue={k.channel_name} id={'input'+index}
          onChange={(e,key) => this.changeSubChannel(e,index)}
          suffix={<Icon type="close-circle-o" onClick={(e,key) => this.delSubChannelByIndex(e,index)} style={{ color: 'rgba(0,0,0,.25)',cursor:"pointer" }}/>}/>
      );})
    return (<Form onSubmit={this.handleSubmit} className="login-form">
      <FormItem label="名称：">
        {
          getFieldDecorator('channelName', {
            rules: [
              {
                required: true,
                message: '请输入频道名称'
              }
            ]
          })(<Input placeholder="频道名称（2-12个字）"/>)
        }
      </FormItem>
      <FormItem label="二级频道名称：">
        <FlexDiv>
          {channelItems}
          <IconWrapper>
            <Icon type="plus-circle-o" onClick={this.addSubChannel} style={{cursor:"pointer",marginBottom: "3px" }}/>
            <Icon type="minus-circle-o" onClick={this.redSubChannel} style={{display:channelStore.redButtonVisible, cursor:"pointer"}}/>
          </IconWrapper>
        </FlexDiv>
      </FormItem>
    </Form>);
  }
}
export default Form.create({
  onFieldsChange(props, changedFields) {
    props.onFormChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      channelName: Form.createFormField({
        ...props.channelName,
        value: props.channelName.value,
      }),
    };
  },
})(channelForm);
