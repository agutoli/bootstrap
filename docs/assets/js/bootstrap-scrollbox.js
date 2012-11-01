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

      this.smartEndAdjustment = 0;
      this.corrent_index_row = 0;
      this.scroll_position = 0;
      this.num_rows = this.$scroll_rows.length;
      this.ul_height = this.$scroll_ul.height();
      this.inner_height = this.$scroll_inner.height();
      this.line_height = this.getLineHeight();

      //disabled previous button 
      this.disabledPrevButton();
      this.updateCorrentIndex();
    },

    corrent: 0,

    next: function() {

      this.corrent++;

      var scroll_inner_offset = this.$scroll_inner.offset();
      var $corrent_row = $(this.$scroll_rows[this.corrent]);
      var scroll_row_offset = $corrent_row.offset();

      if (this.corrent == (this.num_rows-1) ) {
        var offset_inner_bottom = scroll_inner_offset.top + this.$scroll_inner.height();
        console.log(offset_inner_bottom);
        //this.scroll_position += offset_inner_bottom - $corrent_row.height() + this.line_height;
        //var t = scroll_row_offset.top + $corrent_row.height() + this.line_height;
        //console.log(scroll_inner_offset.top, scroll_row_offset.top, t);
      } else {
        this.scroll_position += (scroll_inner_offset.top - scroll_row_offset.top) + this.line_height;
      }

      this.enabledPrevButton();
      this.moveVerticalScroller();
      this.updateCorrentIndex();




      /*var sum_row_height = 0;
      
      if (this.corrent_index_row > 0) {
        this.corrent_index_row++;
      }

      for(var offset = this.corrent_index_row; offset < this.num_rows; offset++) {
        var row_height = $(this.$scroll_rows[offset]).height();
        if ( this.checkIfSumOfLinesFitOnTheDisplay(sum_row_height, row_height) ) {
          sum_row_height += this.sumHeightAndLineHeight(row_height);
          this.scroll_position += this.sumHeightAndLineHeight(row_height);
          this.corrent_index_row = offset;
        }
      }

      this.smartEndAdjustment = (this.ul_height - this.scroll_position) - this.inner_height;

      if (this.smartEndAdjustment < 0) {
        this.scroll_position += this.smartEndAdjustment;
        this.corrent_index_row++;
        this.disabledNextButton();
      }

      this.enabledPrevButton();
      this.moveVerticalScroller();*/
    },

    prev: function() {
     /*
     var sum_row_height = 0;

      for(var offset = this.corrent_index_row; offset >= 0; offset--) {
        var row_height = $(this.$scroll_rows[offset]).height();
        if ( this.checkIfSumOfLinesFitOnTheDisplay(sum_row_height, row_height) ) {
          sum_row_height += this.sumHeightAndLineHeight(row_height);
          if (this.corrent_index_row === (this.num_rows - 1) ) {
            this.scroll_position += this.smartEndAdjustment;
            break;
          } else {
            this.scroll_position -= this.sumHeightAndLineHeight(row_height);
          }
        }
      }
    
      if (this.scroll_position <= 0) {
        this.scroll_position = 0;
        this.corrent_index_row = 0;
        this.disabledPrevButton();
      }

      this.enabledNextButton();
      this.moveVerticalScroller();*/
    },

    updateCorrentIndex: function() {
      
      var _this = this;
      var sum_row_height = 0;

      for(var offset = this.corrent; offset < this.num_rows; offset++) {
        var row_height = $(this.$scroll_rows[offset]).height();
        
        if ( _this.checkIfSumOfLinesFitOnTheDisplay(sum_row_height, row_height) ) {
          sum_row_height += row_height + _this.line_height;
          _this.corrent = offset;
        }
      }
      console.log('index: ',_this.corrent);
    },

    checkIfSumOfLinesFitOnTheDisplay: function(sum_row_height, row_height) {
      if (this.inner_height > (sum_row_height + row_height + this.line_height) ) {
        return true;
      }
      return false;
    },

    sumHeightAndLineHeight: function(height) {
      return (height + this.line_height);
    },

    moveVerticalScroller: function() {
      
      if (!this.enabled) {
        return false;
      }

      var scroll_top = this.scroll_position;

      this.$scroll_ul.animate({
        top: scroll_top
      }, this.options.delay, $.proxy(this.options.completeAnimation, this, scroll_top));
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
    onClick: function(){},
    completeAnimation: function(){}
  };

}(window.jQuery);
