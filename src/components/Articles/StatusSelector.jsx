import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Button } from 'antd';

import BoardSeparator from '../BoardSeparator';
import { status } from '../../constant';

const StyledButton = styled(Button)`
  height: 1.8em;

  display: inline-block;
  margin: 1em;
  padding: 0 1.2em;
  border-radius: 1.2em;
  border: none;

  user-select: none;
  cursor: pointer;

  &.ant-btn-clicked::after {
    animation: none;
  }
`;

@inject('articlesStore')
@observer
class StatusSelector extends React.Component {
  handleClickStatus = e => {
    e.preventDefault();

    if (e.target.tagName === 'BUTTON') {
      const status = e.target.getAttribute('data-value');
      this.props.articlesStore.setCurrentStatus(status);
    }
  };

  render() {
    const { articlesStore } = this.props;

    return (
      <div onClick={this.handleClickStatus}>
        {Object.entries(status).map(([code, name], index) => {
          code = Number.parseInt(code, 10);
          return (
            <StyledButton
              key={code}
              data-value={code}
              type={code === articlesStore.currentStatus ? 'primary' : ''}
            >
              {name}
            </StyledButton>
          );
        })}

        <BoardSeparator />
      </div>
    );
  }
}

export default StatusSelector;
