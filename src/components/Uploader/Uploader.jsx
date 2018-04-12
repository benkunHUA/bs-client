import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Previewer from './Previewer';
import FileSelector from './FileSelector';

const Container = styled.div`
  display: flex;
  margin-left: 7em;
`;

// FIXME 功能组件不应该去依赖store
@inject(['editorStore'])
@observer
class Uploader extends React.Component {
  render() {
    // eslint-disable-next-line
    const { renderImageCroper } = this.props.editorStore;

    const { editorStore } = this.props;

    const type = editorStore.thumbnailType.value;
    const images = editorStore.thumbnail.value;
    const count = images.length;
    
    let limit;
    switch (type) {
      case 2:
      case 4:
        limit = 1;
        break;
      case 3:
        limit = 3;
        break;
      case 1:
      default:
        limit = 0;
    }


    if (count > limit) {
      editorStore.shortenThumbnail(limit);
    }

    return (
      <Container>
        {images.map((url, index) => <Previewer key={index} src={url} />)}

        {count < limit && <FileSelector />}
      </Container>
    );
  }
}

export default Uploader;
