import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import SVG from 'react-inlinesvg';
import { Modal, Radio, Tag } from 'antd';

import { clBorder, clInfo, clPrimary } from '../../constant';
import iconDrag from '../../assets/list/drag.svg';

const RadioGroup = Radio.Group;

const Row = styled.div`
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  max-width: 100%;
  border-bottom: 1px solid ${clBorder};
`;

const HeaderRow = Row.extend`
  margin-top: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 1px solid ${clBorder};

  background-color: #f9f9f9;
`;

const Cell = styled.div`
  padding-left: 1em;
  padding-right: 1em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-shrink: 0;

  ${({ expand }) => expand && 'flex-grow: 1;'}
  ${({ length }) => length && `width: ${length}em;`}
  ${({ right }) => right && `text-align: right;`}
  ${({ left }) => left && `text-align: left;`}
  ${({ center }) => center && `text-align: center;`}
  ${({ bold }) => bold && `font-weight: bold;`}
`;

const Trigger = styled.span`
  display: inline-block;
  cursor: pointer;
  color: ${clInfo};
  user-select: none;

  &:hover {
    color: ${clPrimary};

    svg path {
      fill: ${clPrimary};
    }
  }
`;

const TriggerIcon = styled.span`
  svg {
    display: inline-block;
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-left: 6px;
  }

  svg path {
    fill: ${clInfo};
  }

  &:hover {
    svg path {
      fill: ${clPrimary};
    }
  }
`;

@inject('articlesStore')
@observer
export class Item extends React.Component {
  state = {
    showStickModal: false,
    cachedStickPosition: this.props.article.stick_position,
  };

  cacheStickPosition = () => {
    this.setState({
      cachedStickPosition: this.props.article.stick_position,
    });
  };

  showStickModal = () => {
    this.setState({ showStickModal: true });
  };

  hideStickModal = () => {
    this.setState({ showStickModal: false });
    this.cacheStickPosition();
  };

  handleSelectingStickPosition = e => {
    this.setState({
      cachedStickPosition: e.target.value,
    });
  };

  handleSetStickPosition = () => {
    this.props.articlesStore.setStickPosition(
      this.props.article,
      this.state.cachedStickPosition
    );

    this.hideStickModal();
    this.cacheStickPosition();
  };

  handleCancelSelected = () => {
    this.props.articlesStore.cancelSelected(this.props.article);
  };

  handleStick = () => {
    this.props.articlesStore.setStickPosition(this.props.article, 1);
  };

  render() {
    const { article, dragHandle } = this.props;
    const isSticked =
      article.stick_position <= 5 && article.stick_position >= 1;

    if (article.selected === 1) {
      return (
        <Row>
          <Cell length="4" right>
            {article.id}
          </Cell>
          <Cell expand length="20">
            {article.title}
          </Cell>
          <Cell length="12" center>
            {article.selected_time}
          </Cell>
          <Cell length="8" center>
            {isSticked ? (
              <div>
                {article.stick_position === 1 && <Tag color="red">1</Tag>}
                {article.stick_position === 2 && <Tag color="orange">2</Tag>}
                {article.stick_position === 3 && <Tag color="gold">3</Tag>}
                {article.stick_position === 4 && <Tag color="green">4</Tag>}
                {article.stick_position === 5 && <Tag color="lime">5</Tag>}
              </div>
            ) : (
              <Trigger onClick={this.showStickModal}>置顶</Trigger>
            )}
          </Cell>
          <Cell length="10" center>
            <Trigger onClick={this.handleCancelSelected}>取消精选</Trigger>

            {dragHandle && (
              <TriggerIcon {...dragHandle}>
                <SVG src={iconDrag} />
              </TriggerIcon>
            )}
          </Cell>

          <Modal
            title="置顶"
            visible={this.state.showStickModal}
            onOk={this.handleSetStickPosition}
            onCancel={this.hideStickModal}
            width={350}
          >
            <p>请选择置顶位置（置顶后将替换原有数据）</p>
            <RadioGroup
              value={this.state.cachedStickPosition}
              onChange={this.handleSelectingStickPosition}
            >
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
              <Radio value={5}>5</Radio>
            </RadioGroup>
          </Modal>
        </Row>
      );
    } else {
      return null;
    }
  }
}

export class Header extends React.Component {
  render() {
    return (
      <HeaderRow>
        <Cell bold length="4" right>
          ID
        </Cell>
        <Cell bold expand left length="20">
          标题
        </Cell>
        <Cell bold length="12" center>
          加入精选时间
        </Cell>
        <Cell bold length="8" center>
          置顶状态
        </Cell>
        <Cell bold length="10" center>
          操作
        </Cell>
      </HeaderRow>
    );
  }
}

export default Item;
