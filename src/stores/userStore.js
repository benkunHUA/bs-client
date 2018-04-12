import { observable, action } from 'mobx';
import agent from '../agent';

class UserStore {
  @observable currentUser = '';

  @action
  pullUser() {
    this.loadingUser = true;
    return agent.Auth.current().then(userData => {
      if (userData) {
        const { nickname } = userData;
        this.setCurrentUser(nickname);
      }
    });
  }

  @action
  setCurrentUser(nickname) {
    this.currentUser = nickname;
  }

  @action
  forgetUser() {
    this.currentUser = undefined;
  }
}

export default new UserStore();
