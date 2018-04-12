import React from 'react';
import { inject, observer } from 'mobx-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Board from '../Board';
import Spinner from '../Spinner';
import Pagination from '../Pagination';

import ChannelSelector from './ChannelSelector';
import { Header, Item as ArticleItemSelected } from './ArticleItemSelected';
import NoMoreArticle from './NoMoreArticle';

// using some little inline style helpers to make it looks good
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  boxShadow: isDragging ? '0 1px 3px rgba(0,0,0,.3)' : 'none',

  // styles we need to apply on draggables
  ...draggableStyle,
});

@inject('articlesAutoStore')
@observer
class ArticlesSelected extends React.Component {
  componentDidMount() {
    this.props.articlesAutoStore.reset();
    this.props.articlesAutoStore.setCurrentSelected(1);
    this.props.articlesAutoStore.loadArticles();
  }

  handleSetCurrentPage = page => {
    this.props.articlesAutoStore.setCurrentPage(page);
    this.props.articlesAutoStore.loadArticles();
  };

  handleDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sp1 = result.source.index;
    const sp2 = result.destination.index;

    this.props.articlesAutoStore.swapStickPosition(sp1, sp2);
    this.props.articlesAutoStore.loadArticles();
  };

  render() {
    const {
      isLoading,
      articles,
      currentPage,
      total,
      isExhausted,
    } = this.props.articlesAutoStore;

    return (
      <Board>
        <ChannelSelector />

        {isLoading && <Spinner />}

        <Header />

        {/* show all the stick item */}
        <DragDropContext onDragEnd={this.handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                {articles.map((article, index) => (
                  <Draggable
                    key={article.id}
                    draggableId={article.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div>
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {article.stick_position <= 5 &&
                            article.stick_position >= 1 && (
                              <ArticleItemSelected
                                key={article.id}
                                article={article}
                                dragHandle={provided.dragHandleProps}
                              />
                            )}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* show all the non-stick item */}
        {articles.map(article => {
          if (article.stick_position > 5 || article.stick_position < 1) {
            return <ArticleItemSelected key={article.id} article={article} />;
          } else {
            return null;
          }
        })}

        {!isLoading && isExhausted && <NoMoreArticle />}

        <Pagination
          showQuickJumper
          current={currentPage}
          total={total}
          onChange={this.handleSetCurrentPage}
        />
      </Board>
    );
  }
}

export default ArticlesSelected;
