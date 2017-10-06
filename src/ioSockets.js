const game = require('./game/game.js');

const gameRooms = {};

// update room data and sent data to client at set interval
const updateRoom = (room, io) => {
  gameRooms[room].update();

  const { players, bombs } = gameRooms[room];
  io.sockets.in(room).emit('update', {
    players,
    bombs,
  });
};

// if no room create one, if there is add player and update player data
const onJoined = (sock, io) => {
  const socket = sock;

  if (!gameRooms.room1) {
    socket.on('join', (data) => {
      socket.join('room1');
      socket.room = 'room1';
      socket.name = data.user.name;

      gameRooms.room1 = game.createGame('room1');
      gameRooms.room1.addPlayer(data.user);

      gameRooms.room1.interval = setInterval(() => {
        updateRoom('room1', io);
      }, 1000 / 60);

      socket.emit('initData', {
        players: gameRooms.room1.players,
        bombs: gameRooms.room1.bombs,
      });
    });
  } else {
    socket.on('join', (data) => {
      socket.join('room1');
      socket.room = 'room1';
      socket.name = data.user.name;

      gameRooms.room1.addPlayer(data.user);

      socket.emit('initData', {
        players: gameRooms.room1.players,
        bombs: gameRooms.room1.bombs,
      });
    });
  }
};

// update player movement
const onMsg = (sock) => {
  const socket = sock;

  socket.on('updatePlayer', (data) => {
    const room = gameRooms[socket.room];

    room.updatePlayerPos(data);
  });
};

const onDisconnect = (sock) => {
  const socket = sock;

  socket.on('disconnect', () => {
    // find the disconnected players room and deleted the player
    if (gameRooms.room1) {
      gameRooms.room1.deletePlayer(socket.name);

      if (Object.keys(gameRooms.room1.players).length === 0) {
        clearInterval(gameRooms.room1.interval);
        delete gameRooms.room1;
      }
    }
  });
};

module.exports = {
  onJoined,
  onMsg,
  onDisconnect,
};
