var playerSearch = require('./playerSearch.js');
const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');

const app = express();
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ' + port + '!'));

var allResults = {};

//Beginning of all methods
app.get('/api/getUsername', (req, res) => res.send({ username: 'Summoner' }));

app.post('/api/champstats/initiatePlayerSearch', async function(req, res){
  var searchID = uuidv1();
  allResults[searchID] = playerSearch(req);
  console.log('POST Search ID: ' + searchID);
  return res.send({searchID: searchID});
});

app.get('/api/champstats/playerSearch/:searchID', async function(req, res){
  try{
    console.log('GET Search ID: ' + req.params.searchID);
    const result = await allResults[req.params.searchID];
    delete allResults[req.params.searchID];

    if(result !== undefined){
      return res.send({stats: result.stats});
    }
  }catch(error){
    console.log('Get Error: ', error);
  }
});