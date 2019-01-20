const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const playerSearch = require('./playerSearch.js');

const app = express();
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ', port, '!'));

const allResults = {};

// Beginning of all methods
app.get('/api/getUsername', (req, res) => res.send({ username: 'Summoner' }));

app.post('/api/champstats/initiatePlayerSearch', async (req, res) => {
  const searchID = uuidv1();
  allResults[searchID] = playerSearch(req);
  console.log('POST Search ID: ', searchID);
  return res.send({ searchID: searchID });
});

app.get('/api/champstats/playerSearch/:searchID', async (req, res) => {
  try {
    console.log('GET Search ID: ', req.params.searchID);
    const result = await allResults[req.params.searchID];
    delete allResults[req.params.searchID];

    if (result !== undefined) {
      if (result === 404) {
        console.log('404 error, not found');
        return res.sendStatus(404);
      }
      return res.send({ stats: result.stats });
    }
  } catch (error) {
    console.log(error);
  }
});
