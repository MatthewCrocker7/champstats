const RiotRateLimiter = require('riot-ratelimiter');
const CHAMPIONS = require('./champions.js');
// const API_KEY = require('../../../riot_api_key.js');
const API_KEY = process.env.RIOT_API_KEY || '';

const limiter = new RiotRateLimiter();

function getAllMatches(beginIndex, curMatches, accountId) {
  const urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&beginIndex=${beginIndex}&`;

  return (async function search() {
    try {
      const response = await limiter.executing({
        url: urlMatches,
        token: API_KEY,
        resolveWithFullResponse: true
      });
      const result = JSON.parse(response.body);
      const matches = curMatches.concat(result.matches);

      if (result.totalGames >= beginIndex + 100) {
        return (getAllMatches(beginIndex + 100, matches, accountId));
      }
      return matches;
    } catch (error) {
      console.log('Get All Matches error: ', error);
      return [];
    }
  }());
}

function mostPlayed(matches) {
  const perChampion = matches.reduce((acc, match) => {
    const champion = CHAMPIONS[match.champion] ? CHAMPIONS[match.champion].name : 'Not Found';
    if (!acc[champion]) {
      acc[champion] = 0;
    }
    acc[champion] += 1;
    return acc;
  }, {});

  const result = Object.keys(perChampion).map(champion => ({
    name: champion,
    totalGames: perChampion[champion]
  }));
  result.sort((a, b) => {
    return b.totalGames - a.totalGames;
  });

  return ({
    first: result[0],
    second: result[1],
    third: result[2],
    fourth: result[3],
    fifth: result[4],
  });
}

// Beginning of summoner lookup
const playerSearch = async (req) => {
  const exitNotFound = (statusCode) => {
    return statusCode;
  };

  const summonerRequest = req.body.players; // Summoner(s) to be looked up
  if (summonerRequest[0] === '') {
    return exitNotFound(404);
  }
  const t0 = Date.now();
  console.log('Start: ', summonerRequest);

  try {
    const promises = summonerRequest.map(async (summoner) => {
      const urlSummonerName = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}?`;

      const response = await limiter.executing({
        url: urlSummonerName,
        token: API_KEY,
        resolveWithFullResponse: true
      });
      const summonerInfo = JSON.parse(response.body);
      const matches = await getAllMatches(0, [], summonerInfo.accountId);

      const summonerSummary = {
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
    });
    const summonerSummaries = await Promise.all(promises);
    console.log('Complete!');
    console.log(`Elapsed search time: ${Math.round((Date.now() - t0) / 1000)}s`);
    return ({
      stats: summonerSummaries,
    });
  } catch (error) {
    const errorCode = error.statusCode;
    console.log('Error: ', error.status);
    return exitNotFound(errorCode);
  }
};

module.exports = playerSearch;
