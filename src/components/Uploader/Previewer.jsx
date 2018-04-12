import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { Icon } from 'antd';

import { clBorder, clPrimary } from '../../constant';

const Container = styled.div`
  position: relative;
  margin: 10px;
  width: 160px;
  height: 100px;
  display: inline-block;
  border: 1px dashed ${clBorder};
  border-radius: 4px;

  img {
    max-width: 100%;
  }

  .delete-icon {
    position: absolute;
    top: 5px;
    right: 5px;

    display: none;
    cursor: pointer;
  }

  &:hover {
    border-color: ${clPrimary};
  }

  &:hover .delete-icon {
    display: block;
    color: ${clPrimary};
  }
`;

@inject(['editorStore'])
@observer
class Previewer extends React.Component {
  handleDelete = () => {
    const { editorStore, src } = this.props;
    editorStore.removeThumbnail(src);
  };

  render() {
    const { src } = this.props;

    return (
      <Container>
        <Icon
          className="delete-icon"
          type="delete"
          onClick={this.handleDelete}
        />
        <img src={src} alt="预览图" />
      </Container>
    );
  }
}

export default Previewer;
