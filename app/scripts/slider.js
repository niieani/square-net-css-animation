"use strict";

/*
 NOTE:
 when released the scroller or when moving to another window, disable events on body so we won't be able to scroll again
 [also better performance]:
 pointer-events: none

 http://www.thecssninja.com/css/pointer-events-60fps
 */

/*
 https://github.com/azundo/scrollend-js/blob/master/scrollEnd.js
 */
/*
 * All code Copyright Benjamin Best 2013 unless otherwise referenced.  Licensed
 * under the MIT License, see the LICENSE file included in this repository for
 * the full terms.
 */
class ScrollEnd {
  constructor(checkInterval = 100, elementReference = null) {

    this._subscribers = [];
    this._scrolling = false;

    this.elementReference = elementReference;

    if (elementReference === null) {
      var B = document.body;
      var D = document.documentElement;
      D = (D.clientHeight) ? D : B;
      this.elementReference = D;
      this._usingBody = true;
    }
    else
      this._usingBody = false;

    var that = this;
    this._lastScrollPosition = that.getScrollTop();

    setInterval(function() {
      var scrollPosition = that.getScrollTop();
      if (that._scrolling && scrollPosition === that._lastScrollPosition) {
        // we have stopped scrolling
        that._scrolling = false;
        for (let subscriber of that._subscribers)
        {
          subscriber(scrollPosition);
        }
      } else if (!that._scrolling && scrollPosition !== that._lastScrollPosition) {
        // we have started scrolling
        that._scrolling = true;
      }
      that._lastScrollPosition = scrollPosition;
    }, checkInterval);
  }
  getScrollTop(){
    // from http://stackoverflow.com/questions/871399/cross-browser-method-for-detecting-the-scrolltop-of-the-browser-window
    if (this._usingBody && typeof pageYOffset != 'undefined') {
      return pageYOffset;
    } else {
      return this.elementReference.scrollTop;
    }
  }
  subscribe(func) {
    this._subscribers.push(func);
  }
  unsubscribe(func) {
    var idx = this._subscribers.indexOf(func);
    if (idx >= 0) {
      this._subscribers.splice(idx, 1);
    }
  }
}

(function ()
{
  var $single = document.querySelector.bind(document);
  var $every = document.querySelectorAll.bind(document);
  var body = document.body;

  var sectionGroup = $single('.sections');
  var sections = sectionGroup.childNodes;

  var scrollEndSection = new ScrollEnd(sectionGroup, 200);

  var allSect = $('.sections');
  allSect.scroll(function(e){

  });
/*
  var first = $('.previous-or-first');
  var firstInside = $('.red');
  var second = $('.current-or-second');
  var secondInside = $('.blue');
  var third = $('.next');
  var thirdInside = $('.pink');
  var height = 300;
  //first.scrollTop(height);
  first.scroll(function(e){
    //console.log(e);
    //e.preventDefault();
    let scrollAt = first.scrollTop();
    //firstInside.css('margin-top', scrollAt);
    let scrollBefore = second.scrollTop();
    //first.scrollTop(height);
    console.log('scrolled, new top:', scrollAt);
    //if (scrollAt >= height) {
    //  second.scrollTop(scrollBefore + scrollAt - height);
      second.scrollTop(scrollAt);
    //}
  });
*/
/*
  $('.red').pep({
    initiate: function(){
      console.log('initiated');
    },
    start: function(){
      console.log('start');
      $('.red').addClass('pressed');
    },
    drag: function(){
      console.log('drag');
    },
    stop: function(){
      console.log('stop');
    },
    easing: function(){
      console.log('easing');
    },
    rest: function(){
      console.log('rest');
      $('.red').removeClass('pressed');
    },
    constrainTo: 'parent'
  });
*/
})();
