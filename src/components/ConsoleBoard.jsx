import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import RedirectRoute from './Route/RedirectRoute';
import Header from './Header';
import ArticleEditor from './ArticleEditor';
import ConsoleNav from './ConsoleNav';

import bgtop from '../assets/bg_top.jpg';

class Console extends React.Component {
  render() {
    const Container = styled.div`
      width: 75%;
      margin: 0 auto;
      background-image: url(${bgtop});
      background-size: 100%;
      background-repeat: no-repeat;
    `;

    return (
      <Container>
        <Header />

        <Switch>
          <RedirectRoute exact path="/" to="/message" />
          <Route path="/articles/new" component={ArticleEditor} />
          <Route path="/articles/:id/edit" component={ArticleEditor} />
          <Route path="/articles/:id/auto" component={ArticleEditor} />
          <Route component={ConsoleNav} />
        </Switch>
      </Container>
    );
  }
}

export default Console;
