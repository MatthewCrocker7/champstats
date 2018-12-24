const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => console.log('Listening on port 8080!'));


app.post('/api/champstats/playerSearch', function(req, res){
  var stats;

  //if (typeof req.body.stats !== 'undefined')
  stats = req.body.stats
  if(stats[0] == '')
    stats = 'Player not found';
  //else {
  //  stats = 2;
  //  }
  for(var i = 0; i < 100; i++){
    for(var x = 0; x < 1000; x++){
      console.log(i + ' ' + x);
    }
  }

  res.send({ stats: stats })
});
