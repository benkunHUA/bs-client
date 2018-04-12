import React from 'react';
import { Spin, Icon } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 2em;
`;

const ContainerFullScreen = Container.extend`
  height: 100vh;
  align-items: center;
`;

const Icon24 = styled(Icon)`
  font-size: 24px;
`;
const Icon36 = styled(Icon)`
  font-size: 36px;
`;

const Loading24 = <Icon24 type="loading" spin />;
const Loading36 = <Icon36 type="loading" spin />;

export class Spinner extends React.Component {
  render() {
    return (
      <Container>
        <Spin indicator={Loading24} />
      </Container>
    );
  }
}

export class SpinnerFullScreen extends React.Component {
  render() {
    return (
      <ContainerFullScreen>
        <Spin indicator={Loading36} />
      </ContainerFullScreen>
    );
  }
}

export default Spinner;
