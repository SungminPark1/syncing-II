function circlesDistance(c1, c2) {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const distance = Math.sqrt((dx * dx) + (dy * dy));
  return distance;
}

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
      game.players[user.name] = {
        name: user.name,
        pos: {
          x: 250,
          y: 250,
        },
        radius: 20,
        score: 0,
        color: {
          r: Math.floor(Math.random() * 256),
          g: Math.floor(Math.random() * 256),
          b: Math.floor(Math.random() * 256),
        },
      };
    },
    deletePlayer: (name) => {
      delete game.players[name];
    },
    updatePlayerPos: (user) => {
      game.players[user.name].pos.x = user.pos.x;
      game.players[user.name].pos.y = user.pos.y;
    },
    createBombs: () => {
      if (game.bombs.length < 3) {
        game.bombs.push({
          pos: {
            x: Math.floor((Math.random() * 460) + 20),
            y: Math.floor((Math.random() * 460) + 20),
          },
          radius: 5,
          active: true,
          points: 15,
        });
      }
    },
    updateBomb: (bomb) => {
      const updatedBomb = bomb;

      updatedBomb.radius = Math.min(bomb.radius + game.dt, 20);
      updatedBomb.points = Math.max(bomb.points - game.dt, 1);
    },
    filterBombs: () => {
      game.bombs = game.bombs.filter(bomb => bomb.active);
    },
    checkCollision: (user) => {
      const player = user;
      // check player collision with bombs
      for (let i = 0; i < game.bombs.length; i++) {
        const bomb = game.bombs[i];

        if (circlesDistance(player.pos, bomb.pos) < (player.radius + bomb.radius)) {
          player.score += bomb.points;
          bomb.active = false;
        } else {
          game.updateBomb(bomb);
        }
      }
    },
    update: () => {
      const now = new Date().getTime();

      // in seconds
      game.dt = (now - game.time) / 1000;

      game.time = now;

      const keys = Object.keys(game.players);

      // check each players for collisions
      for (let i = 0; i < keys.length; i++) {
        const player = game.players[keys[i]];

        game.checkCollision(player);
      }

      // filter out non active bombs and create new ones
      game.filterBombs();
      game.createBombs();
    },
  };

  return game;
};

module.exports = {
  createGame,
};
