import $ from 'jquery';

export default function injectRemoveMediaX(Summernote) {
  // extend Editor
  const { editor: Editor } = Summernote.options.modules;
  class EditorHacked extends Editor {
    constructor(args) {
      super(args);

      this.removeMediaX = this.wrapCommand(() => {
        let $target = $(this.restoreTarget());

        if ($target.parent('figure').length) {
          $target.parent('figure').remove();
        } else {
          $target = $(this.restoreTarget()).detach();
        }

        this.context.triggerEvent('media.delete', $target, this.$editable);
      });
    }
  }

  Summernote.options.modules.editor = EditorHacked;

  $.extend(Summernote.plugins, {
    removeMediaX: function(context) {
      const { ui } = Summernote;
      context.memo(`button.removeMediaX`, () => {
        var button = ui.button({
          contents: '<i class="note-icon-trash"></i>',
          click: context.createInvokeHandler('editor.removeMediaX'),
        });

        return button.render();
      });
    },
  });
}
