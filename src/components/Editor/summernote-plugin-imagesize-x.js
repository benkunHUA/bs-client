import $ from 'jquery';

export default function injectImagesizeX(Summernote) {
  // extend Editor
  const { editor: Editor } = Summernote.options.modules;
  class EditorHacked extends Editor {
    constructor(args) {
      super(args);

      this.imagesizeX = this.wrapCommand(value => {
        const $target = $(this.restoreTarget());
        const $parent = $target.parent();
        if ($parent.hasClass('img-container')) {
          $parent.css({
            width: `${value}%`,
            height: '',
          });

          $target.css({ width: '100%' });
        } else {
          $target.css({
            width: `${value}%`,
            height: '',
          });
        }
      });
    }
  }

  Summernote.options.modules.editor = EditorHacked;

  function genImagesizeXFunc(size) {
    return function(context) {
      const { ui } = Summernote;
      context.memo(`button.imagesize${size}X`, () => {
        var button = ui.button({
          contents: `<span class="note-fontsize-10">${size}%</span>`,
          click: context.createInvokeHandler('editor.imagesizeX', size),
        });

        return button.render();
      });
    };
  }

  $.extend(Summernote.plugins, {
    imagesize100X: genImagesizeXFunc(100),
    imagesize50X: genImagesizeXFunc(50),
    imagesize25X: genImagesizeXFunc(25),
  });
}
