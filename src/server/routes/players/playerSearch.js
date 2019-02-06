const RiotRateLimiter = require('riot-ratelimiter');
const db = require('../../db');
const matchSearch = require('./matchSearch.js');
const util = require('../references/utils');
const CHAMPIONS = require('../references/champions.js');

const API_KEY = process.env.RIOT_API_KEY || '';
const limiter = new RiotRateLimiter();

// Grab existing match IDs from db
// Query riot once with begin index 0 for 100 most recent Matches
// If all 100 matches don't match db data, query next 100 (repeat)
const getDBMatchIDs = async (summoner) => {
  try {
    const query = 'SELECT * FROM public."playerMatches" WHERE player = $1';
    const response = await db.getMatchIDs(query, [summoner]);

    return response.rows[0] ? response.rows[0].matches : [];
  } catch (error) {
    console.log('Get Database MatchIDs error: ', error);
    return Promise.reject(error);
  }
};

const testGetAllMatchIDs = async (beginIndex, curMatches, accountID, dbMatches) => {
  const urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountID}?queue=420&beginIndex=${beginIndex}&`;

  try {
    const response = await limiter.executing({
      url: urlMatches,
      token: API_KEY,
      resolveWithFullResponse: true
    });
    const result = JSON.parse(response.body);
    const riotMatches = result.matches.map((match) => {
      return match.gameId.toString();
    });
    const newMatches = riotMatches.filter((match) => {
      return !dbMatches.includes(match);
    });
    return newMatches; // wrong
  } catch (error) {
    console.log('Get all matches error: ', error);
    return Promise.reject(error);
  }
};

const getAllMatchIDs = (beginIndex, curMatches, accountID) => {
  const urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountID}?queue=420&beginIndex=${beginIndex}&`;

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
        return (getAllMatchIDs(beginIndex + 100, matches, accountID));
      }
      return matches;
    } catch (error) {
      console.log('Get All Matches error: ', error.headers);
      return Promise.reject(error);
    }
  }());
};

const mostPlayed = (matches) => {
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
};

const saveMatchIDs = async (summonerSummaries) => {
  try {
    const queries = summonerSummaries.map(async (summoner) => {
      const id = summoner.name;
      const matches = summoner.matchHistory.matchIDs;
      const query = 'INSERT INTO public."playerMatches" (player, matches)'
      + ' VALUES($1, $2) ON CONFLICT (player)'
      + ' DO UPDATE SET player = $1, matches = $2 RETURNING *';
      const response = await db.query(query, [id, matches]);
      return response.rows[0];
    });
    return Promise.all(queries);
  } catch (error) {
    console.log('Save Match IDs error: ', error);
    return Promise.reject(error);
  }
};

// Beginning of summoner lookup
const playerSearch = async (req) => {
  const summonerRequest = req.body.players; // Summoner(s) to be looked up
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
      const dbMatches = await getDBMatchIDs(summonerInfo.name);
      console.log(dbMatches.length);
      const matches = await getAllMatchIDs(0, [], summonerInfo.accountId);

      const summonerSummary = {
        name: summonerInfo.name,
        level: summonerInfo.summonerLevel,
        accountId: summonerInfo.accountId,
        matchHistory: {
          totalGames: matches.length,
          matchIDs: matches.map(match => match.gameId.toString())
        },
        mostPlayed: mostPlayed(matches)
      };
      summonerSummary.detailedStats = await matchSearch(summonerSummary);
      return summonerSummary;
    });
    const summonerSummaries = await Promise.all(promises);
    const players = await saveMatchIDs(summonerSummaries);
    players.forEach((player) => {
      console.log('Matches Saved: ', player.player);
    });
    // console.log(summonerSummaries);
    console.log('Complete!');
    console.log('Elapsed total time: ', util.logTime(t0), 's');
    return ({
      stats: summonerSummaries,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = playerSearch;
