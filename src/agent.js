import 'whatwg-fetch';
import queryString from 'query-string';
import COS from 'cos-js-sdk-v5';
import $ from 'jquery';
import uuid from 'uuid/v4';

import { Bucket, Region } from './constant';
import commonStore from './stores/commonStore';
import authStore from './stores/authStore';

let API_BASE_URL = process.env.API_BASE_URL;
const hostName = window.location.hostname;
// '111.231.54.144' === hostName
//   ?API_BASE_URL = 'http://111.231.54.144:8083'
//   :API_BASE_URL = 'http://118.25.39.191:8083';
const API_ROOT_ADMIN = `${API_BASE_URL}`;
// const API_ROOT_ADMIN = `./assets/data/`;
const API_ROOT_COMMON = `${API_BASE_URL}/api/common`;
const API_ROOT_CHANNEL = `${API_BASE_URL}/api/channel`;

function genHeaders() {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  if (commonStore.token) {
    headers.append('Token', commonStore.token);
  }

  return headers;
}

const checkAuth = response => {
  if (response.status === 401) {
    authStore.logout();
  }

  return response;
};

const checkSuccess = responseJSON => {
  if (responseJSON.success === false) {
    throw new Error(responseJSON.msg);
  }

  return responseJSON;
};

const toJSON = response => response.json();
const extractData = response => response.data;
const convertDirtyData = data => {
  if (data) {
    const { Article, ArticleDetail } = data;
    if (Article && ArticleDetail) {
      data = Object.assign(Article, ArticleDetail);
    }

    if (data.channel_id) {
      data.channel_id = Number.parseInt(data.channel_id, 10);
    }

    if (data.sub_channel_id) {
      data.sub_channel_id = Number.parseInt(data.sub_channel_id, 10);
    }
  }

  return data;
};

const requests = {
  get: function(url) {
    return fetch(`${API_ROOT_ADMIN}${url}`, {
      method: 'GET',
    })
      .then(checkAuth)
      .then(checkSuccess)
      .then(extractData)
      .then(convertDirtyData);
  },
  channelGet: function(url) {
    return fetch(`${API_ROOT_CHANNEL}${url}`, {
      method: 'GET',
      headers: genHeaders(),
    })
      .then(checkAuth)
      .then(toJSON)
      .then(checkSuccess)
      .then(extractData)
      .then(convertDirtyData);
  },
  post: function(url, body) {
    return fetch(`${API_ROOT_ADMIN}${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
      .then(checkAuth)
      .then(toJSON)
      .then(checkSuccess)
      .then(extractData)
      .then(convertDirtyData);
  },
  channelPost: function(url, body) {
    return fetch(`${API_ROOT_CHANNEL}${url}`, {
      method: 'POST',
      headers: genHeaders(),
      body: JSON.stringify(body),
    })
      .then(checkAuth)
      .then(toJSON)
      .then(checkSuccess)
      .then(extractData)
      .then(convertDirtyData);
  },
  patch: function(url, body) {
    return fetch(`${API_ROOT_ADMIN}${url}`, {
      method: 'PATCH',
      headers: genHeaders(),
      body: JSON.stringify(body),
    })
      .then(checkAuth)
      .then(toJSON)
      .then(checkSuccess)
      .then(extractData)
      .then(convertDirtyData);
  },
  del: function(url) {
    return fetch(`${API_ROOT_ADMIN}${url}`, {
      method: 'DELETE',
      headers: genHeaders(),
    })
      .then(checkAuth)
      .then(toJSON)
      .then(checkSuccess)
      .then(extractData)
      .then(convertDirtyData);
  },
};
const info = {
    loadInfo() {
      return requests.get('/infoList.json');
    },
};

const Auth = {
  current() {
    return requests.get('/me');
  },

  login(email, password) {
    return requests.get(`/login?email=${email}&password=${password}`);
  },
};

const Channels = {
  index() {
    return requests.channelGet('/getAllChannels');
  },
  addChannels(channel) {
    return requests.channelPost('/addChannel',channel);
  },
  deleteChannel(id) {
    return requests.channelGet(`/deleteFirstLevelChannel?id=${id}`);
  },
  editChannels(channel) {
    return requests.channelPost('/editChannel',channel);
  },
  displayCannel(display,id) {
    return requests.channelPost(`/changeChannelDisplay`,{
      display: display,
      channel_id: id
    });
  }
};


export function upload(file, filename) {
  if (!file) {
    return Promise.resolve();
  }

  return new Promise(function(resolve, reject) {
    const cos = new COS({
      getAuthorization: function(options, callback) {
        $.ajaxSetup({
          headers: {
            token: commonStore.token,
          },
        });

        $.get(
          `${API_ROOT_COMMON}/upload_auth`,
          {
            method: (options.Method || 'GET').toUpperCase(),
            file: '/' + (options.Key || ''),
          },
          function(authorization) {
            callback(authorization);
          },
          'text'
        );
      },
    });

    cos.sliceUploadFile(
      {
        Bucket: Bucket,
        Region: Region,
        Key: filename || `${uuid()}-${file.name}`,
        Body: file,
      },
      function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
}

export default {
  Auth,
  Channels,
  upload,
  info,
};
