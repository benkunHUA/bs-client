import React, { Component } from 'react';
import ReactSummernote from './editor.jsx';
import 'summernote/lang/summernote-zh-CN';

import 'bootstrap/js/src/modal';
import 'bootstrap/js/src/dropdown';
import 'bootstrap/js/src/tooltip';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import 'codemirror/lib/codemirror.css';

import 'codemirror/lib/codemirror';
import 'codemirror/mode/xml/xml';

import { wrapImage } from './summernote-plugin-image-footnote';
import { upload } from '../../agent';
import $ from 'jquery';

// 添加翻译
$(() => {
  $.extend($.summernote.lang['zh-CN'].table, {
    table: '表格',
    addRowAbove: '向上添加一行',
    addRowBelow: '向下添加一行',
    addColLeft: '向左添加一列',
    addColRight: '向右添加一列',
    delRow: '删除行',
    delCol: '删除列',
    delTable: '删除表格',
  });
});

class RichTextEditor extends Component {
  onChange = content => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(content);
    }
  };

  onImageUpload = files => {
    upload(files[0]).then(data => {
      const img = document.createElement('img');
      img.src = `https://${data.Location}`;
      img.style.width = '100%';

      const figure = wrapImage(img);

      ReactSummernote.insertNode(figure);
    });
  };

  onInit = ({ editor }) => {
    editor
      .parent()
      .find('.note-current-color-button')
      .addClass('dropdown-toggle')
      .attr('data-toggle', 'dropdown');

    editor
      .parent()
      .find('.note-color > .note-btn')
      .not('.note-current-color-button')
      .remove();
  };

  render() {
    return (
      <ReactSummernote
        value={this.props.value}
        options={{
          lang: 'zh-CN',
          height: 400,
          dialogsInBody: true,
          shortcuts: false,
          codemirror: {
            mode: 'text/html',
            htmlMode: true,
            lineNumbers: true,
          },
          popover: {
            image: [
              ['footnote', ['imageFootnote']],
              ['imagesizeX', ['imagesize100X', 'imagesize50X', 'imagesize25X']],
              ['floatX', ['floatLeftX', 'floatRightX', 'floatNoneX']],
              ['remove', ['removeMediaX']],
            ],
          },
          toolbar: [
            [
              'style',
              [
                'style',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'clear',
              ],
            ],
            [
              'fontsize',
              ['fontsize', 'foregroundColorX', 'backgroundColorX', 'height'],
            ],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['link', 'picture', 'video']],
            ['table', ['table']],
            ['view', ['codeview', 'undo', 'redo']],
          ],
        }}
        onInit={this.onInit}
        onChange={this.onChange}
        onImageUpload={this.onImageUpload}
      />
    );
  }
}

export default RichTextEditor;
