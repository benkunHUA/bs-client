import { observable, action, reaction } from 'mobx';

const key = 'token';

class CommonStore {
  @observable token;
  @observable nickname = '';
  @observable headImg = '';

  @action
  setToken(token) {
    window.localStorage.setItem(key,token);
    this.token = token;
  }

  @action
  setNickname(nickname) {
    this.nickname = nickname;
  }

  @action
  setHeadImg(headImg) {
    this.headImg = headImg;
  }

  @action
  setAppLoaded() {
    this.appLoaded = true;
  }
}

export default new CommonStore();
