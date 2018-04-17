import { observable, action } from 'mobx';
import axios from 'axios';
import {API_URL} from '../constant';
import agent from '../agent';

class InfoStore {
  @observable infoList = [];
  @observable currentPreview = '';

  @action
  loadInfo(){
    axios.get(`${API_URL}info/getInfoList`)
    .then(res => {
      res.data.resContent.map(item => {
        if(item.ALBUMLIST.indexOf("uploads") != -1){
          item.ALBUMLIST = JSON.parse(item.ALBUMLIST);
        }
        var time = new Date(item.TIME);
        item.TIME = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}
                    ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      });
      this.setInfoList(res.data.resContent);
    })
  }

  @action
  setInfoList(infoList){
    this.infoList = infoList;
  }

  @action
  setCurrentPreview(currentPreview){
    this.currentPreview = currentPreview;
  }

}

export default new InfoStore();
