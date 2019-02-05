const Router = require('express-promise-router');

const router = new Router();

router.get('/getUsername', async (req, res) => {
  res.send({ username: 'Summoner' });
});

module.exports = router;
