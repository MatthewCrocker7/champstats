//const API_KEY = require('../../../riot_api_key.js');
const CHAMPIONS = require('./champions.js');

const _ = require('lodash');
const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');

const request = require('request-promise');


const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));


const API_KEY = process.env.RIOT_API_KEY || '';
console.log('API KEY is: ' + API_KEY);
const port = process.env.PORT || 8080;

app.listen(port, () => console.log('Listening on port ' + port + '!'));
//app.listen(8080, () => console.log('Listening on port 8080!'));


//Beginning of summoner lookup
app.post('/api/champstats/playerSearch', function(req, res){

var summonerRequest; //Summoner(s) to be looked up
var summonerInfoAll = [];
var summonerNotFound = [''];

summonerRequest = req.body.stats
console.log(summonerRequest);
if(summonerRequest[0] == ''){
  res.send({ stats: summonerNotFound }); //Returns an array with an empty string. Client will see a "summoner not found message"
}
else {
  console.log('Start: ' + summonerRequest);
}


//Loops through each summoner if multiple
var completedRequests = 0;
summonerRequest.forEach(function(summoner) {
  var summonerSummary = {};

  var urlSummonerName = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?api_key=${API_KEY}`;


  request(urlSummonerName)
    .then(function(body) {
      var summonerInfo = JSON.parse(body);

      //Basic summoner information
      summonerSummary = {
        name: summonerInfo.name,
        level: summonerInfo.summonerLevel,
        accountId: summonerInfo.accountId,
      };


      var urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerInfo.accountId}?queue=420&api_key=${API_KEY}`;
      return request(urlMatches);
    })
    .then(function(body) {

      var matchHistory = JSON.parse(body);

      summonerSummary.matchHistory = {
        totalGames: matchHistory.totalGames,
      }
      //console.log(matchHistory.totalGames);

      return getAllMatches(summonerSummary);

    })
    .then(matches => {
      console.log(matches);
      completedRequests++;

      summonerSummary.mostPlayed = mostPlayed(matches);
      console.log(summonerSummary);

      summonerInfoAll.push(summonerSummary);

      if(completedRequests == summonerRequest.length){
        console.log('complete');
        res.send({ stats: summonerInfoAll });
      }
    })
    .catch(function(error) {
      console.log('Error: ' + error);
      res.send({ stats: summonerNotFound });
    })


  console.log('');
});

});



function getAllMatches(summonerSummary){

  //var temp = {};
  var requests = [];
  var totalRequests = 0;

  for(var i = 0; i < summonerSummary.matchHistory.totalGames; i+=100){
    totalRequests++;
    var urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerSummary.accountId}?queue=420&beginIndex=${i}&api_key=${API_KEY}&`;
    requests.push(request(urlMatches));
  }
  return(Promise.all(requests)
    .then(body => {
      var allMatches = [];
      //allMatches.push(tempMatches.matches);
      for(var i = 0; i < totalRequests; i++){
        var temp = JSON.parse(body[i]);
        allMatches = allMatches.concat(temp.matches);
        console.log(allMatches.length);
      }
      return allMatches;
    })
    .catch(function(error) {
      console.log('Get all matches error: ' + error);
      return [];
    })
  );
}

function mostPlayed(matches){
  var mostPlayed = [];
  var totalCount = 0;
  matches.forEach(function(match) {
    var champ = _.remove(mostPlayed, function(x) {
      return x.id == match.champion;
    });
    if(champ.length == 0){
      mostPlayed.push({
        id: match.champion,
        name: CHAMPIONS[match.champion] ? CHAMPIONS[match.champion].name : "Not Found",
        totalGames: 1,
      });
    }
    else {
      mostPlayed.push({
        id: match.champion,
        name: champ[0].name,
        totalGames: champ[0].totalGames + 1,
      });
    }
    totalCount++;
  });

  mostPlayed = _.sortBy(mostPlayed, 'totalGames');
  mostPlayed = _.reverse(mostPlayed);

  console.log(mostPlayed);
  console.log(totalCount);
  return ({
    first: mostPlayed[0].name,
    second: mostPlayed[1].name,
    third: mostPlayed[2].name,
    fourth: mostPlayed[3].name,
    fifth: mostPlayed[4].name,
  });
}
