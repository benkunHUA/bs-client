import React from 'react';
import { Route, Redirect } from 'react-router-dom';

class RedirectRoute extends React.Component {
  render() {
    const { to, ...rest } = this.props;

    return <Route {...rest} render={() => <Redirect to={to} />} />;
  }
}

export default RedirectRoute;
