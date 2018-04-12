import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import styled from 'styled-components';
const { Meta } = Card;

const ButtonGroup = styled.div`
  display:flex;
  >button{
    margin-right: 30px;
  }
`;

@inject('albumStore')
@observer
class AlbumItem extends React.Component {

  render() {
    const {album} = this.props;
    const firstPic =
      null == album.ALBUMLIST
      ?'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
      :this.props.album.ALBUMLIST[0];
    return (
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt="example" src={firstPic} />}
      >
        <Meta
          title={album.TITLE}
          description={album.SUMMARY}
        />
      </Card>
    );
  }
}

export default AlbumItem;
