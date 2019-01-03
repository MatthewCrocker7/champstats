const API_KEY = require('../../../riot_api_key.js');

const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');

const request = require('request');


const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => console.log('Listening on port 8080!'));


//Beginning of summoner lookup
app.post('/api/champstats/playerSearch', function(req, res){

var summonerRequest; //Summoner(s) to be looked up
var response = [];
var summoner1 = null;
var summonerStats = [''];

summonerRequest = req.body.stats
if(summonerRequest[0] == ''){
    res.send({ stats: summonerStats }); //Returns an array with an empty string. Client will see a "summoner not found message"
}
else {
  console.log(summonerRequest);
  summoner1 = summonerRequest[0];
}

//Loops through each summoner if multiple
summonerRequest.forEach(function(summoner) {
  var url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?api_key=${API_KEY}`;
  console.log(summoner);
  console.log(url);


  var summonerInfo = null;
  request(url, function(error, response, body) {
    if(error){
      console.log('error:', error); // Print the error if one occurred
    }
    else {
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.

      summonerInfo = JSON.parse(body);
      console.log(summonerInfo.id);

      response.push(summonerInfo.name);
      //res.send({ stats: response });
    }



  });


  //response.push(summonerInfo.name + ' - ' + summonerInfo.summonerLevel);
  console.log('');
});

response.push('67');

console.log(response);

res.send({ stats: response });
});
