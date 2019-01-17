//const API_KEY = require('../../../riot_api_key.js');
const API_KEY = process.env.RIOT_API_KEY || '';
const CHAMPIONS = require('./champions.js');
const request = require('request-promise');
const _ = require('lodash');
const Bottleneck = require('bottleneck');

const limiterAppRate = new Bottleneck({
  reservoir: 100,
  reservoirRefreshAmount: 100,
  reservoirRefreshInterval: 120 * 1000, //app rate = 100 calls per 120 seconds, set to 99/125 secs for buffer

  maxConcurrent: 1,
  minTime: 50
});
const limiterSummonerSearch = new Bottleneck({
  //Limited to 2000 calls per 60 seconds
  maxConcurrent: 1,
  minTime: 30
});
const limiterMatchSearch = new Bottleneck({
  //Limited to 1000 calls per 10 seconds
  maxConcurrent: 1,
  minTime: 10
});
//Ensures request checks for both total app rate and specific method app rate
limiterSummonerSearch.chain(limiterAppRate);
limiterMatchSearch.chain(limiterAppRate);

var t0 = Date.now();
setInterval(async function(){
  const reservoir = await limiterAppRate.currentReservoir();
  console.log(`${Math.round((Date.now() - t0) / 1000)}s, reservoir: ${reservoir}`);
}, 5000);

//Beginning of summoner lookup
var playerSearch = async function(req){
  var exitNotFound = function(){
    return (['']); //Look into returning a 404 instead
  }

  var summonerRequest = req.body.stats; //Summoner(s) to be looked up
  console.log(summonerRequest);
  if (summonerRequest[0] == ''){
    return exitNotFound();
  }
  console.log('Start: ' + summonerRequest);

  try{
    var promises = summonerRequest.map(async function(summoner){
      var urlSummonerName = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?api_key=${API_KEY}`;
      var requestOptions = {
        uri: urlSummonerName,
        resolveWithFullResponse: true
      };

      var response = await limiterSummonerSearch.schedule({id: summoner}, () => request(requestOptions));
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
    return ({ stats: summonerSummaries });

  } catch(error){
    console.log('Error: ', error);
    return exitNotFound();
  }
}

function getAllMatches(beginIndex, curMatches, accountId){
  var urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&beginIndex=${beginIndex}&api_key=${API_KEY}&`;
  var requestOptions = {
    uri: urlMatches,
    resolveWithFullResponse: true
  };
  var jobId = beginIndex + '-' + accountId;

  return async function(){
    try {
      var start = process.hrtime();
      var response = await limiterMatchSearch.schedule({id: jobId}, () => request(requestOptions));
      var result = JSON.parse(response.body);
      var matches = curMatches.concat(result.matches);

      if(result.totalGames >= beginIndex + 100){
        return(getAllMatches(beginIndex + 100, matches, accountId));
      }
      else {
        console.log('match length: ' + matches.length);
        return matches;
      }
    } catch(error){
      var end = process.hrtime();
      console.log('Seconds elapsed: ' + (end[0]-start[0]));
      console.log('Get all matches error: ', error);
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

module.exports = playerSearch;
