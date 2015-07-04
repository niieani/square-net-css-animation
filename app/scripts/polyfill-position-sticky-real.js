"use strict";
// http://dev.w3.org/csswg/css-position/#sticky-pos

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
      setPositions($el, parentScrollTrigger);

      //data.waitingForUpdate = false;
      // Don’t update until next animation frame if we can, otherwise use a
      // timeout - either will help avoid too many repaints
      if (requestAnimationFrame) {
        requestAnimationFrame(function(){setPositions($el, parentScrollTrigger)});
      }
      else {
        // TODO: replace with real shim
        setTimeout(function(){setPositions($el, parentScrollTrigger)}, 15);
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
    //console.log($el.get(0).classList);

    var data = $el.data("position:sticky");
    if (!data) return;

    // TODO: is this needed?
    // var otherCase = viewportScrollLeft >= data.absDistanceFromParentsLeft - data.stickyDistanceLeft;
    var otherCase = false;

    // Fix for <HTML> with margin
    var viewportDistanceFromWindowTop = data.$viewport.get(0) === document.body ? 0 : data.$viewport.get(0).getBoundingClientRect().top;
    // TODO: left ?
    var viewportDistanceFromWindowLeft = data.$viewport.get(0) === document.body ? 0 : data.$viewport.get(0).getBoundingClientRect().left;

    var parentDistanceFromWindowTop = $el.parent().get(0).getBoundingClientRect().top;
    // fetch the position of the placeholder
    var placeholderDistanceFromWindowTop = data.usingAbsolute ? $el.get(0).getBoundingClientRect().top : data.$placeholder.get(0).getBoundingClientRect().top;
    //var placeholderDistanceFromParentTop = placeholderDistanceFromWindowTop - parentDistanceFromWindowTop;
    var placeholderDistanceFromViewPortTop = placeholderDistanceFromWindowTop - viewportDistanceFromWindowTop;

    var realScrolledDistanceFromViewportTop;
    if (data.$viewport.get(0) === document.body)
    {
      // TODO: add check for scrollbar on 'Y-axis'
      realScrolledDistanceFromViewportTop = -parentDistanceFromWindowTop;
    }
    else
    {
      realScrolledDistanceFromViewportTop = data.$viewport.scrollTop();
    }

    //console.log('realScrolledDistanceFromViewportTop', realScrolledDistanceFromViewportTop);
    //console.log('viewportDistanceFromWindowTop', viewportDistanceFromWindowTop);
    //console.log('placeholderDistanceFromWindowTop', placeholderDistanceFromWindowTop);
    //console.log('parentDistanceFromWindowTop', parentDistanceFromWindowTop);
    //console.log('placeholderDistanceFromParentTop', placeholderDistanceFromParentTop);

    if (placeholderDistanceFromViewPortTop <= data.stickyDistanceTop)
    {
      if (data.usingAbsolute || parentScrollChanged || otherCase)
      {
        //console.log('setting position:', 'stuck', viewportScrollTop, data.stickyDistanceTop, 'parent changed?', parentScrollChanged);

        data.$placeholder.css('display', '');
        $el.css('position', 'fixed');

        var placeholderOuterHeight = data.$placeholder.outerHeight();
        var placeholderOuterWidth = data.$placeholder.outerWidth();

        $el.css('display', '');

        var visibilityThreshold = realScrolledDistanceFromViewportTop + placeholderOuterHeight + data.stickyDistanceTop;
        var parentTotalHeight = $el.parent().get(0).scrollHeight;
        var invisiblePartOfElement = data.$placeholder.outerHeight() + data.stickyDistanceTop - $el.parent().get(0).getBoundingClientRect().height;
        invisiblePartOfElement = invisiblePartOfElement > 0 ? invisiblePartOfElement : 0;

        var maximumTop = viewportDistanceFromWindowTop + data.stickyDistanceTop;

        // FIXME
        // total height
        if (visibilityThreshold > parentTotalHeight && $el.parent().get(0) !== data.$viewport.get(0))
        {
          if (visibilityThreshold - parentTotalHeight > placeholderOuterHeight + data.stickyDistanceTop)
          {
            console.log('visibility threshold passed');
            $el.css('display', 'none');
            //$el.css('top', '');
          }
          else
          {
            console.log('visibility threshold approaching');
            // TODO: substract padding?
            $el.css('top', viewportDistanceFromWindowTop + parentTotalHeight - realScrolledDistanceFromViewportTop - placeholderOuterHeight + 'px');
          }
        }
        else
        {
          //console.log('elements visible, viewport distance + sticky distance applied')
          $el.css('top', maximumTop + 'px');
        }

        // TODO: left ?
        //$el.css('left', viewportDistanceFromWindowLeft + data.stickyDistanceLeft);
        //$el.css('left', viewportDistanceFromWindowLeft + 'px');


        var $body = $(document.html);
        var bodyMarginLeft = parseInt($body.css('margin-left')) + parseInt($body.css('padding-left')) + parseInt($body.css('border-left-width'));
        var thisMarginLeft = parseInt(data.$placeholder.css('margin-left')) + parseInt(data.$placeholder.css('padding-left')) + parseInt(data.$placeholder.css('border-left-width'));
        var bodyMarginRight = parseInt($body.css('margin-right')) + parseInt($body.css('padding-right')) + parseInt($body.css('border-right-width'));
        $el.css('left', data.$placeholder.offset().left + bodyMarginLeft + bodyMarginRight + thisMarginLeft + 'px');

        // outerWidth() / width() ?
        $el.css('width', data.$placeholder.outerWidth() + 'px');
        //var marginLeft = parseInt(data.$placeholder.css('margin-left'));
        //var marginRight = parseInt(data.$placeholder.css('margin-right'));
        //var thisWidth = parseInt(data.$placeholder.css('width'));
        //var thisWidth = data.$placeholder.outerWidth() - parseInt(data.$placeholder.css('padding-left')) - parseInt(data.$placeholder.css('border-left-width')) - parseInt(data.$placeholder.css('padding-right')) - parseInt(data.$placeholder.css('border-right-width'));
        //var thisWidth = data.$placeholder.width() + parseInt(data.$placeholder.css('margin-left')) + parseInt(data.$placeholder.css('margin-right'));
        //$el.css('width', thisWidth + marginLeft + marginRight + 'px');
        //console.log(thisWidth);
        //$el.css('width', thisWidth + 'px');
        //$el.css('width', 300 + 'px');
        $el.css('margin', '0');

        // this is a fix for overflowing when element fixed is out of context
        $el.css('overflow', 'hidden');

        // TODO: should this be .height() or .outer .innerHeight()?
        if (invisiblePartOfElement > 0)
        {
          $el.css('height', data.$placeholder.height() - invisiblePartOfElement + 'px'); // - data.stickyDistanceTop
        }

        $el.addClass('stuck');
        data.usingAbsolute = false;
      }
      data.waitingForUpdate = false;
    }
    else
    {
      if (!data.usingAbsolute)
      {
        //console.log('resetting position:', 'absolute', data.stickyDistanceTop);
        $el.removeClass('stuck');
        data.$placeholder.css('display', 'none');

        $el.css('position', data.originalCss.position);
        //$el.css('position', 'static');
        $el.css('top', data.originalCss.top);
        $el.css('left', data.originalCss.left);
        $el.css('width', data.originalCss.width);
        $el.css('margin', data.originalCss.margin);
        $el.css('overflow', data.originalCss.overflow);
        $el.css('height', data.originalCss.height);

        data.usingAbsolute = true;
      }
      data.waitingForUpdate = false;
    }
  }

  // requestAnimationFrame may be prefixed
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame;

  // HACK: enable scrolling with touch on Chrome/WebKit/WebView
  function onTouchMove($el){
    var data = $el.data("position:sticky");
    if (!data) return;

    if (data.pointerEventsEnabled)
    {
      data.pointerEventsEnabled = false;
      polyfilledElements[data.id].css('pointer-events', 'none');
    }
  }
  function onTouchEnd($el){
    var data = $el.data("position:sticky");
    if (!data) return;

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
        , declaration = rule.getDeclaration();
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
            stickyDistanceTop: stickyDistanceTop >= 0 ? stickyDistanceTop : 0,
            stickyDistanceLeft: stickyDistanceLeft >= 0 ? stickyDistanceLeft : 0,
            usingAbsolute: true,
            waitingForUpdate: false,
            // according to spec. this should be the nearest ancestor with a scrolling box, not parent or body
            $viewport: findClosestParentWithScrollbar($this),
            //originalCss: {
            //  top: $this.css('top'),
            //  left: $this.css('left'),
            //  width: $this.css('width'),
            //  height: $this.css('height'),
            //  visibility: $this.css('visibility'),
            //  margin: $this.css('margin'),
            //  overflow: $this.css('overflow'),
            //  position: $this.css('position')
            //}
            originalCss: {
              top: '',
              left: '',
              width: '',
              height: '',
              visibility: '',
              margin: '',
              overflow: '',
              position: ''
            }
          };
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

        triggerChange($this, true);
        var $window = $(window);
        $window.on("scroll.position:sticky:" + data.id, function() { triggerChange($this, true) })
        $window.on("resize.position:sticky:" + data.id, function() { triggerChange($this, true) })
        // if the viewport isn't the document itself
        if (data.$viewport.get(0) !== document.body)
        {
          data.$viewport.on("scroll.position:sticky:" + data.id, function() { triggerChange($this, false) })

          // HACK: enable scrolling with touch on Chrome/WebKit/WebView
          data.$viewport.on("touchmove.position:sticky:" + data.id, function(e) { onTouchMove($this) })
          data.$viewport.on(['touchend', 'touchcancel', 'touchleave', ''].join('.position:sticky:' + data.id + ' '), function(e) { onTouchEnd($this) })

          // apply to parent:
          if (window.navigator.userAgent.indexOf('MSIE ') == -1 && window.navigator.userAgent.indexOf('Trident/') == -1)
          {
            $this.on('wheel.position:sticky:" + data.id', function(e){ onWheel(e, data) });
          }
        }
      })
    })
  }

  function undoUnmatched(rules) {
    // TODO:
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
