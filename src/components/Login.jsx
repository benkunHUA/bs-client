import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import SVG from 'react-inlinesvg';
import { Form, Button, Input } from 'antd';

import { clPrimary, clBg } from '../constant';
import loginBG from '../assets/login.png';
import logo from '../assets/logo1.svg';

const Container = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${clBg};
`;

const BoardsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  border-radius: 4px;
  overflow: hidden;
`;

const LoginBoard = styled.div`
  padding-top: 158px;
  padding-bottom: 158px;
  padding-left: 60px;
  padding-right: 60px;

  background-color: #fff;
`;

const Title = styled.h1`
  font-weight: 300;
  font-size: 24px;
  color: ${clPrimary};

  user-select: none;
`;

const StyledInput = styled(Input)`
  width: 270px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;

  &:focus {
    box-shadow: none !important;
  }

  ~ .ant-form-explain {
    padding-top: 0.8em;
    padding-bottom: 1.2em;
    font-size: 0.8em;
  }
`;

const StyledButton = styled(Button)`
  width: 270px;
  box-shadow: 0 4px 4px 0 rgba(129, 161, 208, 0.47);
  border-radius: 4px;
`;

const PosterBoard = styled.div`
  position: relative;
  width: 650px;
  background-image: url(${loginBG});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Logo = styled(SVG)`
  position: absolute;
  top: 34px;
  left: 28px;
  display: none;
`;

const Copyright = styled.div`
  margin-top: 3em;
  font-size: 0.8rem;
  color: #9aa3ac;
`;

@inject('authStore', 'commonStore')
@withRouter
@observer
class Login extends React.Component {
  handleEmailChange = e => this.props.authStore.setEmail(e.target.value);
  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);

  handleSubmit = e => {
    e.preventDefault();
    this.props.authStore.login();
  };

  render() {
    const { commonStore } = this.props.commonStore;
    const {
      inProgress,
      validateStatus,
      validateMsg,
      values,
    } = this.props.authStore;

    if (window.localStorage.getItem('token')) {
      return <Redirect to="/" />;
    } else {
      return (
        <Container>
          <BoardsContainer>
            <LoginBoard>
              <Title>电子相册系统</Title>
              <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                  <StyledInput
                    type="text"
                    value={values.email}
                    placeholder="用户名"
                    onChange={this.handleEmailChange}
                  />
                </Form.Item>

                <Form.Item validateStatus={validateStatus} help={validateMsg}>
                  <StyledInput
                    type="password"
                    value={values.password}
                    placeholder="密码"
                    onChange={this.handlePasswordChange}
                  />
                </Form.Item>

                <StyledButton
                  type="primary"
                  htmlType="submit"
                  disabled={inProgress}
                  loading={inProgress}
                >
                  登录
                </StyledButton>
              </Form>
            </LoginBoard>
            <PosterBoard>
              <Logo src={logo} />
            </PosterBoard>
          </BoardsContainer>


        </Container>
      );
    }
  }
}

export default Login;
