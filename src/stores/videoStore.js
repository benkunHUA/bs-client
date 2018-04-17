import { observable, action } from 'mobx';
import axios from 'axios';
import { message } from 'antd';
import {API_URL} from '../constant';
import agent from '../agent';

class InfoStore {
  @observable videoVisible = false;
  @observable videoUrl = '';
  @observable videoList = [];

  @action
  loadVideo(){
    axios.get(`${API_URL}video/getVideoList?token=${window.localStorage.getItem('token')}`)
    .then(res => {
      console.log(res);
      this.setVideoList(res.data.resContent);
    })
  }

  uploadVideo(){
    axios({
      method: 'post',
      url:`${API_URL}album/cerateAlbum`,
      headers: {
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data: {
        userid: window.localStorage.getItem('token'),
        albumList: this.videoUrl,
        isVideo: 1,
        isShare: true
      }
    }).then((res)=>{
      message.success('上传成功')
      this.setVideoVisible(false);
    })
  }

  @action
  setVideoVisible(videoVisible){
    this.videoVisible = videoVisible;
  }

  @action
  setVideoUrl(videoUrl){
    this.videoUrl = videoUrl;
  }

  @action
  setVideoList(videoList){
    this.videoList = videoList;
  }

}

export default new InfoStore();
