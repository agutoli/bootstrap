/* ===========================================================
 * bootstrap-scrollbox.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollboxs
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* scrollbox PUBLIC CLASS DEFINITION
  * =============================== */

  var scrollbox = function (element, options) {
    this.init('scrollbox', element, options);
  }

  scrollbox.prototype = {

    constructor: scrollbox,

    init: function (type, element, options) {
      
      var _this = this;

      this.type = type;
      this.$element = $(element);
      this.$scroll_inner = $('.scrollbox-inner', this.$element);
      this.$button_prev = $('.scrollbox-control-prev', this.$element);
      this.$button_next = $('.scrollbox-control-next', this.$element);
      this.options = this.getOptions(options);
      this.enabled = true;

      //events
      this.$button_prev.on('click.' + this.type, this.options.selector, $.proxy(this.prev, this));
      this.$button_next.on('click.' + this.type, this.options.selector, $.proxy(this.next, this));

      this.rows = $('ul li', this.$scroll_inner); 
      this.corrent_row = 0;

      this.sum_rows_height = 0;
      this.num_rows = this.rows.length;
      this.ul_height = this.$scroll_inner.find('ul').height();

      $.each(this.rows, function(i, el){
         _this.sum_rows_height += $(el).height(); 
      });

      this.inner_height = this.$scroll_inner.height();
      this.line_height = (this.ul_height - this.sum_rows_height) / (this.num_rows + 1);
      this.scroll_height = 0;
      this.$button_prev.find('.btn').addClass('disabled');
    },

    next: function() {
      var _this = this;
      var row_corrent_height = 0;
      for(var offset = this.corrent_row; offset < this.num_rows; offset++) {
        var row_height = $(this.rows[offset]).height();
        if (this.inner_height > (row_corrent_height + row_height + this.line_height) ) {
          row_corrent_height += row_height + this.line_height;
          this.scroll_height += row_height + this.line_height;
          this.corrent_row = offset;
        }
      }

      var diff_end_scroller = (this.ul_height - this.scroll_height) - this.inner_height;
      if (diff_end_scroller < 0) {
        this.scroll_height += diff_end_scroller;
        this.corrent_row = this.num_rows - 1;
        this.$button_next.find('.btn').addClass('disabled');
      }

      var prev = this.$button_prev.find('.btn');
      if (prev.hasClass('disabled')) prev.removeClass('disabled');

      this.$scroll_inner.find('ul').animate({top: '-'+ _this.scroll_height});
    },

    prev: function() {
      var _this = this;
      var row_corrent_height = 0;

      for(var offset = this.corrent_row; offset >= 0; offset--) {
        var row_height = $(this.rows[offset]).height();
        if (this.inner_height > (row_corrent_height + row_height + this.line_height) ) {
          row_corrent_height += row_height + this.line_height;
          this.scroll_height -= row_height + this.line_height;
        }
      }

      if (this.scroll_height <= 0) {
        this.scroll_height = 0;
        this.corrent_row = 0;
        this.$button_prev.find('.btn').addClass('disabled');
      }
      
      var next = this.$button_next.find('.btn');
      if (next.hasClass('disabled')) next.removeClass('disabled'); 

      this.$scroll_inner.find('ul').animate({top: '-'+ _this.scroll_height}, this.options.delay);
    },

    getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    },

    validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    },

    enable: function () {
      this.enabled = true
    },

    disable: function () {
      this.enabled = false
    },

    destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }
  }


 /* scrollbox PLUGIN DEFINITION
  * ========================= */

  $.fn.scrollbox = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollbox')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollbox', (data = new scrollbox(this, options)));
      if (typeof option == 'string') data[option]();
    })
  }

  $.fn.scrollbox.Constructor = scrollbox;

  $.fn.scrollbox.defaults = {
    animation: true,
    selector: false,
    delay: 'slow'
  };

}(window.jQuery);
