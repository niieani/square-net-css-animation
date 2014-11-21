/*!
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

//var animationLines = [];

(function () {
  'use strict';

  var querySelector = document.querySelector.bind(document);

  var navdrawerContainer = querySelector('.navdrawer-container');
  var body = document.body;
  var appbarElement = querySelector('.app-bar');
  //var topHeaderElement = querySelector('.top-header');
  var menuBtn = querySelector('.menu');
  var main = querySelector('main');

  function closeMenu() {
    body.classList.remove('open');
    appbarElement.classList.remove('open');
    navdrawerContainer.classList.remove('open');
    //topHeaderElement.classList.remove('open');
  }

  function toggleMenu() {
    body.classList.toggle('open');
    appbarElement.classList.toggle('open');
    //topHeaderElement.classList.toggle('open');
    navdrawerContainer.classList.toggle('open');
    navdrawerContainer.classList.add('opened');
  }

  main.addEventListener('click', closeMenu);
  menuBtn.addEventListener('click', toggleMenu);
  navdrawerContainer.addEventListener('click', function (event) {
    if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
      closeMenu();
    }
  });

  const TREE_THICKNESS = 2;

  class TreeNode {
    constructor(treeLine) {
      this.lineElement = document.createElement('div');
      this.size = 0;
      this.treeLine = treeLine;
      this.lineElement.className += this.treeLine.classes;
      this.treeLine.treeElement.appendChild(this.lineElement);
    }
    extendLine() {
      this.size += this.treeLine.extendBy;
    }
    get reversalMultiplier() {
      return this.subtractMode ? -1 : 1;
    }
  }

  class TreeVerticalNode extends TreeNode {
    constructor(lifeTree, startX, startY, growDirection = 'up', prevDirection = 'up') {

      super(lifeTree, startX, startY);

      if (prevDirection === 'left' && growDirection === 'up')
        this.subtractMode = true;

      else if (prevDirection === 'up')
        startY = startY - TREE_THICKNESS;

      else if (prevDirection === 'right')
        startX = startX - TREE_THICKNESS;

      this.lineElement.style.left = startX + 'px';

      this.initialX = startX;
      this.initialY = startY;

      this.lineElement.className += ' line vertical';
      switch(growDirection)
      {
        case 'up':
          this.lineElement.style.bottom = startY + 'px';
          break;
        case 'down':
          this.lineElement.style.top = startY * this.reversalMultiplier + 'px'; //-
          this.subtractMode = true;
          break;
      }
    }
    extendLine() {
      super.extendLine();
      this.lineElement.style.height = this.size + 'px';
    }
    get lastY() {
      return this.size + this.initialY;
    }
    get lastX() {
      return this.initialX;
    }
  }

  class TreeHorizontalNode extends TreeNode {
    constructor(lifeTree, startX, startY, growDirection = 'right', prevDirection = 'right') {

      super(lifeTree, startX, startY);

      if (prevDirection === 'up' && growDirection === 'left')
      {
        this.subtractMode = true;
        startX = startX + TREE_THICKNESS;
      }

      if (prevDirection === 'left' && growDirection === 'left')
        this.subtractMode = true;

      else if (prevDirection === 'up')
        startY = startY - TREE_THICKNESS;

      else if (prevDirection === 'right')
        startX = startX - TREE_THICKNESS;

      this.initialX = startX;
      this.initialY = startY;

      this.lineElement.className += ' line horizontal';
      this.lineElement.style.bottom = startY + 'px';

      switch(growDirection)
      {
        case 'left':
          this.initialX = startX;
          this.lineElement.style.right = this.initialX * this.reversalMultiplier + 'px';
          break;
        case 'right':
          this.lineElement.style.left = this.initialX + 'px';
          break;
      }

    }
    extendLine() {
      super.extendLine();
      this.lineElement.style.width = this.size + 'px';
    }
    get lastY() {
      return this.initialY;
    }
    get lastX() {
      return (this.size * this.reversalMultiplier + this.initialX);
    }
  }


  function timeout(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  class TreeLine {
    constructor(lifeTree, extendBy = 20, startX = 0, startY = 0, iterations = 60, classes = '', interval = 300) {
      this.treeElement = lifeTree;
      this.nodes = [];
      this.extendBy = extendBy;
      this.iterations = iterations;
      this.interval = interval;
      this.classes = classes;
      this.types = ['up', 'left', 'right'];
      this.addNode(startX, startY, 'up');
    }
    getRandomType(prevType) {
      let nextType;
      do nextType = this.types[Math.floor(Math.random() * this.types.length)];
      while ((prevType === 'left' && nextType === 'right') || (prevType === 'right' && nextType === 'left') || (prevType === 'up' && nextType === 'up'));
      return nextType;
    }
    async addNode(startX, startY, type = 'up', prevType = 'up') {
      let treeLine = this;

      let node;
      switch (type)
      {
        case 'up':
          node = new TreeVerticalNode(treeLine, startX, startY, 'up', prevType);
          break;
        case 'down':
          node = new TreeVerticalNode(treeLine, startX, startY, 'down', prevType);
          break;
        case 'left':
          node = new TreeHorizontalNode(treeLine, startX, startY, 'left', prevType);
          break;
        case 'right':
          node = new TreeHorizontalNode(treeLine, startX, startY, 'right', prevType);
          break;
      }

      //console.log('adding node X & Y', type, startX, startY, node);
      this.nodes.push(node);

      while (treeLine.nodes.length < treeLine.iterations) {
        console.log(treeLine.nodes.length, treeLine.iterations);
        let nextType = treeLine.getRandomType(type);
        while (type === 'left' && nextType === 'left' || type === 'right' && nextType === 'right')
        {
          await timeout(treeLine.interval);
          node.extendLine();
          nextType = treeLine.getRandomType(type);
        }
        await timeout(treeLine.interval);
        node.extendLine();
        await treeLine.addNode(node.lastX, node.lastY, nextType, type);
      }
    }
  }

    // LIFE TREE
  var lifeTree = querySelector('.life-tree');
  var treeLine = new TreeLine(lifeTree, 20, -50, 0, 70, 'color-dark-blue', 100);
  var treeLine2 = new TreeLine(lifeTree, 20, 0, 0, 80, 'color-red', 100);
  var treeLine3 = new TreeLine(lifeTree, 20, 50, 0, 70, 'color-violet', 100);

})();
