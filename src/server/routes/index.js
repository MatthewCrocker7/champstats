const users = require('./users/users');
const players = require('./players/players');

module.exports = (app) => {
  app.use('/api/users', users);
  app.use('/api/players', players);
};
