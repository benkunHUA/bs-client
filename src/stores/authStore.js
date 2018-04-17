import { observable, action } from 'mobx';
import axios from 'axios';
import {API_URL} from '../constant';
import userStore from './userStore';
import channelStore from './channelStore';
import commonStore from './commonStore';

class AuthStore {
  @observable inProgress = false;
  @observable validateStatus = '';
  @observable validateMsg = '';
  @observable
  values = {
    email: '',
    password: '',
  };

  @action
  setProgress(status) {
    this.inProgress = status;
  }

  @action
  setEmail(email) {
    this.values.email = email;
  }

  @action
  setPassword(password) {
    this.values.password = password;
  }

  @action
  reset() {
    this.validateStatus = '';
    this.validateMsg = '';
    this.values.email = '';
    this.values.password = '';
  }

  @action
  login() {
    this.setProgress(true);
    axios.get(`${API_URL}login?email=${this.values.email}&password=${this.values.password}`)
    .then(res => {
      window.localStorage.setItem('token',res.data.resContent.USERID);
      window.localStorage.setItem('nickname',res.data.resContent.NICKNAME);
      window.localStorage.setItem('headImg',res.data.resContent.HEADIMG);
      window.location.href="message";
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      this.setProgress(false);
    });
  }

  @action
  logout() {
    localStorage.removeItem('token');
    window.location.href = 'login';
  }
}

export default new AuthStore();
