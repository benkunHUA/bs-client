import React from 'react';
import styled from 'styled-components';

import { clText } from '../../constant';

const Container = styled.div`
  padding: 1.8em;

  font-size: 0.85rem;
  text-align: center;
  color: ${clText};
`;

class NoMoreArticle extends React.Component {
  render() {
    return <Container>没有更多文章了</Container>;
  }
}

export default NoMoreArticle;
