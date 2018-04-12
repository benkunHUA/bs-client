import React from 'react';
import { inject, observer } from 'mobx-react';

import Board from '../Board';
import Pagination from '../Pagination';
import Spinner from '../Spinner';

import ChannelSelector from './ChannelSelector';
import StatusSelector from './StatusSelector';
import ArticleItem from './ArticleItem';
import NoMoreArticle from './NoMoreArticle';

@inject('articlesAutoStore')
@observer
class Articles extends React.Component {
  componentDidMount() {
    this.props.articlesAutoStore.reset();
    this.props.articlesAutoStore.setCurrentSelected(0);
    this.props.articlesAutoStore.loadArticles();
  }

  handleSetCurrentPage = page => {
    this.props.articlesAutoStore.setCurrentPage(page);
    this.props.articlesAutoStore.loadArticles();
  };

  render() {
    const { articlesAutoStore } = this.props;

    return (
      <Board>
        <ChannelSelector />
        <StatusSelector />
        {articlesAutoStore.isLoading && <Spinner />}

        {articlesAutoStore.articles.map(
          article =>
            article.status === articlesAutoStore.currentStatus && (
              <ArticleItem key={article.id} article={article} />
            )
        )}

        {!articlesAutoStore.isLoading &&
          articlesAutoStore.isExhausted && <NoMoreArticle />}

        <Pagination
          showQuickJumper
          current={articlesAutoStore.currentPage}
          total={articlesAutoStore.total}
          onChange={this.handleSetCurrentPage}
        />
      </Board>
    );
  }
}

export default Articles;
