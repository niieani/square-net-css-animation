// helper functions:

/*
 Duplicates of a are preserved.
 */
'use strict';

var _get = function get(_x21, _x22, _x23) { var _again = true; _function: while (_again) { var object = _x21, property = _x22, receiver = _x23; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x21 = parent; _x22 = property; _x23 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function intersect(a, b) {
  var result = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = a[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var element = _step.value;

      if (b.indexOf(element) !== -1) result.push(element);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return result;
}

function timeout(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

// global config
var TREE_THICKNESS = 2;

// classes

var TreeNode = (function () {
  function TreeNode(treeLine) {
    var virtual = arguments[1] === undefined ? false : arguments[1];

    _classCallCheck(this, TreeNode);

    this.size = 0;
    this.treeLine = treeLine;
    this.normalize = false;

    if (!virtual) {
      this.lineElement = document.createElement('div');
      this.lineElement.className += this.treeLine.classes;
      this.treeLine.treeElement.appendChild(this.lineElement);
    } else // dummy element
      {
        this.lineElement = { className: '', style: {} };
        this.extendLine(false);
      }
  }

  _createClass(TreeNode, [{
    key: 'extendLine',
    value: function extendLine(withoutThickness) {
      this.size += this.treeLine.extendBy - (withoutThickness ? TREE_THICKNESS : 0);
    }
  }, {
    key: 'reversalMultiplier',
    get: function get() {
      return this.normalize ? -1 : 1;
    }
  }]);

  return TreeNode;
})();

var TreeVerticalNode = (function (_TreeNode) {
  function TreeVerticalNode(lifeTree, startX, startY, growDirection, prevDirection) {
    var virtual = arguments[5] === undefined ? false : arguments[5];

    _classCallCheck(this, TreeVerticalNode);

    _get(Object.getPrototypeOf(TreeVerticalNode.prototype), 'constructor', this).call(this, lifeTree, virtual);

    this.lineElement.className += ' line vertical ' + growDirection + ' prev-' + prevDirection + ' startX-' + startX + ' startY-' + startY;

    if (prevDirection === 'right') // natural
      startX = startX - TREE_THICKNESS;

    this.lineElement.style.left = startX + 'px';

    switch (growDirection) {
      case 'down':
        this.lineElement.style.top = startY + 'px';
        break;

      case 'up':
        startY = -startY;
        startY = startY - TREE_THICKNESS;
        this.normalize = true;
        this.lineElement.style.bottom = startY + 'px';
        this.lineElement.style.marginBottom = this.treeLine.boundaryY + 'px';
        break;
    }

    this.initialX = startX;
    this.initialY = startY;
  }

  _inherits(TreeVerticalNode, _TreeNode);

  _createClass(TreeVerticalNode, [{
    key: 'extendLine',
    value: function extendLine(withoutThickness) {
      _get(Object.getPrototypeOf(TreeVerticalNode.prototype), 'extendLine', this).call(this, withoutThickness);
      //let line = this;
      //line.lineElement.style.height = this.size + 'px';
      if (this.lineElement !== null) this.lineElement.style.height = this.size + 'px';else console.log('interesting case', this);
    }
  }, {
    key: 'lastY',
    get: function get() {
      return (this.initialY + this.size) * this.reversalMultiplier;
    }
  }, {
    key: 'lastX',
    get: function get() {
      return this.initialX;
    }
  }]);

  return TreeVerticalNode;
})(TreeNode);

var TreeHorizontalNode = (function (_TreeNode2) {
  function TreeHorizontalNode(lifeTree, startX, startY, growDirection, prevDirection) {
    var virtual = arguments[5] === undefined ? false : arguments[5];

    _classCallCheck(this, TreeHorizontalNode);

    _get(Object.getPrototypeOf(TreeHorizontalNode.prototype), 'constructor', this).call(this, lifeTree, virtual);

    this.lineElement.className += ' line horizontal ' + growDirection + ' prev-' + prevDirection + ' startX-' + startX + ' startY-' + startY;

    if (prevDirection === 'down') // natural
      startY = startY - TREE_THICKNESS;

    this.lineElement.style.top = startY + 'px';

    switch (growDirection) {
      case 'right':
        this.lineElement.style.left = startX + 'px';
        break;

      case 'left':
        startX = -startX; // denormalize
        startX = startX - TREE_THICKNESS;
        this.normalize = true;
        this.lineElement.style.right = startX + 'px';
        this.lineElement.style.marginRight = this.treeLine.boundaryX + 'px';

        break;
    }

    this.initialX = startX;
    this.initialY = startY;
  }

  _inherits(TreeHorizontalNode, _TreeNode2);

  _createClass(TreeHorizontalNode, [{
    key: 'extendLine',
    value: function extendLine(withoutThickness) {
      _get(Object.getPrototypeOf(TreeHorizontalNode.prototype), 'extendLine', this).call(this, withoutThickness);
      //let line = this;
      //line.lineElement.style.width = this.size + 'px';
      if (this.lineElement !== null) this.lineElement.style.width = this.size + 'px';else console.log('interesting case', this);
    }
  }, {
    key: 'lastY',
    get: function get() {
      return this.initialY;
    }
  }, {
    key: 'lastX',
    get: function get() {
      return (this.initialX + this.size) * this.reversalMultiplier;
    }
  }]);

  return TreeHorizontalNode;
})(TreeNode);

var TreeLine = (function () {
  function TreeLine(lifeTree) {
    var extendBy = arguments[1] === undefined ? 20 : arguments[1];
    var startX = arguments[2] === undefined ? 0 : arguments[2];
    var startY = arguments[3] === undefined ? 0 : arguments[3];
    var boundaryX = arguments[4] === undefined ? null : arguments[4];
    var boundaryY = arguments[5] === undefined ? null : arguments[5];
    var iterations = arguments[6] === undefined ? 60 : arguments[6];
    var fadeThreshold = arguments[7] === undefined ? 30 : arguments[7];
    var classes = arguments[8] === undefined ? '' : arguments[8];
    var interval = arguments[9] === undefined ? 300 : arguments[9];
    var directions = arguments[10] === undefined ? ['down', 'left', 'right'] : arguments[10];
    var startDirection = arguments[11] === undefined ? 'down' : arguments[11];
    var avoidElements = arguments[12] === undefined ? [] : arguments[12];

    _classCallCheck(this, TreeLine);

    this.treeElement = lifeTree;
    this.nodes = [];
    this.extendBy = extendBy;
    this.iterations = iterations;
    this.interval = interval;
    this.classes = classes;
    this.boundaryX = boundaryX;
    this.boundaryY = boundaryY;
    this.types = directions;
    this.fadeThreshold = fadeThreshold;
    this.killSwitch = false;
    this.startedFading = false;
    this.avoidElements = avoidElements;
    this.debug = false;

    //this.types = ['up', 'down', 'left', 'right']; //'down',
    //this.types = ['down', 'left'];
    //this.addNode(startX, startY, 'up');
    this.addNode(startX, startY, startDirection);
  }

  _createClass(TreeLine, [{
    key: 'getPossibleTypes',
    value: function getPossibleTypes(prevType) {
      var possibleTypes = undefined;
      if (prevType === 'left') possibleTypes = ['up', 'down', 'left'];
      if (prevType === 'right') possibleTypes = ['up', 'down', 'right'];
      if (prevType === 'up') possibleTypes = ['up', 'left', 'right'];
      if (prevType === 'down') possibleTypes = ['down', 'left', 'right'];

      //console.log(this.types, possibleTypes);
      return intersect(this.types, possibleTypes);
    }
  }, {
    key: 'getRandomType',
    value: function getRandomType(prevType) {
      var possibleTypes = this.getPossibleTypes(prevType);
      return possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
      /*
      let nextType;
       do nextType = this.types[Math.floor(Math.random() * this.types.length)];
      while ((prevType === 'left' && nextType === 'right') || (prevType === 'right' && nextType === 'left') || (prevType === 'up' && nextType === 'down') || (prevType === 'down' && nextType === 'up') || (prevType === 'up' && nextType === 'up') || (prevType === 'down' && nextType === 'down'));
      // || (prevType === 'up' && nextType === 'up') || (prevType === 'down' && nextType === 'down')
       return nextType;
      */
    }
  }, {
    key: 'getRandomTypeWithinBoundaries',
    value: function getRandomTypeWithinBoundaries(startX, startY, prevType) {
      var nextType = undefined;
      var testedTypes = [];
      var possibleTypesCount = this.getPossibleTypes(prevType).length;

      //console.log(this.getPossibleTypes(prevType));

      do {
        if (testedTypes.length > 1) console.log('avoiding out of boundaries type', testedTypes[testedTypes.length - 1]);

        if (testedTypes.length >= possibleTypesCount) {
          console.log('something went wrong when finding a type that will fit between the boundaries', '(did you put the start point in the middle of a forbidden area?');
          // let's allow random type to navigate towards the boundaries anyway (after some wandering...)
          return this.getRandomType(prevType);
        }

        do {
          nextType = this.getRandomType(prevType);
        } while (testedTypes.indexOf(nextType) > -1 && testedTypes.length < possibleTypesCount);
        testedTypes.push(nextType);
      } while (!this.okBoundaries(startX, startY, nextType, prevType));

      return nextType;
    }
  }, {
    key: 'okBoundaries',
    value: function okBoundaries(startX, startY, type, prevType) {
      var treeLine = this;
      var virtualNode = treeLine.getNode(startX, startY, type, prevType, true);

      // lines don't go outside self
      if (virtualNode.lastX < 0 || virtualNode.lastY < 0) return false;

      // no definitions - let's allow everything else
      if ((this.boundaryX == 0 || this.boundaryY == 0) && this.avoidElements.length === 0) return true;

      //console.log("Testing: ", type, "CurrX/X/Xb", startX, virtualNode.lastX, "CurrY/Y/Yb", startY, virtualNode.lastY);
      if (treeLine.debug) console.log('Testing: ', type, 'CurrX/X/Xb', startX, virtualNode.lastX, this.boundaryX, 'CurrY/Y/Yb', startY, virtualNode.lastY, this.boundaryY);
      // boundary test first
      if (this.boundaryX != 0 && this.boundaryY != 0) {
        if (virtualNode.lastX > this.boundaryX || virtualNode.lastY > this.boundaryY) return false;
      }

      if (this.avoidElements.length !== 0) {
        // let's see if we can avoid elements
        var selfBoundaries = treeLine.treeElement.getBoundingClientRect();

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = treeLine.avoidElements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var elementDescription = _step2.value;

            var element = elementDescription.element;
            var boundaries = element.getBoundingClientRect();
            //.getPropertyValue("height");
            var boundaryLeft = Math.round(boundaries.left - selfBoundaries.left);
            var boundaryRight = Math.round(boundaries.right - selfBoundaries.left);
            var boundaryTop = Math.round(boundaries.top - selfBoundaries.top);
            var boundaryBottom = Math.round(boundaries.bottom - selfBoundaries.top);

            /*
            let computedStyle = window.getComputedStyle(element);
            if (elementDescription.allowBorder)
            {
              boundaryLeft += parseInt(computedStyle.getPropertyValue("border-left-width"));
              boundaryRight -= parseInt(computedStyle.getPropertyValue("border-right-width"));
              boundaryTop += parseInt(computedStyle.getPropertyValue("border-top-width"));
              boundaryBottom -= parseInt(computedStyle.getPropertyValue("border-bottom-width"));
            }
            if (elementDescription.allowMargin) // TODO: actually, I think it doesn't add margin already, so we need to do the reverse - if FALSE then we substract
            {
              boundaryLeft += parseInt(computedStyle.getPropertyValue("margin-left"));
              boundaryRight -= parseInt(computedStyle.getPropertyValue("margin-right"));
              boundaryTop += parseInt(computedStyle.getPropertyValue("margin-top"));
              boundaryBottom -= parseInt(computedStyle.getPropertyValue("margin-bottom"));
            }
            if (elementDescription.allowPadding)
            {
              boundaryLeft += parseInt(computedStyle.getPropertyValue("padding-left"));
              boundaryRight -= parseInt(computedStyle.getPropertyValue("padding-right"));
              boundaryTop += parseInt(computedStyle.getPropertyValue("padding-top"));
              boundaryBottom -= parseInt(computedStyle.getPropertyValue("padding-bottom"));
            }
            */
            //if (treeLine.debug)
            //console.log("element boundaries", boundaryLeft, boundaryRight, boundaryTop, boundaryBottom, boundaries, selfBoundaries);

            if (virtualNode.lastX > boundaryLeft && virtualNode.lastX < boundaryRight && (virtualNode.lastY > boundaryTop && virtualNode.lastY < boundaryBottom)) return false; // TODO: would be great to add *by how much* we miss, and pick the one that misses the least
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      return true;
    }
  }, {
    key: 'getNode',
    value: function getNode(startX, startY, type, prevType) {
      var virtual = arguments[4] === undefined ? false : arguments[4];

      var node = undefined;
      if (type === 'up' || type === 'down') node = new TreeVerticalNode(this, startX, startY, type, prevType, virtual);else // left or right
        node = new TreeHorizontalNode(this, startX, startY, type, prevType, virtual);
      return node;
    }
  }, {
    key: 'addNode',
    value: function addNode(startX, startY) {
      var type = arguments[2] === undefined ? 'up' : arguments[2];
      var prevType = arguments[3] === undefined ? 'up' : arguments[3];
      var treeLine, node, nextType;
      return regeneratorRuntime.async(function addNode$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            treeLine = this;

            if (!(treeLine.killSwitch === true)) {
              context$2$0.next = 4;
              break;
            }

            if (treeLine.startedFading === false) treeLine.startFadingAtNode(0);
            return context$2$0.abrupt('return');

          case 4:
            node = treeLine.getNode(startX, startY, type, prevType, false);

            //if (treeLine.debug)
            //console.log('adding node X & Y', type, startX, startY, node);
            treeLine.nodes.push(node);

          case 6:
            if (!(treeLine.nodes.length < treeLine.iterations && treeLine.killSwitch === false)) {
              context$2$0.next = 23;
              break;
            }

            if (treeLine.nodes.length > 1 && treeLine.fadeThreshold >= 0 && treeLine.nodes.length === treeLine.fadeThreshold) {
              treeLine.startFadingAtNode(0);
            }

            context$2$0.next = 10;
            return regeneratorRuntime.awrap(timeout(treeLine.interval));

          case 10:
            node.extendLine(false);

            nextType = treeLine.getRandomTypeWithinBoundaries(node.lastX, node.lastY, type);

          case 12:
            if (!(type === nextType)) {
              context$2$0.next = 19;
              break;
            }

            context$2$0.next = 15;
            return regeneratorRuntime.awrap(timeout(treeLine.interval));

          case 15:
            node.extendLine(true);
            //nextType = treeLine.getRandomType(type);
            nextType = treeLine.getRandomTypeWithinBoundaries(node.lastX, node.lastY, type);
            context$2$0.next = 12;
            break;

          case 19:
            context$2$0.next = 21;
            return regeneratorRuntime.awrap(treeLine.addNode(node.lastX, node.lastY, nextType, type, false));

          case 21:
            context$2$0.next = 6;
            break;

          case 23:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'startFadingAtNode',
    value: function startFadingAtNode(nodeNum) {
      var treeLine, nodeToDestroy, elementToDestroy;
      return regeneratorRuntime.async(function startFadingAtNode$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            treeLine = this;

            treeLine.startedFading = true;

            nodeToDestroy = treeLine.nodes[nodeNum];

            if (!(nodeToDestroy === null)) {
              context$2$0.next = 6;
              break;
            }

            console.log('node already destroyed, current count:', nodeNum, treeLine.nodes.length);
            return context$2$0.abrupt('return');

          case 6:
            elementToDestroy = nodeToDestroy.lineElement;

            elementToDestroy.className += ' fade-out';

            context$2$0.next = 10;
            return regeneratorRuntime.awrap(timeout(treeLine.interval * 2));

          case 10:

            if (this.nodes.length - 1 >= nodeNum + 1) {
              treeLine.startFadingAtNode(nodeNum + 1);
            }
            // TODO:
            else if (this.killSwitch === true && this.nodes.length === 0) // all lines removed, finally remove the tree div:
              {
                setTimeout(function () {
                  treeLine.treeElement.parentNode.removeChild(treeLine.treeElement);
                  // GC
                  treeLine.treeElement = null;
                }, treeLine.interval * 10);
              }
            // else
            // {
            //   treeLine.startFadingAtNode(nodeNum);
            // }

            setTimeout(function () {
              elementToDestroy.parentNode.removeChild(elementToDestroy);
              // GC
              treeLine.nodes[nodeNum].lineElement = null;
              treeLine.nodes[nodeNum] = null;
              //treeLine.nodes.splice(nodeNum, 1);
            }, treeLine.interval * 10);

          case 12:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return TreeLine;
})();

var TreeBuilder = function TreeBuilder(objectToBuildOn) {
  var colorsToBuild = arguments[1] === undefined ? ['color-dark-blue'] : arguments[1];
  var avoid = arguments[2] === undefined ? [] : arguments[2];

  _classCallCheck(this, TreeBuilder);

  this.builtObjects = [];

  var rect = objectToBuildOn.getBoundingClientRect();
  var extendBy = 100;

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = colorsToBuild[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var color = _step3.value;

      var hoverTree = document.createElement('div');
      hoverTree.className += ' life-tree';
      var hoverTreeWidth = Math.round(rect.right - rect.left) + extendBy * 2;
      //var hoverTreeHeight = 60;
      var hoverTreeHeight = Math.round(rect.bottom - rect.top) + extendBy * 2;
      //hoverTree.style.top = Math.round(rect.bottom)-10 + "px";
      hoverTree.style.top = Math.round(rect.top) - extendBy + 'px';
      //hoverTree.style.top = 30 + "px";
      hoverTree.style.left = Math.round(rect.left) - extendBy + 'px';
      hoverTree.style.width = hoverTreeWidth + 'px';
      hoverTree.style.height = hoverTreeHeight + 'px';
      hoverTree.style.zIndex = -1;
      document.body.appendChild(hoverTree);

      var treeLine = new TreeLine(hoverTree, // div
      20, // extend size
      Math.round(hoverTreeWidth / 2), // startX
      Math.round(hoverTreeHeight / 2), // start Y
      //0, // startX
      //0, // start Y
      hoverTreeWidth, // boundaryX
      hoverTreeHeight, // boundaryY
      5500, // iterations
      10, // interation fade treshold, -1 off
      // 'color-red',  // classes
      // 'color-dark-blue',  // classes
      color, 100, // interval
      //['down', 'down', 'up', 'left', 'right'], // probability of directions
      ['down', 'up', 'left', 'right'], // probability of directions
      'down', // first
      avoid
      // [
      // {
      //   element: this,
      //   allowMargin: true,
      //   allowPadding: true,
      //   allowBorder: true
      // }
      // ]
      );
      this.builtObjects.push(treeLine);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3['return']) {
        _iterator3['return']();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
};

//while (type === 'left' && nextType === 'left' || type === 'right' && nextType === 'right' || type === 'down' && nextType === 'down' || type === 'up' && nextType === 'up')

// console.log("fading?", this.nodes.length-1, nodeNum+1);

// querySelector = document.querySelector.bind(document);
// querySelectorAll = document.querySelectorAll.bind(document);
// body = document.body;