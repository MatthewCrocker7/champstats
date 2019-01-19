const API_KEY = require('../../../riot_api_key.js');
//const API_KEY = process.env.RIOT_API_KEY || '';
const CHAMPIONS = require('./champions.js');
const request = require('request-promise');
const _ = require('lodash');
const RiotRateLimiter = require('riot-ratelimiter');
const limiter = new RiotRateLimiter();

//Beginning of summoner lookup
var playerSearch = async function(req){
  var exitNotFound = function(statusCode){
    return (statusCode); //Look into returning a 404 instead
  }

  var summonerRequest = req.body.players; //Summoner(s) to be looked up
  if (summonerRequest[0] == ''){
    return exitNotFound(404);
  }
  var t0 = Date.now();
  console.log('Start: ' + summonerRequest);

  try{
    var promises = summonerRequest.map(async function(summoner){
      //var urlSummonerName = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?api_key=${API_KEY}`;
      var urlSummonerName = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?`;
      var requestOptions = {
        uri: urlSummonerName,
        resolveWithFullResponse: true
      };

      //var response = await limiterSummonerSearch.schedule({id: summoner}, () => request(requestOptions));
      var response = await limiter.executing({
        url: urlSummonerName,
        token: API_KEY,
        resolveWithFullResponse: true
      });
      var summonerInfo = JSON.parse(response.body);
      var matches = await getAllMatches(0, [], summonerInfo.accountId);

      summonerSummary = {
        name: summonerInfo.name,
        level: summonerInfo.summonerLevel,
        accountId: summonerInfo.accountId,
        matchHistory: {
          totalGames: matches.length,
          matchIds: matches.map(match => match.gameId)
        },
        mostPlayed: mostPlayed(matches)
      };
      console.log('DONE', summonerSummary.name);
      return summonerSummary;
    })
    var summonerSummaries = await Promise.all(promises);
    console.log('Complete!');
    console.log(`Elapsed search time: ${Math.round((Date.now() - t0) / 1000)}s`);
    return ({
      stats: summonerSummaries,
     });

  } catch(error){
    var errorCode = error.statusCode;
    console.log('Error: ' + error);
    return exitNotFound(errorCode);
  }
}

function getAllMatches(beginIndex, curMatches, accountId){
  //var urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&beginIndex=${beginIndex}&api_key=${API_KEY}&`;
  var urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&beginIndex=${beginIndex}&`;
  var requestOptions = {
    uri: urlMatches,
    resolveWithFullResponse: true
  };
  var jobId = beginIndex + '-' + accountId;

  return async function(){
    try {
      var start = process.hrtime();
      //var response = await limiterMatchSearch.schedule({id: jobId}, () => request(requestOptions));
      var response = await limiter.executing({
        url: urlMatches,
        token: API_KEY,
        resolveWithFullResponse: true
      });
      var result = JSON.parse(response.body);
      var matches = curMatches.concat(result.matches);

      if(result.totalGames >= beginIndex + 100){
        return(getAllMatches(beginIndex + 100, matches, accountId));
      }
      else {
        return matches;
      }
    } catch(error){
      var end = process.hrtime();
      console.log('Seconds elapsed: ' + (end[0]-start[0]));
      return [];
    }
  }()
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

  return ({
    first: mostPlayed[0],
    second: mostPlayed[1],
    third: mostPlayed[2],
    fourth: mostPlayed[3],
    fifth: mostPlayed[4],
  });
}

module.exports = playerSearch;
