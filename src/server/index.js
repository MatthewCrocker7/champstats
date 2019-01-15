const API_KEY = require('../../../riot_api_key.js');
//const API_KEY = process.env.RIOT_API_KEY || '';
//console.log('API KEY is: ' + API_KEY);

const CHAMPIONS = require('./champions.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const bottleNeck = require('bottleneck');

const app = express();
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ' + port + '!'));

var start = process.hrtime();
var end = process.hrtime();

const limiterAppRate = new bottleNeck({
  reservoir: 100,
  reservoirRefreshAmount: 100,
  reservoirRefreshInterval: 300 * 1000, //app rate = 100 calls per 120 seconds, set to 99/125 secs for buffer

  maxConcurrent: 1,
  minTime: 50
});
const limiterSummonerSearch = new bottleNeck({
  //Limited to 2000 calls per 60 seconds
  maxConcurrent: 1,
  minTime: .03
});
const limiterMatchSearch = new bottleNeck({
  //Limited to 1000 calls per 10 seconds
  maxConcurrent: 1,
  minTime: .01
});
//Ensures request checks for both total app rate and specific method app rate
limiterSummonerSearch.chain(limiterAppRate);
limiterMatchSearch.chain(limiterAppRate);


//DB1 = player followed by all match matchIds
//DB2 = matchId

//Beginning of all methods
app.get('/api/getUsername', (req, res) => res.send({ username: 'Summoner' }));

//Beginning of summoner lookup
app.post('/api/champstats/playerSearch', function(req, res){

req.setTimeout(0);
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


//Loops through each player if multiple
var completedRequests = 0;
summonerRequest.forEach(function(summoner) {
  var summonerSummary = {};

  var urlSummonerName = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?api_key=${API_KEY}`;
  var requestOptions = {
    uri: urlSummonerName,
    resolveWithFullResponse: true
  };

  limiterAppRate.schedule({id: summoner}, () => request(requestOptions))
    .then(function(response) {
      logResponseTime(response);
      var summonerInfo = JSON.parse(response.body);

      //Basic summoner information
      summonerSummary = {
        name: summonerInfo.name,
        level: summonerInfo.summonerLevel,
        accountId: summonerInfo.accountId,
      };

      return getAllMatches(0, [], summonerSummary.accountId);
    })
    .then(matches => {
      //console.log(matches);
      completedRequests++;

      summonerSummary.matchHistory = addMatchIds(matches);
      summonerSummary.mostPlayed = mostPlayed(matches);
      console.log(summonerSummary);

      summonerInfoAll.push(summonerSummary);

      if(completedRequests == summonerRequest.length){
        console.log('Complete');
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

function getAllMatches(beginIndex, curMatches, accountId){
  start = process.hrtime();
  var urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&beginIndex=${beginIndex}&api_key=${API_KEY}&`;
  var requestOptions = {
    uri: urlMatches,
    resolveWithFullResponse: true
  };
  var jobId = beginIndex + '-' + accountId;

  return(
    limiterAppRate.schedule({id: jobId}, () => request(requestOptions))
      .then(function(response){
        logResponseTime(response);
        var result = JSON.parse(response.body);
        var matches = curMatches.concat(result.matches);

        if(result.totalGames >= beginIndex + 100){
          return(getAllMatches(beginIndex + 100, matches, accountId));
        }
        else {
          console.log('match length: ' + matches.length);
          return matches;
        }
      })
      .catch(function(error) {
        end = process.hrtime();
        console.log('Seconds elapsed: ' + (end[0]-start[0]));
        console.log('Get all matches error: ' + error);
        return [];
      })
  );
}

function addMatchIds(matches){
  var matchIds = [];
  matches.forEach(function(match){
    matchIds.push(match.gameId);
  });
  return ({
    totalGames: matchIds.length,
    matchIds: matchIds,
  });
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

//  console.log(mostPlayed);
  console.log('total count check: ' + totalCount);
  return ({
    first: mostPlayed[0],
    second: mostPlayed[1],
    third: mostPlayed[2],
    fourth: mostPlayed[3],
    fifth: mostPlayed[4],
  });
}

function logResponseTime(response){
  console.log('');
  end = process.hrtime();
  console.log('Seconds elapsed: ' + (end[0]-start[0]));
  console.log('Date: '+ response.headers.date);
  console.log(response.headers);
  /*console.log('App Rate: '+ response.headers.x-app-rate-limit);
  console.log('App Rate Count: '+ response.headers.x-app-rate-limit-count);
  console.log('Method Rate: '+ response.headers.x-method-rate-limit);
  console.log('Method Rate Count: '+ response.headers.x-method-rate-limit-count);*/
}

//THIS FUNCTION IS DEPRECATED, KEEPING FOR REFERENCE
function oldGetAllMatches(summonerSummary){

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
/////////
