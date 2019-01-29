const users = require('./users');
const players = require('./players');

module.exports = (app) => {
  app.use('/api/users', users);
  app.use('/api/players', players);
};
