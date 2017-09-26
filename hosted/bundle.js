'use strict';

var socket = void 0;
var canvas = void 0;
var ctx = void 0;
var topCanvas = void 0;
var topCtx = void 0;

var updated = false;
var user = { name: 'user' + Math.floor(Math.random() * 1000 + 1) };

var draws = {};

// keyboard stuff
var myKeys = {
  KEYBOARD: {
    KEY_W: 87,
    KEY_A: 65,
    KEY_S: 83,
    KEY_D: 68
  },
  keydown: []
};

// event listeners
window.addEventListener('keydown', function (e) {
  console.log('keydown: ' + e.keyCode);
  myKeys.keydown[e.keyCode] = true;
});

window.addEventListener('keyup', function (e) {
  console.log('keyup: ' + e.keyCode);
  myKeys.keydown[e.keyCode] = false;
});

// draw other client's object
var drawMain = function drawMain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var keys = Object.keys(draws);

  for (var i = 0; i < keys.length; i++) {
    // ignores this clients object
    if (keys[i] !== user.name) {
      var drawCall = draws[keys[i]];
      ctx.fillStyle = 'rgb(' + drawCall.color.r + ', ' + drawCall.color.g + ', ' + drawCall.color.b + ')';
      ctx.fillRect(drawCall.coords.x, drawCall.coords.y, drawCall.coords.width, drawCall.coords.height);
    }
  }
};

// draw this clients object
var drawTop = function drawTop() {
  console.log(user);
  topCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
  topCtx.fillStyle = 'rgb(' + user.color.r + ', ' + user.color.g + ', ' + user.color.b + ')';
  topCtx.fillRect(user.coords.x, user.coords.y, user.coords.width, user.coords.height);
};

// updates other client objects movement
var handleUpdate = function handleUpdate(data) {
  console.log(data);
  draws[data.name] = data;
  drawMain();
};

// update
var update = function update() {
  window.requestAnimationFrame(update);

  updated = false;

  if (myKeys.keydown[myKeys.KEYBOARD.KEY_W] === true) {
    user.coords.y += -2;
    updated = true;
  }
  if (myKeys.keydown[myKeys.KEYBOARD.KEY_A] === true) {
    user.coords.x += -2;
    updated = true;
  }
  if (myKeys.keydown[myKeys.KEYBOARD.KEY_S] === true) {
    user.coords.y += 2;
    updated = true;
  }
  if (myKeys.keydown[myKeys.KEYBOARD.KEY_D] === true) {
    user.coords.x += 2;
    updated = true;
  }

  // if this client's user moves, send to server to update other clients
  if (updated === true) {
    socket.emit('draw', {
      name: user.name,
      time: user.time,
      coords: user.coords,
      color: user.color
    });
  }

  drawTop();
};

var setupSocket = function setupSocket() {
  socket.emit('join', { user: user });

  socket.on('updateData', handleUpdate);

  // get other clients data from server
  socket.on('initData', function (data) {
    draws = data.draws;
  });

  // this clients users initial data
  var time = new Date().getTime();

  var coords = {
    x: Math.floor(Math.random() * 451),
    y: Math.floor(Math.random() * 451),
    width: 50,
    height: 50
  };

  var color = {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256)
  };

  user.time = time;
  user.coords = coords;
  user.color = color;

  socket.emit('draw', {
    name: user.name,
    time: user.time,
    coords: user.coords,
    color: user.color
  });
};

var init = function init() {
  socket = io.connect();
  canvas = document.querySelector('#main');
  ctx = canvas.getContext('2d');

  topCanvas = document.querySelector('#top');
  topCtx = topCanvas.getContext('2d');

  canvas.setAttribute('width', 500);
  canvas.setAttribute('height', 500);
  topCanvas.setAttribute('width', 500);
  topCanvas.setAttribute('height', 500);

  setupSocket();
  window.requestAnimationFrame(update);
};

window.onload = init;
