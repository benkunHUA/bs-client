import { observable, action } from 'mobx';
import axios from 'axios';
import { message } from 'antd';
import {API_URL,token} from '../constant';

class albumStore {
  @observable createShow = false;
  @observable uploadShow = false;
  @observable albumTitle = '';
  @observable albumSummary = '';
  @observable albumList = [];
  @observable albumId = 0;
  @observable multipleProgress = 0;
  @observable uploadList = [];
  @observable isShare = false;

  @action
  loadAlbums(){
    axios.get(`${API_URL}album/getAlbumList?token=${window.localStorage.getItem('token')}`)
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
  setAlbumId(albumId){
    this.albumId = albumId;
  }

  @action
  addMultipleProgress(){
    this.multipleProgress++;
  }

  @action
  resetMultipleProgress(){
    this.multipleProgress = 0;
    this.uploadList = [];
  }

  @action
  addUploadList(uploadList){
    this.uploadList.push(uploadList);
  }

  @action
  setIsShare(isShare){
    this.isShare = isShare;
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
      this.resetMultipleProgress();
      message.success('创建成功')
      this.setCreateShow(false);
      this.loadAlbums();
    })
  }

  @action
  uploadAlbumPic = () =>{
    axios({
      method: 'post',
      url:`${API_URL}album/uploadAlbumPic`,
      headers: {
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data: JSON.stringify({
        userId: window.localStorage.getItem('token'),
        albumId: this.albumId,
        uploadList: this.uploadList,
        isShare: this.isShare
      })
    }).then((res)=>{
      message.success('上传成功')
      this.setUploadShow(false);
      this.loadAlbums();
    })
  }

  @action
  handleCancel = () => {
    this.setCreateShow(false);
  }

  @action
  closeUpload = () => {
    this.setUploadShow(false);
  }

}

export default new albumStore();
