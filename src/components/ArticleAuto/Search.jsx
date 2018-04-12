import React from 'react';
import { Input, Icon, Popover, Button, Divider } from 'antd';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import { searchTypes } from '../../constant';

const { Search } = Input;

const Container = styled.div`
  position: relative;
`;

const StyledSearch = styled(Input)`
  .ant-input {
    border-radius: 1.2em;
    width: 18em;
    padding-left: 5em;
  }
`;

const StyledButton = styled(Button)`
  border: none;

  &.ant-btn-clicked:after {
    animation: none;
  }
`;

const StyledDivider = styled(Divider)`
  margin-top: 0.6em !important;
  margin-bottom: 0.6em !important;
`;

@inject('articlesAutoStore')
@observer
class SearchTypeSelector extends React.Component {
  handleClickTitle = () => {
    this.props.articlesAutoStore.setCurrentSearchTypeAsTitle();
  };

  handleClickID = () => {
    this.props.articlesAutoStore.setCurrentSearchTypeAsID();
  };

  render() {
    const { className } = this.props;
    const { articlesAutoStore } = this.props;

    const content = (
      <div>
        <StyledButton onClick={this.handleClickTitle}>标题</StyledButton>
        <StyledDivider />
        <StyledButton onClick={this.handleClickID}>文章 ID</StyledButton>
      </div>
    );

    return (
      <Popover content={content}>
        <span className={className}>
          {searchTypes[articlesAutoStore.currentSearchType]}{' '}
          <Icon type="down" style={{ color: '#CDCDCD' }} />
        </span>
      </Popover>
    );
  }
}

const StyledSearchTypeSelector = styled(SearchTypeSelector)`
  position: absolute;
  z-index: 1;
  left: 1em;
  top: 0.4em;

  user-select: none;
  cursor: pointer;
`;

@inject('articlesAutoStore')
@observer
class SearchWrapped extends React.Component {
  onChange = e => {
    this.props.articlesAutoStore.setCurrentSearchContent(e.target.value);
  };

  onSearch = e => {
    this.props.articlesAutoStore.loadArticles();
  };

  enterSearch = e => {
    if(e.keyCode === 13&&e.target.value.length!=0){
      this.props.articlesAutoStore.loadArticles();
    }
  };

  render() {
    const { className } = this.props;
    const { articlesAutoStore } = this.props;

    return (
      <Container className={className}>
        <StyledSearch
          suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} className="icon-pointer" onClick={this.onSearch}/>}
          placeholder="请输入关键字"
          value={articlesAutoStore.currentSearchContent}
          onChange={this.onChange}
          onKeyDown={this.enterSearch}
        />

        <StyledSearchTypeSelector />
      </Container>
    );
  }
}

export default SearchWrapped;
