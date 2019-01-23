const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const timeout = require('connect-timeout');
const playerSearch = require('./playerSearch.js');

const app = express();
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

const haltOnTimedout = (req, res, next) => {
  if (!req.timedout) {
    next();
  } else {
    res.sendStatus(204);
  }
};

const allResults = {};

// Beginning of all methods
app.get('/api/getUsername', (req, res) => {
  res.send({ username: 'Summoner' });
});

app.post('/api/champstats/initiatePlayerSearch', async (req, res) => {
  const searchID = uuidv1();
  allResults[searchID] = playerSearch(req);
  console.log('POST Search ID: ', searchID);
  return res.send({ searchID: searchID });
});

app.get('/api/champstats/playerSearch/:searchID', timeout('1s', { respond: false }), haltOnTimedout, async (req, res, next) => {
  try {
    console.log('GET Search ID: ', req.params.searchID);
    const result = await allResults[req.params.searchID];
    if (result) {
      console.log('Result returned!');
      return res.send({ stats: result.stats });
    }
  } catch (error) {
    console.log('GET DATA ERROR: ', error.statusCode);
    return next(error);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Listening on port ', port, '!');
});
