import { observable, action } from 'mobx';
import axios from 'axios';
import {API_URL} from '../constant';
import agent from '../agent';

class InfoStore {
  @observable infoList = [];
  
  @action
  loadInfo(){
    axios.get(`${API_URL}info/getInfoList`)
    .then(res => {
      res.data.resContent.map(item => {
        item.ALBUM = JSON.parse(item.ALBUM);
      });
      this.setInfoList(res.data.resContent);
    })
  }

  @action
  setInfoList(infoList){
    this.infoList = infoList;
  }

}

export default new InfoStore();
