const API_KEY = process.env.RIOT_API_KEY || '';

const CHAMPIONS = require('./champions.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const Bottleneck = require('bottleneck');

const app = express();
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ' + port + '!'));

const limiterAppRate = new Bottleneck({
  reservoir: 100,
  reservoirRefreshAmount: 100,
  //app rate = 100 calls per 120 seconds, set to 99/125 secs for buffer
  reservoirRefreshInterval: 120 * 1000, // fixed (120*1000 / 100 === )

  maxConcurrent: 1,
  minTime: 50
});
const limiterSummonerSearch = new Bottleneck({
  //Limited to 2000 calls per 60 seconds
  maxConcurrent: 1,
  minTime: 30 // fixed (60*1000 / 2000 === 30)
});
const limiterMatchSearch = new Bottleneck({
  //Limited to 1000 calls per 10 seconds
  maxConcurrent: 1,
  minTime: 10 // fixed (10*1000 / 1000 === 10)
});
// Unused!!
limiterSummonerSearch.chain(limiterAppRate);
limiterMatchSearch.chain(limiterAppRate);

var t0 = Date.now()
setInterval(async function () {
  const reservoir = await limiterAppRate.currentReservoir()
  console.log(`${Math.round((Date.now() - t0) / 1000)}s, reservoir: ${reservoir}`)
}, 5000)

//Beginning of all methods
app.get('/api/getUsername', (req, res) => res.send({ username: 'Summoner' }));

//Beginning of summoner lookup
app.post('/api/champstats/playerSearch', async function(req, res){
  req.setTimeout(0);
  var exitNotFound = function () {
    // probably want to return a 404 here
    return res.send({ stats: [''] });
  }

  var summonerRequest = req.body.stats
  console.log(summonerRequest);
  if (summonerRequest[0] == ''){
    return exitNotFound();
  }
  console.log('Start: ' + summonerRequest);

  //Loops through each player if multiple
  try {
    var promises = summonerRequest.map(async function(summoner) {
      var urlSummonerName = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?api_key=${API_KEY}`;
      var requestOptions = {
        uri: urlSummonerName,
        resolveWithFullResponse: true
      };
      var start = process.hrtime();

      var response = await limiterAppRate.schedule({id: summoner}, () => request(requestOptions))
      // logResponseTime(start, response);
      var summonerInfo = JSON.parse(response.body);

      var matches = await getAllMatches(0, [], summonerInfo.accountId);
      // console.log(matches);

      summonerSummary = {
        name: summonerInfo.name,
        level: summonerInfo.summonerLevel,
        accountId: summonerInfo.accountId,
        matchHistory: {
          totalGames: matches.length,
          // Commented this out because it's a massive payload
          // is it useful?
          // matchIds: matches.map(match => match.gameId)
        },
        mostPlayed: mostPlayed(matches)
      };
      console.log('DONE', summonerSummary.name);

      return summonerSummary;
    })
    var summaries = await Promise.all(promises);
    console.log('Complete');
    return res.send({ stats: summaries });

  } catch(error) {
    console.log('Error: ', error);
    return exitNotFound();
  }
});

function getAllMatches(beginIndex, curMatches, accountId){
  var urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&beginIndex=${beginIndex}&api_key=${API_KEY}&`;
  var requestOptions = {
    uri: urlMatches,
    resolveWithFullResponse: true
  };
  var jobId = beginIndex + '-' + accountId;

  return async function () {
    try {
      var start = process.hrtime();
      var response = await limiterAppRate.schedule({id: jobId}, () => request(requestOptions))
      // logResponseTime(start, response);
      var result = JSON.parse(response.body);
      var matches = curMatches.concat(result.matches);

      if(result.totalGames >= beginIndex + 100){
        return(getAllMatches(beginIndex + 100, matches, accountId));
      }
      else {
        console.log('match length: ' + matches.length);
        return matches;
      }
    } catch(error) {
      var end = process.hrtime();
      console.log('Seconds elapsed: ' + (end[0]-start[0]));
      console.log('Get all matches error: ', error);
      return [];
    }
  }()
}

function mostPlayed(matches){
  var perChampion = matches.reduce(function (acc, match) {
    var champion = CHAMPIONS[match.champion] ? CHAMPIONS[match.champion].name : "Not Found"
    if (acc[champion] == null) {
      acc[champion] = 0
    }
    acc[champion]++
    return acc
  }, {})

  var mostPlayed = Object.keys(perChampion).map(champion => ({ champion, totalGames: perChampion[champion] }))
  mostPlayed.sort(function (a, b) {
    return b.totalGames - a.totalGames
  })

  return ({
    first: mostPlayed[0].champion,
    second: mostPlayed[1].champion,
    third: mostPlayed[2].champion,
    fourth: mostPlayed[3].champion,
    fifth: mostPlayed[4].champion,
  });
}

function logResponseTime(start, response){
  console.log('');
  var end = process.hrtime();
  console.log('Seconds elapsed: ' + (end[0]-start[0]));
  console.log('Date: '+ response.headers.date);
  console.log(response.headers);
  /*console.log('App Rate: '+ response.headers.x-app-rate-limit);
  console.log('App Rate Count: '+ response.headers.x-app-rate-limit-count);
  console.log('Method Rate: '+ response.headers.x-method-rate-limit);
  console.log('Method Rate Count: '+ response.headers.x-method-rate-limit-count);*/
}
