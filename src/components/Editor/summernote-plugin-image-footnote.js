import $ from 'jquery';
import cssToObject from 'css-to-object';

const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path d="M 8.781,11.11 7,11.469 7.3595,9.688 8.781,11.11 Z M 7.713,9.334 9.135,10.7565 13,6.8915 11.5775,5.469 7.713,9.334 Z M 6.258,9.5 8.513,7.12 7.5,5.5 6.24,7.5 5,6.52 3,9.5 6.258,9.5 Z M 4.5,5.25 C 4.5,4.836 4.164,4.5 3.75,4.5 3.336,4.5 3,4.836 3,5.25 3,5.6645 3.336,6 3.75,6 4.164,6 4.5,5.6645 4.5,5.25 Z m 1.676,5.25 -4.176,0 0,-7 9,0 0,1.156 1,0 0,-2.156 -11,0 0,9 4.9845,0 0.1915,-1 z"/></svg>';

const figureClass = 'img-container';
const imageClass = 'img-content';
const figcaptionClass = 'img-footnote';
const tip = '请在这里添加图片说明';

export function wrapImage(imgNode) {
  const figure = document.createElement('figure');
  figure.classList.add(figureClass);

  const footnote = document.createElement('figcaption');
  footnote.classList.add(figcaptionClass);
  footnote.innerText = tip;

  figure.appendChild(imgNode);
  figure.appendChild(footnote);

  return figure;
}

export default function injectImageFootnote(Summernote) {
  // extend Editor
  const { editor: Editor } = Summernote.options.modules;

  class EditorHacked extends Editor {
    constructor(args) {
      super(args);

      this.imageFootnote = this.wrapCommand(value => {
        const $img = $(this.restoreTarget());
        const $parent = $img.parent();

        if ($parent.hasClass(figureClass)) {
          // move figure's styles to image
          const styles = cssToObject($parent.attr('style'));
          for (const [prop, value] of Object.entries(styles)) {
            $img.css(prop, value);
          }

          // move figure's classes to image
          const classes = $parent
            .attr('class')
            .split(' ')
            .filter(i => i !== imageClass);
          for (const cls of classes) {
            $img.addClass(cls);
          }

          $img.next('figcaption').remove();
          $img.unwrap('figure');
        } else {
          const $figure = $img
            .wrap(`<figure class="${figureClass}"></figure>`)
            .parent();

          $img.after(
            `<figcaption class="${figcaptionClass}">${tip}</figcaption>`
          );

          // move image's style to figure
          const styles = cssToObject($img.attr('style'));
          for (const [prop, value] of Object.entries(styles)) {
            $figure.css(prop, value);
          }

          // move image's classes to figure
          const classes = ($img.attr('class') || '')
            .split(' ')
            .filter(i => i !== imageClass);
          for (const cls of classes) {
            $figure.addClass(cls);
          }

          $img.width('100%');
          $img.css('float', 'none');
          $img.removeClass('note-float-left');
          $img.removeClass('note-float-right');
        }
      });
    }
  }

  Summernote.options.modules.editor = EditorHacked;

  $.extend(Summernote.plugins, {
    imageFootnote: function(context) {
      const ui = Summernote.ui;
      context.memo('button.imageFootnote', () => {
        var button = ui.button({
          contents: `<i class="note-icon">${icon}</i>`,
          click: context.createInvokeHandler('editor.imageFootnote'),
        });
        return button.render();
      });
    },
  });
}
