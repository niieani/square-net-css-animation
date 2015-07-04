// helper functions:

/*
 Duplicates of a are preserved.
 */
function intersect(a, b)
{
  let result = [];
  for (let element of a)
  {
    if (b.indexOf(element) !== -1)
      result.push(element);
  }
  return result;
}

function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


// global config
const TREE_THICKNESS = 2;

// classes
class TreeNode {
  constructor(treeLine, virtual = false) {
    this.size = 0;
    this.treeLine = treeLine;
    this.normalize = false;

    if (!virtual)
    {
      this.lineElement = document.createElement('div');
      this.lineElement.className += this.treeLine.classes;
      this.treeLine.treeElement.appendChild(this.lineElement);
    }
    else // dummy element
    {
      this.lineElement = { className: "", style: {} }
      this.extendLine(false);
    }
  }
  extendLine(withoutThickness) {
    this.size += this.treeLine.extendBy - (withoutThickness ? TREE_THICKNESS : 0);
  }
  get reversalMultiplier() {
    return this.normalize ? -1 : 1;
  }
}
class TreeVerticalNode extends TreeNode {
  constructor(lifeTree, startX, startY, growDirection, prevDirection, virtual = false) {

    super(lifeTree, virtual);

    this.lineElement.className += ' line vertical ' + growDirection + ' prev-' + prevDirection + ' startX-' + startX + ' startY-' + startY;

    if (prevDirection === 'right') // natural
      startX = startX - TREE_THICKNESS;

    this.lineElement.style.left = startX + 'px';

    switch(growDirection)
    {
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
  extendLine(withoutThickness) {
    super.extendLine(withoutThickness);
    //let line = this;
    //line.lineElement.style.height = this.size + 'px';
    if (this.lineElement !== null)
      this.lineElement.style.height = this.size + 'px';
    else
      console.log("interesting case", this);
  }
  get lastY() {
    return (this.initialY + this.size) * this.reversalMultiplier;
  }
  get lastX() {
    return this.initialX;
  }
}
class TreeHorizontalNode extends TreeNode {
  constructor(lifeTree, startX, startY, growDirection, prevDirection, virtual = false) {

    super(lifeTree, virtual);

    this.lineElement.className += ' line horizontal ' + growDirection + ' prev-' + prevDirection + ' startX-' + startX + ' startY-' + startY;

    if (prevDirection === 'down') // natural
      startY = startY - TREE_THICKNESS;

    this.lineElement.style.top = startY + 'px';

    switch(growDirection)
    {
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
  extendLine(withoutThickness) {
    super.extendLine(withoutThickness);
    //let line = this;
    //line.lineElement.style.width = this.size + 'px';
    if (this.lineElement !== null)
      this.lineElement.style.width = this.size + 'px';
    else
      console.log("interesting case", this);
  }
  get lastY() {
    return this.initialY;
  }
  get lastX() {
    return (this.initialX + this.size) * this.reversalMultiplier;
  }
}

class TreeLine {
  constructor(lifeTree, extendBy = 20, startX = 0, startY = 0, boundaryX = null, boundaryY = null, iterations = 60, fadeThreshold = 30, classes = '', interval = 300, directions = ['down', 'left', 'right'], startDirection = 'down', avoidElements = []) {
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
  getPossibleTypes(prevType) {
    let possibleTypes;
    if (prevType === 'left')
      possibleTypes = ['up', 'down', 'left'];
    if (prevType === 'right')
      possibleTypes =  ['up', 'down', 'right'];
    if (prevType === 'up')
      possibleTypes =  ['up', 'left', 'right'];
    if (prevType === 'down')
      possibleTypes =  ['down', 'left', 'right'];

    //console.log(this.types, possibleTypes);
    return intersect(this.types, possibleTypes);
  }
  getRandomType(prevType) {
    let possibleTypes = this.getPossibleTypes(prevType);
    return possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
    /*
    let nextType;

    do nextType = this.types[Math.floor(Math.random() * this.types.length)];
    while ((prevType === 'left' && nextType === 'right') || (prevType === 'right' && nextType === 'left') || (prevType === 'up' && nextType === 'down') || (prevType === 'down' && nextType === 'up') || (prevType === 'up' && nextType === 'up') || (prevType === 'down' && nextType === 'down'));
    // || (prevType === 'up' && nextType === 'up') || (prevType === 'down' && nextType === 'down')

    return nextType;
    */
  }
  getRandomTypeWithinBoundaries(startX, startY, prevType) {
    let nextType;
    let testedTypes = [];
    let possibleTypesCount = this.getPossibleTypes(prevType).length;

    //console.log(this.getPossibleTypes(prevType));

    do {
      if (testedTypes.length > 1) console.log("avoiding out of boundaries type", testedTypes[testedTypes.length-1]);

      if (testedTypes.length >= possibleTypesCount) {
        console.log("something went wrong when finding a type that will fit between the boundaries", "(did you put the start point in the middle of a forbidden area?");
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
  okBoundaries(startX, startY, type, prevType) {
    let treeLine = this;
    let virtualNode = treeLine.getNode(startX, startY, type, prevType, true);

    // lines don't go outside self
    if (virtualNode.lastX < 0 || virtualNode.lastY < 0) return false;

    // no definitions - let's allow everything else
    if ((this.boundaryX == 0 || this.boundaryY == 0) && this.avoidElements.length === 0) return true;

    //console.log("Testing: ", type, "CurrX/X/Xb", startX, virtualNode.lastX, "CurrY/Y/Yb", startY, virtualNode.lastY);
    if (treeLine.debug)
      console.log("Testing: ", type, "CurrX/X/Xb", startX, virtualNode.lastX, this.boundaryX, "CurrY/Y/Yb", startY, virtualNode.lastY, this.boundaryY);
    // boundary test first
    if (this.boundaryX != 0 && this.boundaryY != 0)
    {
      if (virtualNode.lastX > this.boundaryX || virtualNode.lastY > this.boundaryY)
        return false;
    }

    if (this.avoidElements.length !== 0)
    {
      // let's see if we can avoid elements
      let selfBoundaries = treeLine.treeElement.getBoundingClientRect();

      for (let elementDescription of treeLine.avoidElements)
      {
        let element = elementDescription.element;
        let boundaries = element.getBoundingClientRect();
        //.getPropertyValue("height");
        let boundaryLeft = Math.round(boundaries.left - selfBoundaries.left);
        let boundaryRight = Math.round(boundaries.right - selfBoundaries.left);
        let boundaryTop = Math.round(boundaries.top - selfBoundaries.top);
        let boundaryBottom = Math.round(boundaries.bottom - selfBoundaries.top);

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

        if ((virtualNode.lastX > boundaryLeft && virtualNode.lastX < boundaryRight) && (virtualNode.lastY > boundaryTop && virtualNode.lastY < boundaryBottom))
          return false; // TODO: would be great to add *by how much* we miss, and pick the one that misses the least
      }
    }

    return true;
  }
  getNode(startX, startY, type, prevType, virtual = false) {
    let node;
    if (type === 'up' || type === 'down')
      node = new TreeVerticalNode(this, startX, startY, type, prevType, virtual);
    else // left or right
      node = new TreeHorizontalNode(this, startX, startY, type, prevType, virtual);
    return node;
  }
  async addNode(startX, startY, type = 'up', prevType = 'up') {
    let treeLine = this;

    if (treeLine.killSwitch === true) {
      if (treeLine.startedFading === false)
        treeLine.startFadingAtNode(0);
      return;
    }
    let node = treeLine.getNode(startX, startY, type, prevType, false);

    //if (treeLine.debug)
    //console.log('adding node X & Y', type, startX, startY, node);
    treeLine.nodes.push(node);

    while (treeLine.nodes.length < treeLine.iterations && treeLine.killSwitch === false) {

      if (treeLine.nodes.length > 1 && treeLine.fadeThreshold >= 0 && treeLine.nodes.length === treeLine.fadeThreshold)
      {
        treeLine.startFadingAtNode(0);
      }

      await timeout(treeLine.interval);
      node.extendLine(false);

      let nextType = treeLine.getRandomTypeWithinBoundaries(node.lastX, node.lastY, type);

      //while (type === 'left' && nextType === 'left' || type === 'right' && nextType === 'right' || type === 'down' && nextType === 'down' || type === 'up' && nextType === 'up')
      while (type === nextType)
      {
        await timeout(treeLine.interval);
        node.extendLine(true);
        //nextType = treeLine.getRandomType(type);
        nextType = treeLine.getRandomTypeWithinBoundaries(node.lastX, node.lastY, type);
      }
      await treeLine.addNode(node.lastX, node.lastY, nextType, type, false);
    }
  }
  async startFadingAtNode(nodeNum) {
    // console.log("fading?", this.nodes.length-1, nodeNum+1);
    let treeLine = this;

    treeLine.startedFading = true;

    let nodeToDestroy = treeLine.nodes[nodeNum];

    if (nodeToDestroy === null)
    {
      console.log("node already destroyed, current count:", nodeNum, treeLine.nodes.length)
      return;
    }

    let elementToDestroy = nodeToDestroy.lineElement;
    elementToDestroy.className += " fade-out";

    await timeout(treeLine.interval * 2);

    if (this.nodes.length-1 >= nodeNum+1)
    {
      treeLine.startFadingAtNode(nodeNum+1);
    }
    // TODO:
    else if (this.killSwitch === true && this.nodes.length === 0) // all lines removed, finally remove the tree div:
    {
      setTimeout(function(){
        treeLine.treeElement.parentNode.removeChild(treeLine.treeElement);
        // GC
        treeLine.treeElement = null;
      }, treeLine.interval * 10);
    }
    // else
    // {
    //   treeLine.startFadingAtNode(nodeNum);
    // }

    setTimeout(function(){
      elementToDestroy.parentNode.removeChild(elementToDestroy);
      // GC
      treeLine.nodes[nodeNum].lineElement = null;
      treeLine.nodes[nodeNum] = null;
      //treeLine.nodes.splice(nodeNum, 1);
    }, treeLine.interval * 10);
  }
}

class TreeBuilder
{
  // querySelector = document.querySelector.bind(document);
  // querySelectorAll = document.querySelectorAll.bind(document);
  // body = document.body;
  builtObjects = [];

  constructor(objectToBuildOn, colorsToBuild = ['color-dark-blue'], avoid = [])
  {
    let rect = objectToBuildOn.getBoundingClientRect();
    let extendBy = 100;

    for (let color of colorsToBuild)
    {
      var hoverTree = document.createElement('div');
      hoverTree.className += " life-tree";
      var hoverTreeWidth = Math.round(rect.right - rect.left) + (extendBy*2);
      //var hoverTreeHeight = 60;
      var hoverTreeHeight = Math.round(rect.bottom - rect.top) + (extendBy*2);
      //hoverTree.style.top = Math.round(rect.bottom)-10 + "px";
      hoverTree.style.top = Math.round(rect.top) - extendBy + "px";
      //hoverTree.style.top = 30 + "px";
      hoverTree.style.left = Math.round(rect.left) - extendBy + "px";
      hoverTree.style.width = hoverTreeWidth + "px";
      hoverTree.style.height = hoverTreeHeight + "px";
      hoverTree.style.zIndex = -1;
      document.body.appendChild(hoverTree);

      let treeLine = new TreeLine(
        hoverTree, // div
        20, // extend size
        Math.round(hoverTreeWidth/2), // startX
        Math.round(hoverTreeHeight/2), // start Y
        //0, // startX
        //0, // start Y
        hoverTreeWidth, // boundaryX
        hoverTreeHeight, // boundaryY
        5500, // iterations
        10,  // interation fade treshold, -1 off
        // 'color-red',  // classes
        // 'color-dark-blue',  // classes
        color,
        100, // interval
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

  }
}

(function(){
  "use strict";

  var querySelector = document.querySelector.bind(document);
  var querySelectorAll = document.querySelectorAll.bind(document);

  var body = document.body;

  let avoid = Array.prototype.slice.call(querySelectorAll('nav')).concat(Array.prototype.slice.call(querySelectorAll('button'))).concat(Array.prototype.slice.call(querySelectorAll('h1')));

  let avoidArray = avoid.map(function(element){
    return {
      element: element,
      allowMargin: true,
      allowPadding: true,
      allowBorder: true
    };
  });
  // LIFE TREE
  var lifeTree = new TreeBuilder(querySelector('.content'), ['color-dark-blue', 'color-red', 'color-violet'], avoidArray);

  // var lifeTree = querySelector('body');
  // (lifeTree, extendBy = 20, startX = 0, startY = 0, boundaryX = null, boundaryY = null, iterations = 60, fadeThreshold = 30, classes = '', interval = 300, directions = ['down', 'left', 'right'], startDirection = 'down')
  // var treeLine = new TreeLine(lifeTree, 20, -18, 0, 400, 400, 100, 20, 'color-dark-blue', 100, ['down', 'up', 'left', 'left', 'right'], 'down');
  // var treeLine2 = new TreeLine(lifeTree, 20, 0, 0, 400, 400, 100, 20, 'color-red', 100, ['down', 'down', 'up', 'left', 'right'], 'down');
  // var treeLine3 = new TreeLine(lifeTree, 20, 18, 0, 400, 400, 100, 20, 'color-violet', 100, ['down', 'up', 'left', 'right', 'right'], 'down');
  
  /*
  let avoid = Array.prototype.slice.call(querySelectorAll('nav')).concat(Array.prototype.slice.call(querySelectorAll('button'))).concat(Array.prototype.slice.call(querySelectorAll('h1')));
  console.log(avoid);

  let avoidArray = avoid.map(function(element){
    return {
      element: element,
      allowMargin: true,
      allowPadding: true,
      allowBorder: true
    };
  });

  let rect = body.getBoundingClientRect();

  let lifeTree = document.createElement('div');
  lifeTree.className += " life-tree";
  let lifeTreeWidth = Math.round(rect.width);
  let lifeTreeHeight = Math.round(rect.height);
  //hoverTree.style.top = Math.round(rect.bottom)-10 + "px";
  lifeTree.style.top = "0px";
  //hoverTree.style.top = 30 + "px";
  lifeTree.style.left = "0px";
  lifeTree.style.width = lifeTreeWidth + "px";
  lifeTree.style.height = lifeTreeHeight + "px";
  lifeTree.style.zIndex = -1;
  body.appendChild(lifeTree);
  */
/*
  let treeLine = new TreeLine(
    lifeTree, // div
    20, // extend size
    //Math.round(hoverTreeWidth/3), // startX
    //Math.round(hoverTreeHeight/2), // start Y
    0, // startX
    0, // start Y
    lifeTreeWidth, // boundaryX
    lifeTreeHeight, // boundaryY
    550, // iterations
    1,  // interation fade treshold, -1 off
    //'color-red',  // classes
    'color-dark-blue',  // classes
    50, // interval
    ['down', 'up', 'left', 'right'], // probability of directions
    //['down', 'down', 'up', 'left', 'right'], // probability of directions
    'down', // first
    avoidArray
  );

  let treeLine2 = new TreeLine(
    lifeTree, // div
    20, // extend size
    //Math.round(hoverTreeWidth/3), // startX
    //Math.round(hoverTreeHeight/2), // start Y
    0, // startX
    0, // start Y
    lifeTreeWidth, // boundaryX
    lifeTreeHeight, // boundaryY
    550, // iterations
    1,  // interation fade treshold, -1 off
    'color-red',  // classes
    //'color-dark-blue',  // classes
    50, // interval
    ['down', 'up', 'left', 'right'], // probability of directions
    //['down', 'right', 'up', 'left', 'right'], // probability of directions
    'down', // first
    avoidArray
  );
*/
  /*
  let treeLine3 = new TreeLine(
    hoverTree, // div
    20, // extend size
    Math.round(hoverTreeWidth/3), // startX
    //Math.round(hoverTreeHeight/2), // start Y
    //0, // startX
    hoverTreeHeight, // start Y
    hoverTreeWidth, // boundaryX
    hoverTreeHeight, // boundaryY
    550, // iterations
    1,  // interation fade treshold, -1 off
    'color-violet',  // classes
    50, // interval
    //['down', 'down', 'up', 'left', 'right'], // probability of directions
    ['down', 'up', 'up', 'left', 'right'], // probability of directions
    'down', // first
    avoidArray
  );
  */
/*
  let avoid = Array.prototype.slice.call(querySelectorAll('nav')).concat(Array.prototype.slice.call(querySelectorAll('button'))).concat(Array.prototype.slice.call(querySelectorAll('h1')));
  console.log(avoid);

  let avoidArray = avoid.map(function(element){
    return {
      element: element,
      allowMargin: true,
      allowPadding: true,
      allowBorder: true
    };
  });
*/
  // var targets = Array.prototype.slice.call(querySelectorAll('.hello')).concat(Array.prototype.slice.call(querySelectorAll('.navdrawer-container a')));
  var targets = querySelectorAll('.navdrawer-container a');
  // var helloText = querySelector('.hello h1');
  for (let target of targets) { // TODO
  // for (let i = 0; i < targets.length; ++i) {
    // let target = targets[i];
    target.addEventListener("mouseover", function(){
      var rect = this.getBoundingClientRect();

      var extendBy = 100;

      var hoverTree = document.createElement('div');
      hoverTree.className += " life-tree hover-tree";
      var hoverTreeWidth = Math.round(rect.right - rect.left) + (extendBy*2);
      //var hoverTreeHeight = 60;
      var hoverTreeHeight = Math.round(rect.bottom - rect.top) + (extendBy*2);
      //hoverTree.style.top = Math.round(rect.bottom)-10 + "px";
      hoverTree.style.top = Math.round(rect.top) - extendBy + "px";
      //hoverTree.style.top = 30 + "px";
      hoverTree.style.left = Math.round(rect.left) - extendBy + "px";
      hoverTree.style.width = hoverTreeWidth + "px";
      hoverTree.style.height = hoverTreeHeight + "px";
      hoverTree.style.zIndex = -1;
      body.appendChild(hoverTree);
      var treeLine = new TreeLine(
        hoverTree, // div
        20, // extend size
        Math.round(hoverTreeWidth/2), // startX
        Math.round(hoverTreeHeight/2) + 6, // start Y
        //0, // startX
        //0, // start Y
        hoverTreeWidth, // boundaryX
        hoverTreeHeight, // boundaryY
        55, // iterations
        1,  // interation fade treshold, -1 off
        //'color-red',  // classes
        'color-dark-blue',  // classes
        100, // interval
        //['down', 'down', 'up', 'left', 'right'], // probability of directions
        ['down', 'up', 'left', 'right'], // probability of directions
        'down', // first
        [
          {
            element: this,
            allowMargin: true,
            allowPadding: true,
            allowBorder: true
          }
        ]
      );
      target.addEventListener("mouseout", function(){
        treeLine.killSwitch = true;
      });

      //console.log(rect.top, rect.right, rect.bottom, rect.left);
    });
  }

})();
