const API_KEY = require('../../../riot_api_key.js');

const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');

const request = require('request-promise');


const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => console.log('Listening on port 8080!'));


//Beginning of summoner lookup
app.post('/api/champstats/playerSearch', function(req, res){

var summonerRequest; //Summoner(s) to be looked up
var summonerInfoAll = [];
var summonerNotFound = [''];

summonerRequest = req.body.stats
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

      summonerSummary = {
        name: summonerInfo.name,
        level: summonerInfo.summonerLevel,
        accountId: summonerInfo.accountId,
      };
      summonerInfoAll.push(summonerInfo.name + ' ' + summonerInfo.summonerLevel);


      var urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerInfo.accountId}?queue=420&api_key=${API_KEY}&`;
      return request(urlMatches);
    })
    .then(function(body) {

      var matchHistory = JSON.parse(body);

      summonerSummary.matchHistory = {
        totalGames: matchHistory.totalGames,
      }

      //var matches = getAllMatches(summonerSummary);

      //console.log(matches);
      //

      //console.log(matchHistory.totalGames);

      return getAllMatches(summonerSummary);

    })
    .then(matches => {
      //console.log(matches);
      completedRequests++;

      summonerSummary.mostPlayed = mostPlayed(matches);
      console.log(summonerSummary);

      if(completedRequests == summonerRequest.length){
        console.log('complete');
        res.send({ stats: summonerInfoAll });
      }
    })
  /*  .then(function(matches) {
      completedRequests++;
      console.log(matches);

      if(completedRequests == summonerRequest.length){
        console.log('complete');
        res.send({ stats: summonerInfoAll });
      }
    }) */
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
      //return temp;
    })
    .catch(function(error) {
      console.log('Get all matches error: ' + error);
      return [];
    })
  );
}

function mostPlayed(matches){
  var mostPlayed = {};
  var totalCount = 0;
  matches.forEach(function(match) {
    totalCount++;
    mostPlayed[match.champion] = {
      total: mostPlayed[match.champion] ? mostPlayed[match.champion].total + 1 : 1,
    };
  });
  console.log(mostPlayed);
  console.log(totalCount);
  return ({
    first: 'Vayne',
    second: 'Lucian',
    third: 'Yasuo',
    fourth: 'Riven',
    fifth: 'Akali',
  });
}
