import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import promiseFinally from 'promise.prototype.finally';

import 'normalize.css';
import './index.css';

import registerServiceWorker from './registerServiceWorker';

import App from './components/App';

import authStore from './stores/authStore';
import commonStore from './stores/commonStore';
import userStore from './stores/userStore';
import channelStore from './stores/channelStore';
import articlesStore from './stores/articlesStore';
import editorStore from './stores/editorStore';
import articlesAutoStore from './stores/articlesAutoStore';
import infoStore from './stores/infoStore';
import albumStore from './stores/albumStore';
import videoStore from './stores/videoStore';

const stores = {
  authStore,
  commonStore,
  userStore,
  channelStore,
  articlesStore,
  editorStore,
  articlesAutoStore,
  infoStore,
  albumStore,
  videoStore,
};

// For easier debugging
window._____APP_STATE_____ = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render(
  <Provider {...stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
