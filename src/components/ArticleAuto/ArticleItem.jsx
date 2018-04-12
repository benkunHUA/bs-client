/*
 * This components should be refactered with Event Proxy pattern, but
 * I have no time to do it now. Later, do it ;)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import SVG from 'react-inlinesvg';

import { clBorder, clPrimary, clInfo } from '../../constant';
import iconSelected from '../../assets/list/selected.svg';
import iconEdit from '../../assets/list/edit.svg';
import iconPublish from '../../assets/list/publish.svg';
import iconPullOff from '../../assets/list/pull-off.svg';
import iconRemove from '../../assets/list/remove.svg';
import imagePlaceholder from '../../assets/list/placeholder.jpg';

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 14px;
  padding-right: 0;

  border-bottom: 1px solid ${clBorder};
`;

const Cover = styled.div`
  display: block;
  margin-right: 28px;
  height: 100px;
  width: 160px;

  > img {
    display: block;
    object-fit: cover;
    height: 100px;
    width: 160px;
  }
`;

const Content = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  min-width: 0;
`;

/* row 1 */
const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

/* row 2 */
const Details = styled.div``;

const Selected = styled.span`
  display: inline-block;
  margin-right: 16px;
  padding: 1px 10px;

  border: 1px solid ${clPrimary};
  border-radius: 2px;

  font-size: 10px;
  color: ${clPrimary};
  background: rgba(40, 125, 220, 0.05);
`;

/* row 3 */
const Misc = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Counting = styled.div``;

const Toolbar = styled.div``;

/* general */

const InlineContainer = styled.div`
  display: inline-block;
`;

const Span = styled.span`
  display: inline-block;
  margin-right: 16px;
  font-size: 12px;
  color: ${clInfo};
`;

const Trigger = styled.button`
  display: inline-block;
  margin-right: 16px;
  font-size: 12px;
  color: ${clInfo};
  cursor: pointer;
  user-select: none;
  border: 0;
  outline: none;
  background: none;

  ${({ last }) => last && 'margin-right: 0;'} svg {
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    margin-right: 4px;
  }

  svg path {
    fill: ${clInfo};
  }

  &:focus {
    outline: none;
  }

  &:hover {
    color: ${clPrimary};

    svg path {
      fill: ${clPrimary};
    }
  }
`;

@inject('articlesAutoStore')
@observer
class ArticleItem extends React.Component {
  state = {
    showRemoveModal: false,
    showPullOffModal: false,
  };

  showRemoveModal = () => {
    this.setState({
      showRemoveModal: true,
    });
  };

  hideRemoveModal = () => {
    this.setState({
      showRemoveModal: false,
    });
  };

  showPullOffModal = () => {
    this.setState({
      showPullOffModal: true,
    });
  };

  hidePullOffModal = () => {
    this.setState({
      showPullOffModal: false,
    });
  };

  handleSetSelected = () => {
    this.props.articlesAutoStore.setSelected(this.props.article);
  };

  handleCancelSelected = () => {
    this.props.articlesAutoStore.cancelSelected(this.props.article);
  };

  handleEdit = () => {};

  handlePublish = () => {
    this.props.articlesAutoStore.setStatusAsPublished(this.props.article);
  };

  handlePullOff = () => {
    this.props.articlesAutoStore.setStatusAsPullOffed(this.props.article);
  };

  handleRemove = () => {
    this.props.articlesAutoStore.deleteOne(this.props.article);
  };

  render() {
    const { article, articlesAutoStore } = this.props;
    const isPublished = article.status === 1;
    const isDraft = article.status === 2;
    const isPullOffed = article.status === 3;
    const isSelected = article.selected === 1;
    const isOriginal = article.status === 0;
    const isUnPublished = article.status === 0;
    let cover = imagePlaceholder;
    if(null!=article.thumbnail&&null!=article.thumbnail[0]){
      cover = article.thumbnail[0];
    }

    return (
      <Container>
        {!isUnPublished &&<Cover>
          <img src={cover} alt="封面" />
        </Cover>}
        <Content>
          <Title>{article.title}</Title>
          <Details>

            {isSelected && <Selected>精选</Selected>}

            {article.id && <Span>ID: {article.id}</Span>}

            {article.author && <Span>{article.author}</Span>}

            {article.channel_name && (
              <Span>
                {article.channel_name}
                {article.sub_channel_name && `/${article.sub_channel_name}`}
              </Span>
            )}

            {isDraft ? (
              <Span>{article.create_time}</Span>
            ) : (
              <Span>{article.first_release_time}</Span>
            )}

            {isPublished && <Span>已发表</Span>}

            {isUnPublished && (
              <Link to={`/articles/${article.id}/auto`}>
                <Trigger>
                  <SVG src={iconEdit} />
                  编辑
                </Trigger>
              </Link>
            )}

            {
            isUnPublished && (
              <Trigger
                onClick={this.handlePublish}
                disabled={articlesAutoStore.isProgress}
              >
                <SVG src={iconPublish} />
                发布
              </Trigger>
            )}

          </Details>
          <Misc>
            {isPublished && (
              <Counting>
                <Span>阅读量： {article.reading_num}</Span>
                <Span>分享量： {article.share_num}</Span>
                <Span>收藏量： {article.collection_num}</Span>
              </Counting>
            )}

            <Toolbar>
              {isPublished ? (
                isSelected ? (
                  <Trigger
                    onClick={this.handleCancelSelected}
                    disabled={articlesAutoStore.isProgress}
                  >
                    <SVG src={iconSelected} />
                    取消精选
                  </Trigger>
                ) : (
                  <Trigger
                    onClick={this.handleSetSelected}
                    disabled={articlesAutoStore.isProgress}
                  >
                    <SVG src={iconSelected} />
                    加入精选
                  </Trigger>
                )
              ) : null}

              {!isUnPublished && (
                <Link to={`/articles/${article.id}/auto`}>
                  <Trigger>
                    <SVG src={iconEdit} />
                    编辑
                  </Trigger>
                </Link>
              )}

              {
              (isUnPublished&&isPublished) && (
                <Trigger
                  onClick={this.handlePublish}
                  disabled={articlesAutoStore.isProgress}
                >
                  <SVG src={iconPublish} />
                  发布
                </Trigger>
              )}

              {isPublished && (
                <InlineContainer>
                  <Trigger last onClick={this.showPullOffModal}>
                    <SVG src={iconPullOff} />
                    下架
                  </Trigger>
                  <Modal
                    title="下架文章"
                    visible={this.state.showPullOffModal}
                    onOk={this.handlePullOff}
                    confirmLoading={articlesAutoStore.isProgress}
                    onCancel={this.hidePullOffModal}
                    width={350}
                  >
                    <p>下架后的文章不可恢复。确定要这么做吗？</p>
                  </Modal>
                </InlineContainer>
              )}

              {(isDraft || isPullOffed) && (
                <InlineContainer>
                  <Trigger onClick={this.showRemoveModal}>
                    <SVG src={iconRemove} />
                    删除
                  </Trigger>
                  <Modal
                    title="删除文章"
                    visible={this.state.showRemoveModal}
                    onOk={this.handleRemove}
                    confirmLoading={articlesAutoStore.isProgress}
                    onCancel={this.hideRemoveModal}
                    width={350}
                  >
                    <p>删除后的文章不可恢复。确定要这么做吗？</p>
                  </Modal>
                </InlineContainer>
              )}
            </Toolbar>
          </Misc>
        </Content>
      </Container>
    );
  }
}

export default ArticleItem;
