import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import PrivateRoute from './Route/PrivateRoute';

import Login from './Login';
import Preview from './Preview';
import ConsoleBoard from './ConsoleBoard';
import { SpinnerFullScreen } from './Spinner';

moment.locale('zh-cn');

@withRouter
@inject('commonStore', 'userStore', 'channelStore')
@observer
class App extends React.Component {
  componentWillMount() {
    const { commonStore } = this.props;

    if (!commonStore.token) {
      commonStore.setAppLoaded();
    }
  }

  componentDidMount() {
    const { commonStore, userStore, channelStore } = this.props;

    if (commonStore.token) {
      userStore
        .pullUser()
        .then(() => channelStore.pullChannels())
        .finally(() => {
          commonStore.setAppLoaded();
        });
    }
  }

  render() {
    const { commonStore } = this.props;

    if (commonStore.appLoaded) {
      return (
        <LocaleProvider locale={zhCN}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/preview/:tempId" component={Preview} />
            <PrivateRoute path="/" component={ConsoleBoard} />
          </Switch>
        </LocaleProvider>
      );
    } else {
      return <SpinnerFullScreen />;
    }
  }
}

export default App;
