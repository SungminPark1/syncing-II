const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (req, res) => {
  if (req.url === '/bundle.js') {
    fs.readFile(`${__dirname}/../hosted/bundle.js`, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.write(data);
      res.end();
    });
  } else {
    fs.readFile(`${__dirname}/../hosted/index.html`, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
};

const app = http.createServer(onRequest);
app.listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);

// pass in the http server into socketio and grab the websocket server as io
const io = socketio(app);

const draws = {};

const onJoined = (socket) => {
  socket.on('join', () => {
    socket.join('room1');

    socket.emit('initData', {
      draws,
    });
  });
};

const onMsg = (socket) => {
  socket.on('draw', (data) => {
    draws[data.name] = data;

    io.sockets.in('room1').emit('updateData', {
      name: data.name,
      time: data.time,
      coords: data.coords,
      color: data.color,
    });
  });
};


io.sockets.on('connection', (socket) => {
  onJoined(socket);
  onMsg(socket);
});

console.log('websocket server started');
