import $ from 'jquery';

export default function injectColorX(Summernote) {
  // extend Editor
  const { buttons: Buttons } = Summernote.options.modules;
  class ButtonsHacked extends Buttons {
    constructor(args) {
      super(args);

      this.context.memo('button.backgroundColorX', () => {
        return this.ui
          .buttonGroup({
            className: 'note-color',
            children: [
              this.button({
                className: 'note-current-color-button',
                contents: this.ui.icon(
                  'note-icon-pencil' + ' note-recent-color'
                ),
                tooltip: '最近使用的背景色',
                click: e => {
                  const $button = $(e.currentTarget);
                  this.context.invoke('editor.color', {
                    backColor: $button.attr('data-backColor'),
                    foreColor: $button.attr('data-foreColor'),
                  });
                },
                callback: $button => {
                  const $recentColor = $button.find('.note-recent-color');
                  $recentColor.css('background-color', 'inherit');
                  $button.attr('data-backColor', 'inherit');
                },
              }),
              this.button({
                className: 'dropdown-toggle',
                contents: this.ui.dropdownButtonContents('', this.options),
                tooltip: this.lang.color.more,
                data: {
                  toggle: 'dropdown',
                },
              }),
              this.ui.dropdown({
                items: [
                  '<div class="note-palette">',
                  '  <div class="note-palette-title">' +
                    this.lang.color.background +
                    '</div>',
                  '  <div>',
                  '    <button type="button" class="note-color-reset btn btn-light" data-event="backColor" data-value="inherit">',
                  this.lang.color.transparent,
                  '    </button>',
                  '  </div>',
                  '  <div class="note-holder" data-event="backColor"/>',
                  '</div>',
                ].join(''),
                callback: $dropdown => {
                  $dropdown.find('.note-holder').each((idx, item) => {
                    const $holder = $(item);
                    $holder.append(
                      this.ui
                        .palette({
                          colors: this.options.colors,
                          colorsName: this.options.colorsName,
                          eventName: $holder.data('event'),
                          container: this.options.container,
                          tooltip: this.options.tooltip,
                        })
                        .render()
                    );
                  });
                },
                click: event => {
                  const $button = $(event.target);
                  const eventName = $button.data('event');
                  const value = $button.data('value');

                  if (eventName && value) {
                    const key =
                      eventName === 'backColor' ? 'background-color' : 'color';
                    const $color = $button
                      .closest('.note-color')
                      .find('.note-recent-color');
                    const $currentButton = $button
                      .closest('.note-color')
                      .find('.note-current-color-button');

                    $color.css(key, value);
                    $currentButton.attr('data-' + eventName, value);
                    this.context.invoke('editor.' + eventName, value);
                  }
                },
              }),
            ],
          })
          .render();
      });

      this.context.memo('button.foregroundColorX', () => {
        return this.ui
          .buttonGroup({
            className: 'note-color',
            children: [
              this.button({
                className: 'note-current-color-button',
                contents: this.ui.icon(
                  this.options.icons.font + ' note-recent-color'
                ),
                tooltip: '最近使用的前景色',
                click: e => {
                  const $button = $(e.currentTarget);
                  this.context.invoke('editor.color', {
                    backColor: $button.attr('data-backColor'),
                    foreColor: $button.attr('data-foreColor'),
                  });
                },
                callback: $button => {
                  const $recentColor = $button.find('.note-recent-color');
                  $recentColor.css('background-color', 'inherit');
                  $button.attr('data-backColor', 'inherit');
                },
              }),
              this.button({
                className: 'dropdown-toggle',
                contents: this.ui.dropdownButtonContents('', this.options),
                tooltip: this.lang.color.more,
                data: {
                  toggle: 'dropdown',
                },
              }),
              this.ui.dropdown({
                items: [
                  '<div class="note-palette">',
                  '  <div class="note-palette-title">' +
                    this.lang.color.foreground +
                    '</div>',
                  '  <div>',
                  '    <button type="button" class="note-color-reset btn btn-light" data-event="removeFormat" data-value="foreColor">',
                  this.lang.color.resetToDefault,
                  '    </button>',
                  '  </div>',
                  '  <div class="note-holder" data-event="foreColor"/>',
                  '</div>',
                ].join(''),
                callback: $dropdown => {
                  $dropdown.find('.note-holder').each((idx, item) => {
                    const $holder = $(item);
                    $holder.append(
                      this.ui
                        .palette({
                          colors: this.options.colors,
                          colorsName: this.options.colorsName,
                          eventName: $holder.data('event'),
                          container: this.options.container,
                          tooltip: this.options.tooltip,
                        })
                        .render()
                    );
                  });
                },
                click: event => {
                  const $button = $(event.target);
                  const eventName = $button.data('event');
                  const value = $button.data('value');

                  if (eventName && value) {
                    const key =
                      eventName === 'backColor' ? 'background-color' : 'color';
                    const $color = $button
                      .closest('.note-color')
                      .find('.note-recent-color');
                    const $currentButton = $button
                      .closest('.note-color')
                      .find('.note-current-color-button');

                    $color.css(key, value);
                    $currentButton.attr('data-' + eventName, value);
                    this.context.invoke('editor.' + eventName, value);
                  }
                },
              }),
            ],
          })
          .render();
      });
    }
  }

  Summernote.options.modules.buttons = ButtonsHacked;
}
