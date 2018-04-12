import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import agent from '../agent';
import { readableTime } from '../helper';

class ArticlesStore {
  @observable isLoading = false;
  @observable isProgress = false;
  @observable limit = 10;
  @observable totalPagesCount = 1;
  @observable articles = [];
  @observable total = 0;
  @observable currentPage = 1;
  @observable currentSelected = 0;
  @observable currentChannel = -1;
  @observable currentSubChannel = -2;
  @observable currentStatus = 1;
  @observable currentSearchType = 1;
  @observable currentSearchContent = '';
  @observable original = 0;

  @computed
  get isExhausted() {
    return this.articles.length < this.limit;
  }

  // running before loadArticles
  @action
  enableLoading() {
    this.isLoading = true;
  }
  @action
  disableLoading() {
    this.isLoading = false;
  }
  @action
  setProgress(status) {
    this.isProgress = status;
  }
  @action
  setCurrentPage(page) {
    this.currentPage = page;
  }
  @action
  setCurrentSelected(selected) {
    this.currentSelected = selected;
  }
  @action
  setCurrentChannel(channel) {
    this.currentChannel = channel;
    this.resetPagination();
    this.loadArticles();
  }
  @action
  setCurrentSubChannel(channel) {
    this.currentSubChannel = channel;
    this.resetPagination();
    this.loadArticles();
  }
  @action
  setCurrentStatus(status) {
    this.currentStatus = Number.parseInt(status, 10);
    this.resetPagination();
    this.loadArticles();
  }
  @action
  setCurrentSearchTypeAsTitle() {
    this.currentSearchType = 1;
  }
  @action
  setCurrentSearchTypeAsID() {
    this.currentSearchType = 2;
  }
  @action
  setCurrentSearchContent(content) {
    this.currentSearchContent = content;
  }

  @action
  resetSearch() {
    this.currentSearchType = 1;
    this.currentSearchContent = '';
  }

  @action
  resetPagination() {
    this.articles.length = 0;
    this.totalPagesCount = 1;
    this.currentPage = 1;
  }

  @action
  reset() {
    this.articles.length = 0;
    this.totalPagesCount = 1;
    this.currentPage = 1;
    this.currentSelected = 0;
    this.currentChannel = -1;
    this.currentSubChannel = -2;
    this.currentStatus = 1;
    this.resetSearch();
  }

  @action
  loadArticles() {
    this.enableLoading();
    const req =
      this.currentStatus === 1
      ?agent.Articles.findAllAuto
      :agent.Articles.findAutoNoSelect

    let channel = undefined;
    if (this.currentChannel !== -1) {
      channel = this.currentChannel;
    }

    let subChannel = undefined;
    if(this.currentSubChannel != -2) {
      subChannel = this.currentSubChannel;
    }

    let id;
    if (this.currentSearchType === 2 && this.currentSearchContent !== '') {
      id = this.currentSearchContent;
    }

    let title;
    if (this.currentSearchType === 1 && this.currentSearchContent !== '') {
      title = this.currentSearchContent;
    }

    return req(
      this.currentPage,
      this.limit,
      channel,
      subChannel,
      this.currentStatus,
      id,
      title
    )
      .then(
        action(({ list, count }) => {
          list.forEach(item => {
            item.create_time = readableTime(item.create_time);
            item.update_time = readableTime(item.update_time);
            item.selected_time = readableTime(item.selected_time);
            item.first_release_time = readableTime(item.first_release_time);
          });

          this.articles = list;
          this.total = count;
        })
      )
      .finally(() => this.disableLoading());
  }

  @action
  setSelected(article) {
    this.setProgress(true);
    return agent.Articles.setSelected(article)
      .then(() => this.loadArticles())
      .then(() => message.success('加入精选成功'))
      .catch(() => message.error('加入精选失败'))
      .finally(() => this.setProgress(false));
  }

  @action
  cancelSelected(article) {
    this.setProgress(true);
    return agent.Articles.cancelSelected(article)
      .then(() => this.loadArticles())
      .then(() => message.success('取消精选成功'))
      .catch(() => message.error('取消精选失败'))
      .finally(() => this.setProgress(false));
  }

  @action
  setStatusAsPublished(article) {
    this.setProgress(true);
    return agent.Articles.setStatusAsPublished(article)
      .then(() => this.loadArticles())
      .then(() => message.success('发布成功'))
      .catch(() => message.error('发布失败'))
      .finally(() => this.setProgress(false));
  }

  @action
  setStatusAsPullOffed(article) {
    this.setProgress(true);
    return agent.Articles.setStatusAsPullOffed(article)
      .then(() => this.loadArticles())
      .then(() => message.success('下架成功'))
      .catch(() => message.error('下架失败'))
      .finally(() => this.setProgress(false));
  }

  @action
  findAndDeleteOne(article) {
    const id = article.id;

    this.articles.forEach((article, index) => {
      if (article.id === id) {
        this.articles.splice(index, 1);
      }
    });
  }

  @action
  deleteOne(article) {
    this.setProgress(true);
    return agent.Articles.deleteOne(article)
      .then(() => this.findAndDeleteOne(article))
      .then(() => this.loadArticles())
      .then(() => message.success('删除成功'))
      .catch(() => message.error('删除失败'))
      .finally(() => this.setProgress(false));
  }

  @action
  setStickPosition(article, position) {
    this.setProgress(true);
    return agent.Articles.setStickPosition(article, position)
      .then(() => this.loadArticles())
      .then(() => message.success('置顶成功'))
      .catch(() => message.error('置顶失败'))
      .finally(() => this.setProgress(false));
  }

  @action
  swapStickPosition(index1, index2) {
    const article1 = this.articles[index1];
    const article2 = this.articles[index2];

    if (article1 && article2) {
      const sp1 = article1.stick_position;
      const sp2 = article2.stick_position;

      return agent.Articles.setStickPosition(article1, sp2)
        .then(() => agent.Articles.setStickPosition(article2, sp1))
        .then(() => this.loadArticles())
        .then(() => message.success('移动成功'))
        .catch(() => message.error('移动失败'));
    } else {
      return Promise.resolve();
    }
  }
}

export default new ArticlesStore();
