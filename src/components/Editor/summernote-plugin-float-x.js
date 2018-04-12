import $ from 'jquery';

function capWord(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function injectFloatX(Summernote) {
  // extend Editor
  const { editor: Editor } = Summernote.options.modules;
  class EditorHacked extends Editor {
    constructor(args) {
      super(args);

      this.floatX = this.wrapCommand(value => {
        const $target = $(this.restoreTarget());
        const $parent = $target.parent();

        if ($parent.hasClass('img-container')) {
          $parent.toggleClass('note-float-left', value === 'left');
          $parent.toggleClass('note-float-right', value === 'right');
          $parent.css('float', value);

          $target.css('float', null);
        } else {
          $target.toggleClass('note-float-left', value === 'left');
          $target.toggleClass('note-float-right', value === 'right');
          $target.css('float', value);
        }
      });
    }
  }

  Summernote.options.modules.editor = EditorHacked;

  function genFloatXFunc(type) {
    return function(context) {
      const { ui } = Summernote;
      context.memo(`button.float${capWord(type)}X`, () => {
        var button = ui.button({
          contents: `<i class="note-icon-align-${
            type === 'none' ? 'justify' : type
          }"></i>`,
          click: context.createInvokeHandler('editor.floatX', type),
        });

        return button.render();
      });
    };
  }

  $.extend(Summernote.plugins, {
    floatLeftX: genFloatXFunc('left'),
    floatRightX: genFloatXFunc('right'),
    floatNoneX: genFloatXFunc('none'),
  });
}
