const bomb = require('./bomb.js');
const player = require('./bomb.js');


const createGame = (data) => {
  const game = {
    room: data,
    ended: false,
    started: false,
    players: {},
    bombs: [],
    time: new Date().getTime(),
    dt: 0,
    addPlayer: (user) => {
      game.players[user.name] = player.create();
    },
    deletePlayer: (user) => {
      delete game.players[user.name];
    },
    updatePlayer: (user) => {
      game.players[user.name].pos = player.update(user);
    },
    update: () => {
      const now = new Date().getTime();

      // in seconds
      game.dt = (now - this.time) / 1000;

      game.time = now;

      game.bombs = bomb.update();
    },
  };

  return game;
};

module.export = {
  createGame,
};
