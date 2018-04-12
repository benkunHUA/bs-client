import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { readableTime } from '../helper';

import { Icon } from 'antd';
import QRCode from 'qrcode.react';

import Header from './Header';
import iconQuote from '../assets/quote.svg';

const rem = px => `${px / 16}rem`;

const Container = styled.div`
  width: 100%;
`;

const Main = styled.div`
  max-width: 672px;
  box-sizing: content-box;
  padding: ${rem(18)};
  margin: auto;
  color: #4a4a4a;
  font-size: ${rem(14)};
`;

const Title = styled.div`
  max-width: 634px;
  font-size: ${rem(28)};
  color: #333;
  letter-spacing: 0;
  line-height: ${rem(42)};
  margin-bottom: ${rem(25)};
`;

const Meta = styled.div`
  color: #999;
  letter-spacing: 0;
  line-height: ${rem(14)};
  margin-bottom: ${rem(24)};
  > span {
    display: inline-block;
    margin-right: ${rem(10)};
  }
`;
const Divider = styled.span`
  display: inline-block;
  margin: 0 4px;
  height: 0.9em;
  width: 1px;
  vertical-align: middle;
  background: #e8e8e8;
`;

const Recommend = styled.span`
  padding: 1px;
  background: #f4f9ff;
  border: 1px solid #94c1fa;
  font-size: ${rem(12)};
  color: #287ddc;
  line-height: ${rem(12)};
`;

const Quote = styled.div`
  color: #999;
  line-height: ${rem(21)};
  position: relative;
  padding: ${rem(10)} ${rem(46)};
  margin: ${rem(40)} auto;
  &:before, &:after {
    content: '';
    display: inline-block;
    position: absolute;
    background: url('${iconQuote}') center/contain no-repeat;
    height: ${rem(24)};
    width: ${rem(24)};
  }
  &:before {
    left: 0;
    top: 0;
  }
  &:after {
    right: 0;
    bottom: 0;
    transform: rotate(-180deg);
  }
`;

const Content = styled.div`
  font-size: ${rem(16)};
  color: #4a4a4a;
  line-height: ${rem(28)};
  margin: ${rem(24)} auto;
`;
const Footer = styled.div`
  padding-top: ${rem(24)};
  padding-bottom: ${rem(24)};
  clear: both;
`;
const IconTag = styled(Icon)`
  transform: rotate(90deg);
  color: #287ddc;
  margin-right: ${rem(10)};
  font-size: ${rem(16)};
`;
const TagGroup = styled.span`
  display: inline-block;
`;
const Tag = styled.span`
  display: inline-block;
  padding: ${rem(4)} ${rem(8)};
  margin: auto ${rem(4)};
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 2px;
  font-size: ${rem(12)};
  color: #666;
`;

const QRContainer = styled.div`
  position: sticky;
  width: 100%;
  max-width: 672px;
  margin: auto;
  top: 0;
  @media (max-width: 1024px) {
    & {
      display: none;
    }
  }
}
`;
const QRCard = styled.div`
  display: inline-block;
  position: absolute;
  top: 30px;
  right: -${170 + 30}px;
  padding: ${rem(25)};
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 2px;
`;
const QRInfo = styled.div`
  font-size: ${rem(14)};
  color: #666;
  line-height: ${rem(21)};
  text-align: center;
  margin-top: ${rem(10)};
`;

@inject('editorStore', 'userStore')
@withRouter
@observer
class Preview extends React.Component {
  componentWillMount() {
    const { editorStore } = this.props;

    editorStore.setEditing(true);

    const { params: { tempId } } = this.props.match;
    editorStore.readTemp(tempId);
  }

  render() {
    const { temp, tempUrl } = this.props.editorStore;
    const { currentUser } = this.props.userStore;
    if (!temp) return null;

    const {
      title,
      recommend,
      author,
      create_time,
      first_release_time,
      summary,
      content,
      tags,
    } = temp;
    return (
      <Container>
        {currentUser ? <Header /> : null}

        <QRContainer>
          <QRCard>
            <QRCode size={120} value={tempUrl} />
            <QRInfo>
              扫描二维码<br />
              可手机端预览
            </QRInfo>
          </QRCard>
        </QRContainer>

        <Main>
          <Title>{title}</Title>
          <Meta>
            {recommend ? <Recommend>{recommend}</Recommend> : null}
            {author ? <span>{author}</span> : null}
            {author ? <Divider /> : null}
            <span>{readableTime(first_release_time || create_time)}</span>
          </Meta>
          {summary ? <Quote>{summary}</Quote> : null}
          <Content
            className="article-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <Footer>
            <IconTag type="tag" />
            <TagGroup>
              {(tags || []).map((tag, index) => <Tag key={index}>{tag}</Tag>)}
            </TagGroup>
          </Footer>
        </Main>
      </Container>
    );
  }
}

export default Preview;
