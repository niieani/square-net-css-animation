"use strict";

var stickIt = function(stick, frame, initialTopOffset)
{
  //var useAbsolute = false;

  // requestAnimationFrame may be prefixed
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame;

  var pointerEventsEnabled = true;

  // HACK: enable scrolling with touch on Chrome/WebKit/WebView
  frame.on('touchmove', function(e){
    if (pointerEventsEnabled)
    {
      pointerEventsEnabled = false;
      stick.css('pointer-events', 'none');
    }
  });
  frame.on('touchend touchcancel touchleave', function(e){
    stick.css('pointer-events', ''); // restore defaults
    pointerEventsEnabled = true;
  });

  // HACK: enable scrolling with mouse on Chrome
  if (window.navigator.userAgent.indexOf('MSIE ') == -1 && window.navigator.userAgent.indexOf('Trident/') == -1)
  {
    stick.on('wheel', function(e){
      //console.log("trigerred", e.originalEvent);
      var newEvent = new WheelEvent(e.originalEvent.type, e.originalEvent);
      //console.log("copied", newEvent);
      frame.get(0).dispatchEvent(newEvent);
      return false;
    });
  }

  var originalHeight = stick.height();
  originalHeight = originalHeight >= 0 ? originalHeight : 0;
  console.log('height', originalHeight);

  //var originalTop = stick.css('top');
  //var originalLeft = stick.css('left');
  /*
  var originalTopAuto = false;
  if (originalTop === 'auto') originalTopAuto = true;
  originalTop = parseInt(originalTop);
  console.log('top', stick.css('top'));
  originalTop = originalTop >= 0 ? originalTop : 0;
  */

  //originalTop = originalTop - initialTopOffset;
//var originalTopReal = stick.top

  //var originalTopReal = 0;

//console.log(originalTop)

  var realAbsoluteValues, originalTopReal, originalLeftReal

  var updateAbsoluteValues = function(){
    realAbsoluteValues = stick.get(0).getBoundingClientRect();
    originalTopReal = realAbsoluteValues.top;
    originalLeftReal = realAbsoluteValues.left;
  };

  var timeout = null;
  var waitingForUpdate = false;

  var setDefaultPositions = function() {
    var scrollAt = frame.scrollTop();
    var scrollLeftAt = frame.scrollLeft();
    // new Height Again
    var newHeight = originalHeight - scrollAt + initialTopOffset;
    newHeight = newHeight < 0 ? 0 : newHeight;
    newHeight = newHeight > originalHeight ? originalHeight : newHeight;
    //stick.css('height', newHeight);

    stick.removeClass('stuck');
    stick.css('position', 'absolute');
    console.log('returned to normal, absolute');
    /*
    if (scrollAt >= initialTopOffset)
    {
      //stick.css('top', originalTop + (originalHeight - newHeight) + 'px');
      stick.css('top', scrollAt + 'px');
      stick.css('left', scrollLeftAt + 'px');
    }
    else
    {
    */
      //stick.css('top', originalTop + 'px');
      stick.css('top', '');
      stick.css('left', '');
    //}

    //nonFixed = false;
    updateAbsoluteValues();

    //stick.css('pointer-events', 'auto');
    timeout = null;
  };

  var setPositions = function() {
    console.log('setting positions');
    var scrollAt = frame.scrollTop();

    if (timeout !== null) {
      clearTimeout(timeout);
      // still during scroll continues...
    }

    //originalTopReal = stick.offset().top - $(window).scrollTop();

    if (scrollAt >= initialTopOffset)
    //if (false)
    {

      stick.css('position', 'fixed');
      //stick.css('pointer-events', 'none');

      var newHeight = originalHeight - scrollAt + initialTopOffset;
      newHeight = newHeight < 0 ? 0 : newHeight;
      newHeight = newHeight > originalHeight ? originalHeight : newHeight;
      //stick.css('height', newHeight);

      /*
      if (scrollAt <= initialTopOffset)
      {
        // TODO: implement
        stick.css('top', originalTopReal - (originalHeight - newHeight) + 'px');
      }
      else
      {
        stick.css('top', originalTopReal + 'px');
      }
      */
      //stick.css('top', 'auto');
      stick.css('top', originalTopReal + 'px');
      stick.css('left', originalLeftReal + 'px');
      stick.addClass('stuck');
      waitingForUpdate = false;
    }
    else
    {
      waitingForUpdate = false;
      //if (useAbsolute)
      //{
      //  timeout = setTimeout(function() {
      //    requestAnimationFrame(function(){
      //      setDefaultPositions();
      //    });
      //  }, 200);
      //}
      requestAnimationFrame(function()
      {
        setDefaultPositions();
      });
    }


    /*
     //firstInside.css('margin-top', scrollAt);
     let scrollBefore = second.scrollTop();
     //first.scrollTop(height);
     console.log('scrolled, new top:', scrollAt);
     //if (scrollAt >= height) {
     //  second.scrollTop(scrollBefore + scrollAt - height);
     second.scrollTop(scrollAt);
     //}
     */
  };

  frame.scroll(function(e){
    //console.log(e);
    //var scrollAt = frame.scrollTop();
      // Only trigger a layout change if we’re not already waiting for one
      if (!waitingForUpdate) {
        waitingForUpdate = true;
        // Don’t update until next animation frame if we can, otherwise use a
        // timeout - either will help avoid too many repaints
        if (requestAnimationFrame) {
          requestAnimationFrame(setPositions);
        }
        else {
          setTimeout(setPositions, 15);
        }
      }

    //}
  });
};

var stickOne = $('.one');
var stickTwo = $('.two');
var frame = $('#frame');
var frame2 = $('.frame2');

stickIt(stickOne, frame, 0);
stickIt(stickTwo, frame, 300);


/*
frame.on('touchstart touchend touchcancel touchleave touchmove', function(e){

  console.log("trigerred", e.originalEvent);

  var target = frame2.get(0);
  // http://yuilibrary.com/yui/docs/api/files/event-simulate_js_event-simulate.js.html

  var newEvent = document.createEvent('TouchEvent');
  //console.log()
  var touches = recreateTouchDataWithNewTarget(e.originalEvent.touches, target);
  var targetTouches = recreateTouchDataWithNewTarget(e.originalEvent.targetTouches, target);
  var changedTouches = recreateTouchDataWithNewTarget(e.originalEvent.changedTouches, target);

  // Andoroid isn't compliant W3C initTouchEvent method signature.
  newEvent.initTouchEvent(touches, targetTouches, changedTouches,
    e.originalEvent.type, e.originalEvent.view,
    changedTouches[0].screenX, changedTouches[0].screenY, changedTouches[0].clientX, changedTouches[0].clientY, //screenX, screenY, clientX, clientY,
    e.originalEvent.ctrlKey, e.originalEvent.altKey, e.originalEvent.shiftKey, e.originalEvent.metaKey);
  //var newEvent = new TouchEvent(e.originalEvent.type, e.originalEvent);
  console.log("copied " + newEvent.type, newEvent);

  //newEvent.target = target;
  //newEvent.currentTarget = target;
  //newEvent.delegateTarget = target;
  //newEvent.toElement = target;
  target.dispatchEvent(newEvent);
});
*/
//setInterval(function(){
//  $('#stick1').mouseenter();
//}, 1000);

/*
var theElement = frame.get(0);

theElement.addEventListener("mouseup", tapOrClick, false);
theElement.addEventListener("touchstart touchend touchcancel touchleave touchmove", tapOrClick, false);

function tapOrClick(event) {
  //handle tap or click.

  event.preventDefault();
  return false;
}
*/
/*
$(document).on('wheel', '.stuck', function(e){
  console.log("trigerred", e);
  //var newEvent = e.originalEvent.constructor(e.originalEvent.type, e.originalEvent);
  var newEvent = new WheelEvent(e.originalEvent.type, e.originalEvent);
  console.log("copied mouseEvent", newEvent);
  var target = frame.get(0);
  target.dispatchEvent(newEvent);
  return false;
});


var recreateTouchDataWithNewTarget = function(touchList, newTarget)
{
  var touches = [];
  //for (let touch of touchList)
  for (let touchI = 0; touchI < touchList.length; touchI++)
  {
    let touch = touchList[touchI];
    var touchData = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      force: touch.force,
      identifier: touch.identifier,
      pageX: touch.pageX,
      pageY: touch.pageY,
      radiusX: touch.radiusX,
      radiusY: touch.radiusY,
      screenX: touch.screenX,
      screenY: touch.screenY,
      target: newTarget
    };
    touches.push(document.createTouch(window, newTarget, touch.identifier, touch.pageX, touch.pageY, touch.screenX, touch.screenY, touch.radiusX, touch.radiusY, touch.webkitRotationAngle || 0, touch.force)); //touch.radiusX, touch.radiusY,
    //touches.push(document.createTouch(window, newTarget, touch.identifier, touch.pageX, touch.pageY, touch.screenX, touch.screenY));
  }
  return document.createTouchList.apply(document, touches);
};


$(document).on('touchstart touchend touchcancel touchleave touchmove', '.stuck', function(e){

  console.log("trigerred", e.originalEvent);

  var target = frame.get(0);
  // http://yuilibrary.com/yui/docs/api/files/event-simulate_js_event-simulate.js.html

  var newEvent = document.createEvent('TouchEvent');
  //console.log()
  var touches = recreateTouchDataWithNewTarget(e.originalEvent.touches, target);
  var targetTouches = recreateTouchDataWithNewTarget(e.originalEvent.targetTouches, target);
  var changedTouches = recreateTouchDataWithNewTarget(e.originalEvent.changedTouches, target);

  // Andoroid isn't compliant W3C initTouchEvent method signature.
  newEvent.initTouchEvent(touches, targetTouches, changedTouches,
    e.originalEvent.type, e.originalEvent.view,
    changedTouches[0].screenX, changedTouches[0].screenY, changedTouches[0].clientX, changedTouches[0].clientY, //screenX, screenY, clientX, clientY,
    e.originalEvent.ctrlKey, e.originalEvent.altKey, e.originalEvent.shiftKey, e.originalEvent.metaKey);
  //var newEvent = new TouchEvent(e.originalEvent.type, e.originalEvent);
  console.log("copied " + newEvent.type, newEvent);

  //newEvent.target = target;
  //newEvent.currentTarget = target;
  //newEvent.delegateTarget = target;
  //newEvent.toElement = target;
  target.dispatchEvent(newEvent);
});

*/
