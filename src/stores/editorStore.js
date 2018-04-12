import { observable, action, computed } from 'mobx';
import { message } from 'antd';

import agent from '../agent';
import articlesStore from './articlesStore';
import _ from 'lodash';

function channelIn(channel, subChannel) {
  return [channel, subChannel];
}

function channelOut(channelArray) {
  const [channel, subChannel] = channelArray;
  return {
    channel_id: channel,
    // backend doesn't handle this very well,
    // so I give it a default value which represents empty value
    sub_channel_id: subChannel || '',
  };
}

class EditorStore {
  @observable isProgress = false;
  @observable isEditing = false;
  @observable currentEditPanel = '';
  @observable render = 0;
  @observable id = 0;

  @observable temp = null;
  @observable tempCreating = false;
  @observable tempModalVisible = false;
  @computed
  get tempUrl() {
    if (!this.temp) return '';
    return `${window.location.origin}/preview/${this.temp.id}`;
  }
  /**
   * Why wrap value in an object ?
   * https://ant.design/components/form-cn/#components-form-demo-global-state
   * */
  @observable body = { value: '' };
  @observable title = { value: '' };
  @observable author = { value: '' };
  @observable summary = { value: '' };
  @observable channel = { value: [] };
  @observable status = { value: 0 };
  @observable tags = { value: [] };
  @observable recommend = { value: '' };
  @observable selected = { value: 0 };
  @observable thumbnailType = { value: 1 };
  @observable thumbnail = { value: [] };
  @observable renderImageCroper = 0;

  @action
  setProgress(status) {
    this.isProgress = status;
  }
  @action
  setEditing(status) {
    this.isEditing = status;
  }
  @action
  setCurrentEditPanel(selector) {
    this.currentEditPanel = selector;
  }

  @action
  setId(id) {
    this.id = id;
  }
  @action
  resetId(id) {
    this.id = 0;
  }

  @action
  forceRender() {
    this.render = Math.random();
  }

  @action
  setBody(body) {
    this.body.value = body;
  }
  @action
  resetBody() {
    this.body.value = '';
  }

  @action
  setTitle(title) {
    this.title.value = title;
  }
  @action
  resetTitle() {
    this.title.value = '';
  }

  @action
  setAuthor(author) {
    this.author.value = author;
  }
  @action
  resetAuthor() {
    this.author.value = '';
  }

  @action
  setSummary(summary) {
    this.summary.value = summary;
  }
  @action
  resetSummary() {
    this.summary.value = '';
  }

  @action
  setChannel(channel) {
    this.channel.value.length = 0;
    channel.forEach(i => {
      this.channel.value.push(i);
    });
  }
  @action
  resetChannel() {
    this.channel.value.length = 0;
  }

  @action
  setStatus(status) {
    this.status.value = status;
  }
  @action
  resetStatus() {
    this.status.value = 0;
  }

  @action
  setTags(tags) {
    this.tags.value.length = 0;
    if(null==tags||""==tags[0]){
      return;
    }
    tags.forEach(i => {
      this.tags.value.push(i);
    });
  }
  @action
  resetTags() {
    this.tags.value.length = 0;
  }

  @action
  setRecommend(recommend) {
    this.recommend.value = recommend;
  }
  @action
  resetRecommend() {
    this.recommend.value = '';
  }

  @action
  setSelected(selected) {
    this.selected.value = Number.parseInt(selected, 10);
  }
  @action
  resetSelecetd() {
    this.selected.value = 0;
  }

  @action
  setThumbnailType(type) {
    this.thumbnailType.value = Number.parseInt(type, 10);
  }
  @action
  resetThumbnailType() {
    this.thumbnailType.value = 1;
  }

  @action
  setThumbnail(thumbnails) {
    this.thumbnail.value.length = 0;
    thumbnails.forEach(i => {
      this.thumbnail.value.push(i);
    });
  }
  @action
  addThumbnail(thumbnail) {
    this.thumbnail.value.push(thumbnail);
  }
  @action
  removeThumbnail(thumbnail) {
    _.remove(this.thumbnail.value, i => i === thumbnail);
  }
  @action
  resetThumbnail() {
    this.thumbnail.value.length = 0;
  }
  @action
  shortenThumbnail(length) {
    this.thumbnail.value.length = length;
  }

  @action
  forceRenderImageCroper() {
    this.renderImageCroper = Math.random();
  }

  @action
  setTemp(temp) {
    this.temp = temp;
  }
  @action
  setTempCreating(creating) {
    this.tempCreating = creating;
  }
  @action
  resetTemp(temp) {
    this.temp = null;
  }

  @action
  reset() {
    this.resetId();
    this.resetBody();
    this.resetTitle();
    this.resetAuthor();
    this.resetSummary();
    this.resetChannel();
    this.resetStatus();
    this.resetTags();
    this.resetRecommend();
    this.resetSelecetd();
    this.resetThumbnailType();
    this.resetThumbnail();
    this.resetTemp();
  }

  @action
  load(id) {
    this.setId(id);

    const article = { id };
    return agent.Articles.readOne(article)
      .then(response => {
        response = response.Article;
        this.setBody(response.content||'');
        this.setTitle(response.title||'');
        this.setAuthor(response.author||'');
        this.setSummary(response.summary||'');
        const { channel_id: channel, sub_channel_id: subChannel } = response;
        this.setChannel(channelIn(channel, subChannel));
        this.setStatus(response.status);
        this.setTags(response.tags);

        this.setRecommend(response.recommend);
        this.setSelected(response.selected);
        this.setThumbnailType(response.thumbnail_type);
        this.setThumbnail(response.thumbnail);

        this.forceRender();
      })
      .catch(e => {
        console.error(e);
        message.error('加载失败');
      });
  }

  @action
  update() {
    this.setProgress(true);

    const article = {
      id: this.id,
      content: this.body.value,
      title: this.title.value,
      author: this.author.value,
      summary: this.summary.value,
      ...channelOut(this.channel.value.toJS()),
      status: this.status.value,
      tags: this.tags.value.toJS(),
      recommend: this.recommend.value,
      selected: this.selected.value,
      thumbnail_type: this.thumbnailType.value,
      thumbnail: this.thumbnail.value,
    };

    return agent.Articles.updateOne(article)
      .then(() => articlesStore.loadArticles())
      .then(() => message.success('更新成功'))
      .catch(() => message.error('更新失败'))
      .finally(() => this.setProgress(false));
  }

  @action
  publish() {
    this.setProgress(true);
    const article = {
      content: this.body.value,
      title: this.title.value,
      author: this.author.value,
      summary: this.summary.value,
      ...channelOut(this.channel.value.toJS()),
      status: 1,
      tags: this.tags.value,
      recommend: this.recommend.value,
      selected: this.selected.value,
      thumbnail_type: this.thumbnailType.value,
      thumbnail: this.thumbnail.value,
      original: 1,
    };

    return agent.Articles.createOne(article)
      .then(() => articlesStore.loadArticles())
      .then(() => message.success('发布成功'))
      .catch(() => message.error('发布失败'))
      .finally(() => this.setProgress(false));
  }

  @action
  saveAsDraft() {
    this.setProgress(true);

    const article = {
      content: this.body.value,
      title: this.title.value,
      author: this.author.value,
      summary: this.summary.value,
      ...channelOut(this.channel.value.toJS()),
      status: 2,
      tags: this.tags.value,
      recommend: this.recommend.value,
      // 存为草稿时，不能成为精选。
      selected: 0,
      thumbnail_type: this.thumbnailType.value,
      thumbnail: this.thumbnail.value,
      original: 1,
    };

    return agent.Articles.createOne(article)
      .then(() => articlesStore.loadArticles())
      .then(() => message.success('存为草稿成功'))
      .catch(() => message.error('存为草稿失败'))
      .finally(() => this.setProgress(false));
  }

  @action
  createTemp() {
    this.setTempCreating(true);

    const article = {
      content: this.body.value,
      title: this.title.value,
      author: this.author.value,
      summary: this.summary.value,
      ...channelOut(this.channel.value.toJS()),
      tags: this.tags.value,
      recommend: this.recommend.value,
      selected: this.selected.value,
      thumbnail_type: this.thumbnailType.value,
      thumbnail: this.thumbnail.value,
    };

    return agent.Articles.createTemp(article)
      .then(
        data => {
          this.setTemp(data);
          this.setTempCreating(false);
        },
        e => {
          message.error('生成临时文章失败');
        }
      )
      .finally(() => this.setProgress(false));
  }

  @action
  readTemp(tempId) {
    return agent.Articles.readTemp({ id: tempId })
      .then(
        data => {
          this.setTemp(data);
        },
        () => message.error('读取临时文章失败')
      )
      .finally(() => this.setProgress(false));
  }
}

export default new EditorStore();
