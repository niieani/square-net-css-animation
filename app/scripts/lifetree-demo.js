"use strict";

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
  var lifeTree = new TreeBuilder(querySelector('main'), ['color-dark-blue', 'color-red', 'color-violet'], avoidArray);

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