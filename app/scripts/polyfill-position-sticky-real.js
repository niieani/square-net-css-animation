"use strict";

(function($) {
  // http://stackoverflow.com/questions/4814398/how-can-i-check-if-a-scrollbar-is-visible
  $.fn.hasScrollBar = function() {
    return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
  };

  // http://stackoverflow.com/questions/8079187/how-to-calculate-the-width-of-the-scroll-bar
  $.fn.getScrollbarWidth = function() {
    var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
      widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
    $outer.remove();
    return 100 - widthWithScroll;
  };
})(jQuery);

(function($) {
  /**
   * Feature detect position sticky, if it exists then do nothing
   */
  if ((function(d) {
      //if (window.navigator.userAgent.indexOf('Firefox/') > -1) return true;
      try {
        // some browsers will throw an error when assigning an
        // unsupported value to a property
        d.style.position = "sticky"
      } catch (e) {
        return false
      }
      // this will return false if the browser doesn't recognize
      // "sticky" as a valid position value
      return d.style.position === "sticky"
    }(document.createElement("div")))) return

  /**
   * A unique id used to safely remove event callbacks
   */
  var uniqueID = 0

  function triggerChange($el, parentScrollTrigger) {
    var data = $el.data("position:sticky");
    //console.log("trigger", data.waitingForUpdate);
    // Only trigger a layout change if we’re not already waiting for one [or parent triggered]
    if (!data.waitingForUpdate || parentScrollTrigger) {

      data.waitingForUpdate = true;
      // Don’t update until next animation frame if we can, otherwise use a
      // timeout - either will help avoid too many repaints
      if (requestAnimationFrame) {
        requestAnimationFrame(function(){setPositions($el, parentScrollTrigger)});
      }
      else {
        // TODO: replace with real shim
        setTimeout(function(){setPositions($el)}, 15);
      }
    }
  }

  var body = $(window);
  var scrollBarSize = body.getScrollbarWidth();

  /**
   * Scroll event callback
   * Based on the scroll position toggle the element between
   * position:fixed and its default position value
   */
  function setPositions($el, parentScrollChanged) {
    console.log($el.get(0).classList);

    var data = $el.data("position:sticky")
    if (!data) return

    //console.log(data);

    var viewportScrollTop = data.$viewport.scrollTop();
    var viewportScrollLeft = data.$viewport.scrollLeft();
    //console.log('scroll', viewportScrollTop, 'scrollLeft', viewportScrollLeft);
    //console.log('viewportScrollTop vs Original', viewportScrollTop, data.stickyDistanceTop);

    if (parentScrollChanged)
    {
      data.bodyScrollTop = body.scrollTop();
      data.bodyScrollLeft = body.scrollLeft();
    }

    var placeholderDistanceFromBody;
    //TODO: var otherCase = viewportScrollLeft >= data.absDistanceFromParentsLeft - data.stickyDistanceLeft;
    var otherCase = false;

    //console.log('top', data.placeholderDistanceFromBodyTop, data.stickyDistanceTop, data.absDistanceFromParentsTop, data.bodyScrollTop, data.placeholderDistanceFromBodyTop - data.absDistanceFromParentsTop - data.bodyScrollTop);
    //console.log('viewportScrollTop, offset-top, original-top', viewportScrollTop, data.absDistanceFromParentsTop, data.stickyDistanceTop, Math.abs(data.absDistanceFromParentsTop - data.stickyDistanceTop));

    //if (data.stickyDistanceTop === data.absDistanceFromParentsTop)
    //if (viewportScrollTop >= Math.abs(data.absDistanceFromParentsTop - data.stickyDistanceTop))
    //if (viewportScrollTop >= data.absDistanceFromParentsTop - data.stickyDistanceTop && data.stickyDistanceTop != data.absDistanceFromParentsTop || viewportScrollTop >= data.absDistanceFromParentsTop && data.stickyDistanceTop == data.absDistanceFromParentsTop)
    // TODO: add data.$viewport.position().left
    // TODO: make data.absDistanceFromParentsTop dynamic via the placeholder item
    // data.$viewport.position().top -
/*
    var visibleDistanceFromViewportToParentTop,
        realScrolledDistanceFromViewportTop;
    if (data.usingAbsolute)
    {

    }
*/
    // Fix for <HTML> with margin
    //var viewportDistanceFromWindowTop = data.$viewport.get(0) === document.body ? 0 : data.$viewport.offset().top;
    var viewportDistanceFromWindowTop = data.$viewport.get(0) === document.body ? 0 : data.$viewport.get(0).getBoundingClientRect().top;
    var parentDistanceFromWindowTop = $el.parent().get(0).getBoundingClientRect().top;
    var placeholderDistanceFromWindowTop = data.usingAbsolute ? $el.get(0).getBoundingClientRect().top : data.$placeholder.get(0).getBoundingClientRect().top;
    var placeholderDistanceFromParentTop = placeholderDistanceFromWindowTop - parentDistanceFromWindowTop;

    var placeholderDistanceFromViewPortTop = placeholderDistanceFromWindowTop - viewportDistanceFromWindowTop;

    // This is the real Scrolled Distance From Parent:

    var realScrolledDistanceFromViewportTop;
    if (data.$viewport.get(0) === document.body)
    {
      //console.log('from body');
      realScrolledDistanceFromViewportTop = -parentDistanceFromWindowTop;
      // TODO: add check for scrollbar on 'Y-axis'
    }
    else
    {
      //console.log('from viewport')
      realScrolledDistanceFromViewportTop = data.$viewport.scrollTop();
    }
    /*
    if (data.$viewport.hasScrollBar())
      realScrolledDistanceFromViewportTop = data.$viewport.scrollTop();
    else
      realScrolledDistanceFromViewportTop = -(placeholderDistanceFromWindowTop - viewportDistanceFromWindowTop - placeholderDistanceFromParentTop);
    */
    //var visibleDistanceFromViewportToParentTop = $el.parent().offset().top - data.$viewport.offset().top;

    //var visibleDistanceFromViewportToParentTop = $el.parent().get(0).getBoundingClientRect().top - viewportDistanceFromWindowTop;
    //var realScrolledDistanceFromViewportTop = -visibleDistanceFromViewportToParentTop;


    console.log('realScrolledDistanceFromViewportTop', realScrolledDistanceFromViewportTop);
    console.log('viewportDistanceFromWindowTop', viewportDistanceFromWindowTop);
    console.log('placeholderDistanceFromWindowTop', placeholderDistanceFromWindowTop);
    console.log('parentDistanceFromWindowTop', parentDistanceFromWindowTop);
    console.log('placeholderDistanceFromParentTop', placeholderDistanceFromParentTop);


    //if (viewportScrollTop >= data.absDistanceFromParentsTop - data.stickyDistanceTop)
    //if (realScrolledDistanceFromViewportTop >= data.absDistanceFromParentsTop - data.stickyDistanceTop)
    //if (realScrolledDistanceFromViewportTop >= placeholderDistanceFromParentTop - data.stickyDistanceTop)
    //if (placeholderDistanceFromParentTop <= data.stickyDistanceTop)
    if (placeholderDistanceFromViewPortTop <= data.stickyDistanceTop)
    {
      // TEMPORARY
      otherCase = true;
      if (data.usingAbsolute || parentScrollChanged || otherCase)
      {
        if (false)
        //if (realScrolledDistanceFromViewportTop + data.fixedHeight + data.stickyDistanceTop >= $el.parent().innerHeight())
        {
            // this is the case we stick to the bottom
            data.$placeholder.css('display', '');
            $el.css('position', 'absolute');
            $el.css('bottom', '0');
            $el.css('top', 'initial');
            //console.log('returned to normal, absolute');
            // TODO return to previous values
            $el.css('left', '');
            $el.css('width', '');
            $el.css('margin', '');
            $el.css('overflow', '');
            $el.css('height', '');
            data.usingAbsolute = false;
            data.waitingForUpdate = false;
        }
        else
        {

          //console.log('setting position:', 'stuck', viewportScrollTop, data.stickyDistanceTop, 'parent changed?', parentScrollChanged);
          data.$placeholder.css('display', '');
          $el.css('position', 'fixed');

          // fetch the position of the placeholder
          placeholderDistanceFromBody = data.$placeholder.get(0).getBoundingClientRect();
          data.placeholderDistanceFromBodyTop = placeholderDistanceFromBody.top;
          data.placeholderDistanceFromBodyLeft = placeholderDistanceFromBody.left;
          var parentDistanceFromBody = $el.parent().get(0).getBoundingClientRect();
          data.absDistanceFromParentsLeft = placeholderDistanceFromBody.left - parentDistanceFromBody.left;
          data.absDistanceFromParentsTop = placeholderDistanceFromBody.top - parentDistanceFromBody.top;

          data.fixedHeight = data.$placeholder.outerHeight();
          data.fixedWidth = data.$placeholder.outerWidth();

          //console.log(realScrolledDistanceFromViewportTop, viewportScrollTop, data.absDistanceFromParentsTop, realScrolledDistanceFromViewportTop - data.fixedHeight - data.absDistanceFromParentsTop - data.stickyDistanceTop);

          $el.css('display', '');

          var invisiblePartOfElement = data.$placeholder.outerHeight() - data.$placeholder.get(0).getBoundingClientRect().height;
          console.log('invisible part', invisiblePartOfElement);
          var visibilityThreshold = realScrolledDistanceFromViewportTop + data.fixedHeight + data.stickyDistanceTop;
          var parentTotalHeight = $el.parent().get(0).scrollHeight;

          // FIXME
          // total height
          //if (visibilityThreshold > $el.parent().get(0).getBoundingClientRect().height)
          if (visibilityThreshold > parentTotalHeight)
          //if (visibilityThreshold > $el.parent().innerHeight())
          {
            if (visibilityThreshold - parentTotalHeight > data.fixedHeight + data.stickyDistanceTop)
            {
              console.log('visibility threshold passed');
              $el.css('display', 'none');
              //$el.css('top', '');
            }
            else
            {
              console.log('visibility threshold approaching');
              // TODO: substract padding
              $el.css('top', viewportDistanceFromWindowTop + parentTotalHeight - realScrolledDistanceFromViewportTop - data.fixedHeight + 'px');
              /*
              console.log('viewportDistanceFromWindowTop', viewportDistanceFromWindowTop);
              //console.log('$el.parent().innerHeight()', $el.parent().innerHeight());
              console.log('realScrolledDistanceFromViewportTop', realScrolledDistanceFromViewportTop);
              console.log('data.fixedHeight', data.fixedHeight);
              console.log('parentTotalHeight', parentTotalHeight);
              console.log('visibilityThreshold', visibilityThreshold);
              */
            }
          }
          else
          {
            console.log('elements visible, viewport distance + sticky distance applied')
            $el.css('top', viewportDistanceFromWindowTop + data.stickyDistanceTop + 'px');
            //$el.css('top', data.placeholderDistanceFromBodyTop + realScrolledDistanceFromViewportTop - data.absDistanceFromParentsTop - data.stickyDistanceTop  + 'px');
          }

          //var overflow =

          //console.log('left', data.placeholderDistanceFromBodyLeft, data.absDistanceFromParentsLeft, data.stickyDistanceLeft, data.bodyScrollLeft);
          //console.log('top', data.placeholderDistanceFromBodyTop, data.absDistanceFromParentsTop, data.stickyDistanceTop, data.bodyScrollTop);
  //  - data.absDistanceFromParentsTop
  //        $el.css('top', parentFromBodyTop + viewportScrollTop + 'px'); //- data.bodyScrollTop
          //$el.css('left', data.placeholderDistanceFromBodyLeft + viewportScrollLeft - (data.absDistanceFromParentsLeft - data.stickyDistanceLeft) - viewportScrollLeft + 'px'); // - data.bodyScrollLeft

          // GOOD:
          //$el.css('top', data.placeholderDistanceFromBodyTop + viewportScrollTop - (data.absDistanceFromParentsTop - data.stickyDistanceTop)  + 'px'); //- data.bodyScrollTop
          //$el.css('left', data.placeholderDistanceFromBodyLeft + viewportScrollLeft - (data.absDistanceFromParentsLeft - data.stickyDistanceLeft) - viewportScrollLeft + 'px'); // - data.bodyScrollLeft

          $el.css('width', data.fixedWidth);
          $el.css('margin', '0');

          // fix for overflowing when element fixed is out of context
          $el.css('overflow', 'hidden');
          //$el.css('height', data.$placeholder.outerHeight() - data.stickyDistanceTop + 'px');
          //var overflow = viewportScrollTop +
          $el.css('height', data.fixedHeight + 'px');

          $el.addClass('stuck');
          data.usingAbsolute = false;
        }
      }
      data.waitingForUpdate = false;
    }
    else
    {
      if (!data.usingAbsolute)
      {
        console.log('resetting position:', 'absolute', viewportScrollTop, data.stickyDistanceTop);

        $el.removeClass('stuck');
        //$el.css('position', 'absolute');
        data.$placeholder.css('display', 'none');
        $el.css('position', 'static');
        //console.log('returned to normal, absolute');
        // TODO return to previous values
        $el.css('top', '');
        $el.css('left', '');
        $el.css('width', '');
        $el.css('margin', '');
        $el.css('overflow', '');
        $el.css('height', '');

        // update the values from the real thing
        //placeholderDistanceFromBody = $el.get(0).getBoundingClientRect();
        //data.placeholderDistanceFromBodyTop = placeholderDistanceFromBody.top;
        //data.placeholderDistanceFromBodyLeft = placeholderDistanceFromBody.left;

        data.usingAbsolute = true;
      }
      data.waitingForUpdate = false;
    }
    //console.log('after', data);
    /*
    if ($(window).scrollTop() >= data.absDistanceFromParentsTop - data.top) {
      if (!data.$clone) {
        data.$clone = $el.clone().css({position: "fixed", top: data.top}).appendTo("body")
        $el.css("visibility", "hidden")
        onresize($el)
      }
    }
    else {
      if (data.$clone) {
        data.$clone.remove()
        data.$clone = null
        $el.css("visibility", "visible")
      }
    }
    */
  }


  /**
   * TODO: recalc WIDTH according to new size
   *
   * Resize event callback
   * Recalculate the dimensions of the hidden element as
   * it may have changed. If it has, update the clone
   */
  function onresize($el) {
    var data = $el.data("position:sticky")
      , offset
    // Make sure no operations that require a repaint are
    // done unless a cloned element exists
    if (data && data.$clone) {
      offset = $el.offset()
      data.absDistanceFromParentsTop = offset.top
      data.$clone.css({left: offset.left, width: $el.width()})
    }
  }

  // requestAnimationFrame may be prefixed
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame;

  // HACK: enable scrolling with touch on Chrome/WebKit/WebView
  function onTouchMove(e, data){
    if (data.pointerEventsEnabled)
    {
      data.pointerEventsEnabled = false;
      polyfilledElements[data.id].css('pointer-events', 'none');
    }
  }
  function onTouchEnd(e, data){
    polyfilledElements[data.id].css('pointer-events', ''); // restore defaults
    data.pointerEventsEnabled = true;
  }
  // HACK: enable scrolling with mouse on Chrome
  function onWheel(e, data){
    //stick.on('wheel', function(e){
    console.log("trigerred", e.originalEvent);
    var newEvent = new WheelEvent(e.originalEvent.type, e.originalEvent);
    console.log("copied", newEvent);
    data.$viewport.get(0).dispatchEvent(newEvent);
    return false;
    //});
  }

  // http://stackoverflow.com/questions/8079187/how-to-calculate-the-width-of-the-scroll-bar
  function updateAbsoluteValues($el){
    var data = $el.data("position:sticky");

    if (data) {
      //data.$placeholder
      var realAbsoluteValues = $el.get(0).getBoundingClientRect();
      data.placeholderDistanceFromBodyTop = realAbsoluteValues.top;
      data.placeholderDistanceFromBodyLeft = realAbsoluteValues.left;
    }
  }


  function getScrollBarWidth () {
    var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
      widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
    $outer.remove();
    return 100 - widthWithScroll;
  }

  var polyfilledElements = [];

  function findClosestParentWithScrollbar($el) {
    var viewport = $(document.body);
    var parents = $el.parents()
    for (var parentI = 0; parentI < parents.length; parentI++)
    {
      var parent = $(parents[parentI]);
      if (parent.hasScrollBar())
      {
        viewport = parent;
        break;
      }
    }
    //if (viewport.get(0) === document.body || !viewport)
    //{
    //  viewport = $(window);
    //}
    console.log("closest parent", viewport);
    return viewport;
  }

  function doMatched(rules) {
    // TODO: if the element has width not in pixels - we need to set it when element is 'fixed'

    // TODO: add check if parent is the same as "window" - then we skip listening for the parent and do not sum it (otherwise it will be double)

    // TODO: when the last element in the DIV

    // TODO: moving right and left on mobile fucks up, need to also adjust for LEFT scroll not only TOP

    // TODO: what about minus top/left positions? they don't even work in Firefox's native implementation

    // TODO: in the case stuck element is bigger then the parent,
    // we need to apply overflow: hidden and alter height/width to the scroll

    rules.each(function(rule) {
      var $elements = $(rule.getSelectors())
        , declaration = rule.getDeclaration()
      $elements.each(function() {
        var $this = $(this)
          , data = $this.data("position:sticky");
        // 'sticky' it should mimic a position relative according to spec, yet Firefox mimics 'static'
        // I'm going to implement the same things as with Firefox
        $this.css('position', 'static');
        // TODO: add bottom support; break for now for elements with bottom
        if ($this.css('bottom') !== 'auto')
          return;
        if (!data) {
          var stickyDistanceTop = parseInt($this.css('top'), 10);
          var stickyDistanceLeft = parseInt($this.css('left'), 10);
          //var stickyDistanceTop = parseInt(declaration.top, 10);
          //var stickyDistanceLeft = parseInt(declaration.left, 10);
          // TODO: report BUG: declaration doesn't contain CSS from other classes that the el. inherits
          data = {
            id: ++uniqueID,
            pointerEventsEnabled: true,
            //parentScrollChanged: true,
            //absDistanceFromParentsTop: $this.offset().top,
            absDistanceFromParentsTop: $this.position().top,
            absDistanceFromParentsLeft: $this.position().left,
            stickyDistanceTop: stickyDistanceTop >= 0 ? stickyDistanceTop : 0,
            stickyDistanceLeft: stickyDistanceLeft >= 0 ? stickyDistanceLeft : 0,
            usingAbsolute: true,
            waitingForUpdate: false,
            // TODO: according to spec. this should be the nearest ancestor with a scrolling box, not parent
            $viewport: findClosestParentWithScrollbar($this)
            // $this.parent()
          }
          // generate placeholder

          /*
          // version without deep cloning:

          var height = $this.outerHeight(true);
          var width = $this.outerWidth(true);
          var position = $this.css('position');
          position = position ? "position: " + position + "; " : '';
          data.$placeholder = $($this.get(0).cloneNode(false)).css({ 'z-index': "-1000", height: height, width: width, display: 'none' });
          data.$placeholder = $($this.get(0).cloneNode(false)).css({ 'z-index': "-1000", display: 'none' });
          //$this.after('<div id="position-sticky-' + data.id + '" style="z-index: -1; ' + position + ' height: ' + height + 'px; width: ' + width + ' px; display: none;"></div>');
          //data.$placeholder = $('#position-sticky-' + data.id);
          */
          data.$placeholder = $this.clone().css({ 'z-index': "-1000", display: 'none', visibility: 'hidden' });
          $this.after(data.$placeholder);
          $this.data("position:sticky", data);
          polyfilledElements[uniqueID] = $this;
        }

        updateAbsoluteValues($this);
        console.log(data);
        triggerChange($this, true);
        var $window = $(window);
        $window.on("scroll.position:sticky:" + data.id, function() { triggerChange($this, true) })
        $window.on("resize.position:sticky:" + data.id, function() { triggerChange($this, true) })
        // if the viewport isn't the document itself
        if (data.$viewport.get(0) !== document.body)
        {
          data.$viewport.on("scroll.position:sticky:" + data.id, function() { triggerChange($this, false) })

          // HACK: enable scrolling with touch on Chrome/WebKit/WebView
          data.$viewport.on("touchmove.position:sticky:" + data.id, function(e) { onTouchMove(e, data) })
          data.$viewport.on(['touchend', 'touchcancel', 'touchleave', ''].join('.position:sticky:' + data.id + ' '), function(e) { onTouchEnd(e, data) })

          //apply to parent:
          if (window.navigator.userAgent.indexOf('MSIE ') == -1 && window.navigator.userAgent.indexOf('Trident/') == -1)
          {
            $this.on('wheel.position:sticky:" + data.id', function(e){ onWheel(e, data) });
          }
        }
      })
    })
  }

  function undoUnmatched(rules) {
    rules.each(function(rule) {
      var $elements = $(rule.getSelectors())
      $elements.each(function() {
        var $this = $(this)
          , data = $(this).data("position:sticky")
        if (data) {
          if (data.$placeholder) {
            data.$placeholder.remove()
            // reset
            $this.css("visibility", "visible")
          }
          $(window).off(".position:sticky:" + data.id)
          $this.removeData("position:sticky")
        }
      })
    })
  }

  Polyfill({
    declarations:["position:sticky"],
    include: ["position-sticky"]
  })
    .doMatched(doMatched)
    .undoUnmatched(undoUnmatched)

}(jQuery))
