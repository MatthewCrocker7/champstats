const uuidv1 = require('uuid/v1');
const Router = require('express-promise-router');
const playerSearch = require('./playerSearch.js');

const allResults = {};
const router = new Router();

const requestTimeout = new Promise((resolve) => {
  const timerID = setTimeout(() => {
    clearTimeout(timerID);
    resolve(null);
  }, 100);
});

router.post('/initiatePlayerSearch', async (req, res) => {
  const searchID = uuidv1();
  allResults[searchID] = playerSearch(req);
  console.log('POST Search ID: ', searchID);
  return res.send({ searchID });
});

router.get('/playerSearch/:searchID', async (req, res, next) => {
  try {
    const result = await Promise.race([
      allResults[req.params.searchID],
      requestTimeout,
    ]);
    if (result) {
      console.log('DATA RETURNED TO CLIENT');
      delete allResults[req.params.searchID];
      return res.send({ stats: result.stats });
    }
    return res.sendStatus(204);
  } catch (error) {
    console.log('GET DATA ERROR: ', error.statusCode);
    return next(error);
  }
});

module.exports = router;
