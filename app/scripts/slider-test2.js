"use strict";

var stickIt = function(stick, frame, offset)
{
  var useAbsolute = true;

  // requestAnimationFrame may be prefixed
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame;

  var originalHeight = stick.height();
  originalHeight = originalHeight >= 0 ? originalHeight : 0;
  console.log('height', originalHeight);
  var originalTop = stick.css('top');
  var originalTopAuto = false;
  if (originalTop === 'auto') originalTopAuto = true;
  originalTop = parseInt(originalTop);
  console.log('top', stick.css('top'));
  originalTop = originalTop >= 0 ? originalTop : 0;

  //originalTop = originalTop - offset;
//var originalTopReal = stick.top

  var originalTopReal = 0;

//console.log(originalTop)
  var timeout = null;
  var waitingForUpdate = false;

  var setDefaultPositions = function() {
    var scrollAt = frame.scrollTop();
    // new Height Again
    var newHeight = originalHeight - scrollAt + offset;
    newHeight = newHeight < 0 ? 0 : newHeight;
    newHeight = newHeight > originalHeight ? originalHeight : newHeight;
    stick.css('height', newHeight);


    stick.css('position', 'absolute');
    console.log('returned to normal', originalTop + originalHeight - newHeight);
    if (scrollAt >= offset)
    {
      stick.css('top', originalTop + (originalHeight - newHeight) + 'px');
    }
    else
    {
      stick.css('top', originalTop + 'px');
    }
    stick.css('pointer-events', 'auto');
    timeout = null;
  };

  var setPositions = function() {
    console.log('setting positions');
    var scrollAt = frame.scrollTop();

    if (timeout !== null) {
      clearTimeout(timeout);
      // still during scroll continues...
    }

      requestAnimationFrame(function()
      {
        setDefaultPositions();
      });


    waitingForUpdate = false;
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
var frame = $('.frame');

stickIt(stickOne, frame, 0);
stickIt(stickTwo, frame, 300);
