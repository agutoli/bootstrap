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

  var Scrollbox = function (element, options) {
    this.init('scrollbox', element, options);
  };

  Scrollbox.prototype = {

    constructor: Scrollbox,

    init: function (type, element, options) {

      var _this = this;
      this.type = type;

      //selectors
      this.$element = $(element);
      this.validate();
      this.$scroll_inner = $('.scrollbox-inner', this.$element);
      this.$button_prev = $('.scrollbox-control-prev', this.$element);
      this.$button_next = $('.scrollbox-control-next', this.$element);
      this.$scroll_ul = $('ul', this.$scroll_inner);
      this.$scroll_rows = $('ul li', this.$scroll_inner); 

      this.options = this.getOptions(options);
      this.enabled = true;

      //add events
      this.$button_prev.on('click.' + this.type, this.options.selector, $.proxy(this.prev, this));
      this.$button_next.on('click.' + this.type, this.options.selector, $.proxy(this.next, this));

      this.num_rows = this.$scroll_rows.length;
      this.ul_height = this.$scroll_ul.height();
      this.inner_height = this.$scroll_inner.height();
      this.line_height = this.getLineHeight();

      //disabled previous button 
      this.disabledPrevButton();
      this.updateCorrentIndex();

      var scroll_inner_top = this.$scroll_inner.offset().top;
      var scroll_inner_height = this.$scroll_inner.height();

      this.$scroll_rows.each(function(index, el){
        var row = $(el);
        var top = row.offset().top;
        if (index == (_this.num_rows-1) ) {
          var offset_bottom_inner = scroll_inner_top + _this.inner_height;
          var offset_bottom_last_row = top + row.height();
          var scroll_top = offset_bottom_inner - offset_bottom_last_row - _this.line_height;
          _this.$element.data('index-' + index, scroll_top);
        } else {
          var scroll_top = _this.$scroll_ul.offset().top - top + _this.line_height;
          _this.$element.data('index-' + index, scroll_top);
        }
      });
    },

    corrent: 0,

    next: function() {
      this.getNextIndex();
      this.enabledPrevButton();
      this.moveVerticalScroller();
      this.updateCorrentIndex();//enabled
    },

    prev: function() {
      this.getPrevIndex();
      this.enabledNextButton();
      this.moveVerticalScroller();
    },

    getPrevIndex: function() {
      var sum_row_height = 0;
      var smarty_ajustement = 0;
      var last_row = false;
     
      if (this.corrent == (this.num_rows-1)) {
        last_row = true;
      }
      
      if (this.corrent > 0 && !last_row) {
        this.corrent--;
      }

      for(var offset = this.corrent; offset >= 0; offset--) {
        var row_height = $(this.$scroll_rows[offset]).height();
        if ( this.checkIfSumOfLinesFitOnTheDisplay(sum_row_height, row_height) ) {
          sum_row_height += row_height + this.line_height;
          this.corrent = offset;
        } else if ( last_row && this.checkIfSumOfLinesFitOnTheDisplay(smarty_ajustement, row_height) ) {
          smarty_ajustement += row_height + this.line_height;
          this.corrent--;
        }
      }
    },

    getNextIndex: function() {
      var sum_row_height = 0;
      for(var offset = this.corrent; offset < this.num_rows; offset++) {
        var row_height = $(this.$scroll_rows[offset]).height();
        if ( this.checkIfSumOfLinesFitOnTheDisplay(sum_row_height, row_height) ) {
          sum_row_height += row_height + this.line_height;
          this.corrent = offset;
        }
      }
    },

    updateCorrentIndex: function(scroll) {
      
      var sum_row_height = 0;
      
      for(var offset = this.corrent; offset < this.num_rows; offset++) {
        var row_height = $(this.$scroll_rows[offset]).height();
        if ( this.checkIfSumOfLinesFitOnTheDisplay(sum_row_height, row_height) ) {
          sum_row_height += row_height + this.line_height;
          this.corrent = offset;
        }
      }
    },

    checkIfSumOfLinesFitOnTheDisplay: function(sum_row_height, row_height) {
      if (this.inner_height > (sum_row_height + row_height + this.line_height) ) {
        return true;
      }
      return false;
    },

    moveVerticalScroller: function() {
      
      if (!this.enabled) {
        return false;
      }

      if (this.corrent == (this.num_rows -1) ) {
        this.disabledNextButton();//disabled
      }

      if (this.corrent == 0) {
        this.disabledPrevButton();//disabled
      }

      var limit_bottom_allowed = this.$scroll_inner.height() - this.ul_height;

      var scroll_top = this.$element.data('index-'+ this.corrent);
      if ( scroll_top < limit_bottom_allowed ) {
        scroll_top = limit_bottom_allowed;   
      }

      this.$scroll_ul.animate({
        top: scroll_top
      }, this.options.delay, $.proxy(this.options.completeAnimation, this, scroll_top));

      if (this.corrent == 0) {
        this.updateCorrentIndex();
      }
    },

    getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data());
      return options;
    },

    enabledNextButton: function() {
      var next = this.$button_next.find('.btn');
      next.removeClass('disabled');
    },

    disabledNextButton: function() {
      var next = this.$button_next.find('.btn');
      next.addClass('disabled');
    },

    enabledPrevButton: function() {
      var prev = this.$button_prev.find('.btn');
      prev.removeClass('disabled');
    },

    disabledPrevButton: function() {
      var prev = this.$button_prev.find('.btn');
      prev.addClass('disabled');
    },
   
    getLineHeight: function(){
      var sum_rows_height = 0;
      $.each(this.$scroll_rows, function(i, el){
        sum_rows_height += $(el).height(); 
      });
      return (this.ul_height - sum_rows_height) / (this.num_rows + 1);
    },

    validate: function () {
      if (!this.$element[0].parentNode) {
        this.$element = null;
        this.options = null;
      }
    },

    enable: function () {
      this.enabled = true;
    },

    disable: function () {
      this.enabled = false;
    },

    destroy: function () {
      this.$element.off('.' + this.type).removeData(this.type);
      this.$button_prev.off('.' + this.type).removeData(this.type);
      this.$button_next.off('.' + this.type).removeData(this.type);
    }
  };

 /* scrollbox PLUGIN DEFINITION
  * ========================= */

  $.fn.scrollbox = function ( option ) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('scrollbox'),
          options = typeof option === 'object' && option;
      if (!data) {
        $this.data('scrollbox', (data = new Scrollbox(this, options)));
      }
      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  $.fn.scrollbox.Constructor = Scrollbox;

  $.fn.scrollbox.defaults = {
    animation: true,
    selector: false,
    delay: 'fast',
    completeAnimation: function(){}
  };

}(window.jQuery);
