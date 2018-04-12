import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Input, Radio, Button, Select, Cascader } from 'antd';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';

import ContentEditor from './Editor';
import TextAreaPro from './Form/TextAreaPro';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const ButtonBar = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90px;

  background-color: #fff;
  box-shadow: 0 -2px 2px 0 rgba(29, 31, 33, 0.1);
`;

const StyledButton = styled(Button)`
  margin-left: 0.5em;
  margin-right: 0.5em;
  width: 7em;
  height: 2.5em;

  font-size: 1em;
`;

const StyledForm = styled(Form)`
  .ant-row {
    display: flex;
    flex-wrap: nowrap;
  }

  .ant-form-item-label {
    width: 8em;
    padding-right: 1.5em;
    text-align: right;
  }

  .ant-form-item-control-wrapper {
    flex-grow: 1;
    min-width: 1px;
  }

  .ant-cascader-picker {
    width: 10em;
  }

  .ant-input,
  .ant-select-selection {
    border-radius: 0;
    outline: 0;

    &:focus {
      box-shadow: none;
    }
  }

  .ant-select-selection__choice {
    border-radius: 2em !important;
  }
`;

const SectionTitle = styled.div`
  padding-top: 2em;
  padding-bottom: 1.6em;
  padding-left: 0.6em;

  font-size: 1.2rem;
  color: #287ddc;
`;

const ThumbnailType = {
  none: 1,
  one: 2,
  three: 3,
  oneBig: 4,
};

// FIXME thumbnails不需要外部传入, 应该也属于form
const thumbnailCheck = thumbnails => {
  return (rule, value, callback, source) => {
    const count = (thumbnails || []).length;
    const isOne =
      source.thumbnailType === ThumbnailType.one ||
      source.thumbnailType === ThumbnailType.oneBig;
    if (isOne && count !== 1) {
      return callback([new Error('需要上传一张图片')]);
    }
    if (source.thumbnailType === ThumbnailType.three && count !== 3) {
      return callback([new Error('需要上传三张图片')]);
    }
    return callback([]);
  };
};

@withRouter
@inject('editorStore', 'channelStore', 'articlesStore')
@observer
class BaseInfoForm extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = e => {
    let currentEditPanel;
    const getYPosition = function(selector) {
      return document.querySelector(selector).getBoundingClientRect().y;
    };

    const origMeta = [
      {
        selector: '#body',
        y: getYPosition('#body'),
      },
      {
        selector: '#base-info',
        y: getYPosition('#base-info'),
      },
      {
        selector: '#publish-style',
        y: getYPosition('#publish-style'),
      },
    ];

    let meta = origMeta.slice(0, origMeta.length);
    meta = meta.filter(i => i.y <= 0);
    meta = _.sortBy(meta, i => Math.abs(i.y));
    currentEditPanel = (meta[0] && meta[0].selector) || '';

    if (
      window.pageYOffset + window.innerHeight ===
      document.body.clientHeight
    ) {
      const lastIndex = origMeta.length - 1;
      currentEditPanel =
        (origMeta[lastIndex] && origMeta[lastIndex].selector) || '';
    }

    const { editorStore } = this.props;
    editorStore.setCurrentEditPanel(currentEditPanel);
  };

  handleSaveAsDraft = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        this.props.editorStore.saveAsDraft().then(() => {
          this.props.editorStore.setEditing(false);
          this.props.history.push('/');
        });
      }
    });
  };

  handlePublish = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        this.props.editorStore.publish().then(() => {
          this.props.editorStore.setEditing(false);
          this.props.history.push('/');
        });
      }
    });
  };

  handleUpdatePubished = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        this.props.editorStore.setStatus(1);
        this.props.editorStore.update().then(() => {
          this.props.editorStore.setEditing(false);
          this.props.history.push('/');
        });
      }
    });
  };

  handleUpdate = e => {
    e.preventDefault();
    const editNow = window.location.pathname.split('/');
    const editBackLink = editNow[editNow.length-1];
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        this.props.editorStore.update().then(() => {
          this.props.editorStore.setEditing(false);
          'auto' === editBackLink
              ?this.props.history.push('/articles/auto')
              :this.props.history.push('/')
        });
      }
    });
  };

  handlePreview = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        this.props.editorStore.createTemp().then(() => {
          window.open(this.props.editorStore.tempUrl, '_blank');
        });
      }
    });
  };

  render() {
    const isEditingExistOne = this.props.id !== 0;
    const isDraft = this.props.status.value === 2;
    const { channelStore, editorStore } = this.props;
    const { getFieldDecorator } = this.props.form;
    let channels = [];
    channelStore.channels.map(channel => {
      if("1"===channel.display&&"精选"!=channel.name){
        channels.push(channel);
      }
    })

    const formItemLayout = {
      colon: false,
    };

    return (
      <StyledForm onSubmit={this.handleSubmit}>
        <div id="body">
          <FormItem>
            {getFieldDecorator('body', {
              rules: [
                {
                  required: true,
                  message: '请填写正文',
                },
              ],
            })(<ContentEditor />)}
          </FormItem>
        </div>

        <div id="base-info">
          <SectionTitle>基本信息</SectionTitle>

          <FormItem {...formItemLayout} label="标题">
            {getFieldDecorator('title', {
              rules: [
                {
                  max: 50,
                  message: '长度不能大于 50',
                },
                {
                  min: 5,
                  message: '长度不能小于 5',
                },
                {
                  required: true,
                  message: '请填写标题',
                },
              ],
            })(<Input placeholder="请填写标题（5 - 50字）" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="出处">
            {getFieldDecorator('author', {
              rules: [
                {
                  max: 20,
                  message: '长度不能大于 20',
                },
                {
                  min: 1,
                  message: '长度不能小于 1',
                },
              ],
            })(<Input placeholder="请填写出处（1 - 20字）" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="摘要">
            {getFieldDecorator('summary', {
              rules: [
                {
                  max: 120,
                  message: '长度不能大于 120',
                },
                {
                  min: 1,
                  message: '长度不能小于 1',
                },
              ],
            })(
              <TextAreaPro
                maxLength={120}
                placeholder="请填写文章摘要(1 - 120字)"
                autosize={{ minRows: 4, maxRows: 8 }}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="标签">
            {getFieldDecorator('tags', {
              rules: [
                {
                  required: true,
                  message: '请填写标签',
                },
              ],
            })(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                tokenSeparators={[',']}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="频道">
            {getFieldDecorator('channel', {
              rules: [
                {
                  required: true,
                  message: '请选择频道',
                },
              ],
            })(
              <Cascader
                expandTrigger="hover"
                options={channels}
                placeholder="请选择频道"
              />
            )}
          </FormItem>
        </div>

        <div id="publish-style">
          <SectionTitle>发布样式</SectionTitle>

          <FormItem {...formItemLayout} label="推荐理由">
            {getFieldDecorator('recommend', {
              rules: [
                {
                  max: 10,
                  message: '长度不能大于 10',
                },
                {
                  min: 2,
                  message: '长度不能小于 2',
                },
              ],
            })(<Input placeholder="请填写推荐理由（2 - 10字）" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="加入精选">
            {getFieldDecorator('selected', {
              rules: [
                {
                  required: true,
                  message: '请选择是否加入精选',
                },
              ],
            })(
              <RadioGroup>
                <Radio value={0} defaultChecked>
                  不加入精选
                </Radio>
                <Radio value={1}>加入精选</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="列表样式">
            {getFieldDecorator('thumbnailType', {
              rules: [
                {
                  required: true,
                  message: '请选择列表样式',
                },
                {
                  validator: thumbnailCheck(
                    this.props.editorStore.thumbnail.value
                  ),
                },
              ],
            })(
              <RadioGroup>
                <Radio value={ThumbnailType.none}>纯标题</Radio>
                <Radio value={ThumbnailType.one}>单图</Radio>
                <Radio value={ThumbnailType.three}>三图</Radio>
                <Radio value={ThumbnailType.oneBig}>单张大图</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </div>

        <ButtonBar>
          {!isEditingExistOne && (
            <StyledButton
              type="primary"
              onClick={this.handlePublish}
              disabled={editorStore.isProgress}
            >
              发布
            </StyledButton>
          )}
          {!isEditingExistOne && (
            <StyledButton
              onClick={this.handleSaveAsDraft}
              disabled={editorStore.isProgress}
            >
              存为草稿
            </StyledButton>
          )}
          {isEditingExistOne && (
            <StyledButton
              type="primary"
              onClick={this.handleUpdate}
              disabled={editorStore.isProgress}
            >
              更新
            </StyledButton>
          )}
          {isDraft && (
            <StyledButton
              onClick={this.handleUpdatePubished}
              disabled={editorStore.isProgress}
            >
              发布
            </StyledButton>
          )}
          <StyledButton
            onClick={this.handlePreview}
            disabled={editorStore.isProgress}
          >
            预览
          </StyledButton>
        </ButtonBar>
      </StyledForm>
    );
  }
}

export default Form.create({
  onFieldsChange(props, changedFields) {
    props.onFormChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      title: Form.createFormField({
        ...props.title,
        value: props.title.value,
      }),
      body: Form.createFormField({
        ...props.body,
        value: props.body.value,
      }),
      author: Form.createFormField({
        ...props.author,
        value: props.author.value,
      }),
      summary: Form.createFormField({
        ...props.summary,
        value: props.summary.value,
      }),
      channel: Form.createFormField({
        ...props.channel,
        value: props.channel.value.toJS(),
      }),
      tags: Form.createFormField({
        ...props.tags,
        value: props.tags.value.toJS(),
      }),
      recommend: Form.createFormField({
        ...props.recommend,
        value: props.recommend.value,
      }),
      selected: Form.createFormField({
        ...props.selected,
        value: props.selected.value,
      }),
      thumbnailType: Form.createFormField({
        ...props.selected,
        value: props.thumbnailType.value,
      }),
    };
  },
})(BaseInfoForm);
