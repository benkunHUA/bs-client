import React from 'react';
import { withRouter, Link, Prompt } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Breadcrumb } from 'antd';

import EditForm from './EditForm';
import Uploader from './Uploader';
import { clPrimary } from '../constant';

const StyledBreadcrumb = styled(Breadcrumb)`
  padding-left: 0.8em !important;
  padding-top: 1.2em !important;
  padding-bottom: 1.2em !important;
`;

const Container = styled.div`
  padding-top: 14px;
  padding-bottom: 120px;
  padding-left: 24px;
  padding-right: 24px;

  background-color: rgb(230, 232, 238);
`;

const EditBoard = styled.div`
  background: #fff;
  box-shadow: 0 0 4px 0 rgba(186, 186, 186, 0.5);
  border-radius: 4px;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Nav = styled.nav`
  flex: 0 0 200px;
  padding-left: 20px;

  position: sticky;
  top: 0;

  > div {
    padding-top: 1.4em;
    padding-bottom 1.4em;
  }

  > a {
    display: block;
    padding-top: .7em;
    padding-bottom: .7em;
  }
`;

const EditArea = styled.div`
  flex-grow: 1;
  border-left: 1px solid #e8e8e8;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 140px;
  min-width: 1px;
`;

const StyledA = styled.a`
  color: rgba(0, 0, 0, 0.65);
  &.active {
    color: ${clPrimary} !important;
  }
`;

@inject('editorStore', 'articlesStore', 'articlesAutoStore')
@withRouter
@observer
class Editor extends React.Component {
  onFormChange = changedFields => {
    const { editorStore, articlesStore, articlesAutoStore} = this.props;
    for (const [field, { value }] of Object.entries(changedFields)) {
      field === 'body' && editorStore.setBody(value);
      field === 'title' && editorStore.setTitle(value);
      field === 'author' && editorStore.setAuthor(value);
      field === 'summary' && editorStore.setSummary(value);
      field === 'channel' && editorStore.setChannel(value);
      field === 'tags' && editorStore.setTags(value);
      field === 'recommend' && editorStore.setRecommend(value);
      field === 'selected' && editorStore.setSelected(value);
      field === 'thumbnailType' && editorStore.setThumbnailType(value);
    }
  };

  componentWillMount() {
    const { editorStore } = this.props;

    editorStore.setEditing(true);

    const { params } = this.props.match;
    if (params && params.id) {
      editorStore.load(params.id);
    } else {
      editorStore.reset();
    }
  }

  handleScrollTo = selector => {
    return function() {
      const el = document.querySelector(selector);
      const offset = 5; // scroll 5 more px
      const position =
        el.getBoundingClientRect().y + window.pageYOffset + offset;

      window.scrollTo(0, position);
    };
  };

  render() {
    const { match, editorStore, articlesStore, articlesAutoStore} = this.props;
    const isEditingExistOne = match && match.params && match.params.id;
    const editNow = window.location.pathname.split('/');
    const editBackLink =
      'auto' === editNow[editNow.length-1]
        ?<Link to="/articles/auto">同步内容管理</Link>
        :<Link to="/articles">原创内容管理</Link>;

    const {
      // eslint-disable-next-line no-unused-vars
      render, // force rerender, don't remove it.
      id,
      body,
      title,
      author,
      summary,
      channel,
      status,
      tags,
      recommend,
      selected,
      thumbnailType,
      isEditing,
    } = this.props.editorStore;

    const fields = {
      id,
      body,
      title,
      author,
      summary,
      channel,
      status,
      tags,
      recommend,
      selected,
      thumbnailType,
    };

    return (
      <Container>
        <Prompt
          when={isEditing}
          message={location =>
            this.props.location.pathname === location.pathname
              ? true
              : '确定要不保存当前内容，直接退出吗？'
          }
        />

        <StyledBreadcrumb>
          <Breadcrumb.Item>
            {editBackLink}
          </Breadcrumb.Item>
          {(isEditingExistOne && (
            <Breadcrumb.Item>编辑内容</Breadcrumb.Item>
          )) || <Breadcrumb.Item>新建内容</Breadcrumb.Item>}
        </StyledBreadcrumb>

        <EditBoard>
          <Nav>
            <div>编辑菜单</div>
            <StyledA
              className={
                editorStore.currentEditPanel === '#body' ? 'active' : ''
              }
              onClick={this.handleScrollTo('#body')}
            >
              正文
            </StyledA>
            <StyledA
              className={
                editorStore.currentEditPanel === '#base-info' ? 'active' : ''
              }
              onClick={this.handleScrollTo('#base-info')}
            >
              基本信息
            </StyledA>
            <StyledA
              className={

                editorStore.currentEditPanel === '#publish-style'
                  ? 'active'
                  : ''
              }
              onClick={this.handleScrollTo('#publish-style')}
            >
              发布样式
            </StyledA>
          </Nav>

          <EditArea>
            <EditForm {...fields} onFormChange={this.onFormChange} />
            <Uploader />
          </EditArea>
        </EditBoard>
      </Container>
    );
  }
}

export default Editor;
