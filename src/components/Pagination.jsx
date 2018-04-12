import React from 'react';
import { Pagination } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;

  .ant-pagination-prev .ant-pagination-item-link:after {
    content: '上一页';
    padding-left: 1.4em;
    padding-right: 1.4em;
  }

  .ant-pagination-next .ant-pagination-item-link:after {
    content: '下一页';
    padding-left: 1.4em;
    padding-right: 1.4em;
  }
`;

class PaginationWrapped extends React.Component {
  render() {
    const { ...rest } = this.props;

    return (
      <Container>
        <Pagination {...rest} />
      </Container>
    );
  }
}

export default PaginationWrapped;
