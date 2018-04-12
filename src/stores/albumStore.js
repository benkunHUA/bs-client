import { observable, action } from 'mobx';
import axios from 'axios';
import {API_URL,token} from '../constant';

class albumStore {
  @observable createShow = false;
  @observable uploadShow = false;
  @observable albumTitle = '';
  @observable albumSummary = '';
  @observable albumList = [];

  @action
  loadAlbums(){
    axios.get(`${API_URL}album/getAlbumList?token=${token}`)
    .then(res => {
      res.data.resContent.map(item => {
        if(null != item.ALBUMLIST){
          item.ALBUMLIST = JSON.parse(item.ALBUMLIST);
        }
      });
      this.setAlbumList(res.data.resContent);
      console.log(this.albumList);
    })
  }

  @action
  setCreateShow(createShow){
    this.createShow = createShow;
  }

  @action
  setUploadShow(uploadShow){
    this.uploadShow = uploadShow;
  }

  @action
  setAlbumTitle(title){
    this.albumTitle = title;
  }

  @action
  setAlbumSummary(summary){
    this.albumSummary = summary;
  }

  @action
  setAlbumList(albumList){
    this.albumList = albumList;
  }

  @action
  setUploadShow(uploadShow){
    this.uploadShow = uploadShow;
  }

  @action
  handleCreate = () =>{
    axios({
      method: 'post',
      url:`${API_URL}album/cerateAlbum`,
      headers: {
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data: {
        userid: window.localStorage.getItem('token'),
        title: this.albumTitle,
        summary: this.albumSummary,
      }
    }).then((res)=>{
      this.setCreateShow(false);
      this.loadAlbums();
    })
  }

  @action
  handleCancel = () => {
    this.setCreateShow(false);
  }

}

export default new albumStore();
