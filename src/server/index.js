const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const playerSearch = require('./playerSearch.js');

const app = express();
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

const allResults = {};

const requestTimeout = new Promise((resolve) => {
  const timerID = setTimeout(() => {
    clearTimeout(timerID);
    resolve(null);
  }, 1000);
});


// Beginning of all routes
app.get('/api/getUsername', (req, res) => {
  res.send({ username: 'Summoner' });
});

app.post('/api/champstats/initiatePlayerSearch', async (req, res) => {
  const searchID = uuidv1();
  allResults[searchID] = playerSearch(req);
  console.log('POST Search ID: ', searchID);
  return res.send({ searchID: searchID });
});

app.get('/api/champstats/playerSearch/:searchID', async (req, res, next) => {
  try {
    console.log('GET Search ID: ', req.params.searchID);

    const result = await Promise.race([
      allResults[req.params.searchID],
      requestTimeout,
    ]);
    if (result) {
      console.log('DATA RETURNED TO CLIENT');
      return res.send({ stats: result.stats });
    }
    console.log(result);
    console.log('SENDING 204');
    return res.sendStatus(204);
  } catch (error) {
    console.log('GET DATA ERROR: ', error.statusCode);
    return next(error);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Listening on port ', port, '!');
});
