var playerSearch = require('./playerSearch.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ' + port + '!'));

//Beginning of all methods
app.get('/api/getUsername', (req, res) => res.send({ username: 'Summoner' }));

app.post('/api/champstats/playerSearch', async function(req, res){
  req.setTimeout(0);
  return res.send(await playerSearch(req));
});
