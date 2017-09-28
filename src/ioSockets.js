const gameRooms = {};

const onJoined = (socket, io) => {
  /*
  socket.on('join', (data) => {
    socket.join('lobby');
    socket.room = 'lobby';
    socket.name = data.name;
  });
  */
  socket.on('join', () => {
    socket.join('room1');

    socket.emit('initData', {
      gameRooms,
    });
  });
};

const onMsg = (socket, io) => {
  socket.on('draw', (data) => {
    gameRooms[data.name] = data;

    io.sockets.in('room1').emit('updateData', {
      name: data.name,
      time: data.time,
      coords: data.coords,
      color: data.color,
    });
  });
};

const onDisconnect = (socket, io) => {
  socket.on('disconnect', () => {
    // find the disconnected players room and deleted the player
    
  });
};

module.exports = {
  onJoined,
  onMsg,
  onDisconnect,
};
