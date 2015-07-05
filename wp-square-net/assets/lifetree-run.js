"use strict";

(function () {
  "use strict";

  var querySelector = document.querySelector.bind(document);
  var querySelectorAll = document.querySelectorAll.bind(document);

  var body = document.body;

  var avoid = Array.prototype.slice.call(querySelectorAll("nav")).concat(Array.prototype.slice.call(querySelectorAll("button"))).concat(Array.prototype.slice.call(querySelectorAll("h1")));

  var avoidArray = avoid.map(function (element) {
    return {
      element: element,
      allowMargin: true,
      allowPadding: true,
      allowBorder: true
    };
  });
  // LIFE TREE
  //var lifeTree = new TreeBuilder(querySelector("#et-main-area"), ["color-dark-blue", "color-red", "color-violet"], avoidArray);

  // var targets = Array.prototype.slice.call(querySelectorAll('.hello')).concat(Array.prototype.slice.call(querySelectorAll('.navdrawer-container a')));
  var targets = querySelectorAll("#top-menu-nav a");
  var header = querySelector('#main-header');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function () {
      var target = _step.value;
      // TODO
      // for (let i = 0; i < targets.length; ++i) {
      // let target = targets[i];
      target.addEventListener("mouseover", function () {
        var rect = this.getBoundingClientRect();

        var extendByHeight = 100;
        var extendByWidth = 200;

        var hoverTree = document.createElement("div");
        hoverTree.className += " life-tree hover-tree";
        var hoverTreeWidth = Math.round(rect.right - rect.left) + extendByWidth * 2;
        //var hoverTreeHeight = 60;
        var hoverTreeHeight = Math.round(rect.bottom - rect.top) + extendByHeight * 2;
        //hoverTree.style.top = Math.round(rect.bottom)-10 + "px";
        hoverTree.style.top = Math.round(rect.top) - extendByHeight + "px";
        //hoverTree.style.top = 30 + "px";
        hoverTree.style.left = Math.round(rect.left) - extendByWidth + "px";
        hoverTree.style.width = hoverTreeWidth + "px";
        hoverTree.style.height = hoverTreeHeight + "px";
        //hoverTree.style.zIndex = -1;
        body.appendChild(hoverTree);
        var treeLine = new TreeLine(hoverTree, // div
        20, // extend size
        Math.round(hoverTreeWidth / 2), // startX
        Math.round(hoverTreeHeight / 2) + 15, // start Y
        hoverTreeWidth, // boundaryX
        hoverTreeHeight, // boundaryY
        5500, // iterations
        1, // interation fade treshold, -1 off
        //'color-red',  // classes
        "color-dark-blue", // classes
        20, // interval
        //['down', 'down', 'up', 'left', 'right'], // probability of directions
        ["down", "up", "left", "right"], // probability of directions
        "down", // first
        [{
          element: this,
          allowMargin: true,
          allowPadding: true,
          allowBorder: true
        },
        {
          element: header,
          allowMargin: true,
          allowPadding: true,
          allowBorder: true
        }
        ]);
        target.addEventListener("mouseout", function () {
          treeLine.killSwitch = true;
          if (treeLine.startedFading === false)
            treeLine.startFadingAtNode(0);
        });

        //console.log(rect.top, rect.right, rect.bottom, rect.left);
      });
    };

    for (var _iterator = targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
})();