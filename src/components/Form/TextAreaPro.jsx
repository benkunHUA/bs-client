import React from 'react';
import styled from 'styled-components';
import { Input } from 'antd';

const { TextArea } = Input;

const Container = styled.div`
  position: relative;
`;

const Counter = styled.div`
  position: absolute;
  bottom: 0.1em;
  right: 1em;
  color: #99a2ab;
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 0;
`;

class TextAreaPro extends React.Component {
  state = {
    length: 0,
  };

  componentWillMount() {
    const { value } = this.props;

    const length = value ? value.length : 0;
    this.setState({ length });
  }

  onKeyUp = e => {
    const length = e.target.value.length;
    this.setState({ length });
  };

  render() {
    const { className, ...rest } = this.props;
    const { maxLength } = rest;

    return (
      <Container className={className} onKeyUp={this.onKeyUp}>
        <StyledTextArea {...rest} />
        <Counter>
          {this.state.length} / {maxLength}
        </Counter>
      </Container>
    );
  }
}

export default TextAreaPro;
