const RiotRateLimiter = require('riot-ratelimiter');
const db = require('../../db');
const matchSearch = require('./matchSearch.js');
const util = require('../references/utils');

const API_KEY = process.env.RIOT_API_KEY || '';
const limiter = new RiotRateLimiter();

// Grab existing match IDs from db
// Query riot once with begin index 0 for 100 most recent Matches
// If all 100 matches don't match db data, query next 100 (repeat)
const getAllDBMatchIDs = async (accountId) => {
  try {
    const query = 'SELECT * FROM public.summoner_to_match WHERE account = $1';
    const response = await db.getMatchIDs(query, [accountId]);

    return response.rows;
  } catch (error) {
    console.log('Get Database MatchIDs error: ', error);
    throw error;
  }
};

const getAllMatchIDs = async (index, accountID, dbMatches) => {
  const urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountID}?queue=420&beginIndex=${index}&`;
  // This function only works if 0 matches are saved, or if only brand new matches are missing.
  // If a match from a year ago is deleted and there are 100 matches saved that occurred after,
  // this function won't detect that old match
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
    console.log('New Match IDs: ', newMatches.length);
    const allMatches = newMatches.length > 0 ? newMatches.concat(dbMatches) : dbMatches;

    if (newMatches.length < 100) {
      return allMatches;
    }
    return (getAllMatchIDs(index + 100, accountID, allMatches));
  } catch (error) {
    console.log('Get all matches error: ', error);
    throw error;
  }
};

const saveSummonerMatchData = async (summoner, matches) => {
  const matchData = await matchSearch(summoner, matches);
  try {
    const queries = matchData.map(async (match) => {
      const query = 'INSERT INTO public.summoner_to_match'
        + ' (account, match_id, player_id, kills, deaths, assists)'
        + ' VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT (account, match_id)'
        + ' DO UPDATE SET account = $1, match_id = $2, player_id = $3, kills = $4,'
        + ' deaths = $5, assists = $6';
      const response = await db.query(query, match);
      return response.rows[0];
    });
    return Promise.all(queries);
  } catch (error) {
    console.log('Save summoner match data error: ', error);
    throw error;
  }
};

const saveSummoner = async (summoner) => {
  try {
    const saveQuery = 'INSERT INTO public.summoners (puuid, account, name)'
      + ' VALUES ($1, $2, $3) ON CONFLICT (puuid)'
      + ' DO UPDATE SET puuid = $1, account = $2, name = $3';
    const saveParams = [summoner.puuid, summoner.accountId, summoner.name];
    const response = await db.query(saveQuery, saveParams);

    return response;
  } catch (error) {
    console.log('Save summoner error: ', error);
    throw error;
  }
};

const getSummoner = async (summoner) => {
  const t0 = Date.now();
  try {
    // const getQuery = 'SELECT * FROM public.summoners WHERE puuid = $1';
    const getQuery = 'SELECT * FROM public.summoner_to_match JOIN'
    + ' public.summoners ON public.summoners.account = public.summoner_to_match.account'
    + ' WHERE public.summoners.puuid = $1';
    const getParam = [summoner.puuid];
    const response = await db.query(getQuery, getParam);
    // console.log(response.rows);
    if (response.rowCount === 0 || response.rows[0].name !== summoner.name) {
      await saveSummoner(summoner);
    }

    const dbMatchData = response.rows;
    const dbMatchIds = dbMatchData.map((match) => { // Filters match data into match ids
      return match.match_id;
    });
    console.log('DB matches length: ', dbMatchData.length);
    console.log('Time elapsed: ', util.logTime(t0), 's');

    const allMatchIds = await getAllMatchIDs(0, summoner.accountId, dbMatchIds); // Gets new matches
    console.log('Total matches length: ', allMatchIds.length);
    console.log('Time elapsed: ', util.logTime(t0), 's');

    let newMatchData = allMatchIds.filter((match) => { // Filters all match ids into new matches
      return !dbMatchIds.includes(match);
    });
    newMatchData = await saveSummonerMatchData(summoner, newMatchData); // Saves new match data
    console.log('Matches saved!');
    console.log('Time elapsed: ', util.logTime(t0), 's');

    const result = newMatchData.concat(dbMatchData);

    return result;
  } catch (error) {
    console.log('Get summoner error: ', error);
    throw error;
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

      const summonerSummary = {
        name: summonerInfo.name,
        level: summonerInfo.summonerLevel,
        accountId: summonerInfo.accountId,
        puuid: summonerInfo.puuid,
      };

      const summonerStats = await getSummoner(summonerSummary);
      summonerSummary.matchHistory = {
        totalGames: summonerStats.length,
        matchIDs: [1, 2, 3]
      };

      console.log(summonerSummary.name, ' completed in ', util.logTime(t0), 's');
      return summonerSummary;
    });
    const summonerSummaries = await Promise.all(promises);

    console.log('ALL COMPLETE');
    console.log('ELAPSED TOTAL TIME: ', util.logTime(t0), 's');
    return ({
      stats: summonerSummaries,
    });
  } catch (error) {
    console.log('Player search error: ', error);
    throw error;
  }
};

module.exports = playerSearch;

/*
const oldGetDBMatchIDs = async (summoner) => {
  try {
    const query = 'SELECT * FROM public."playerMatches" WHERE player = $1';
    const response = await db.getMatchIDs(query, [summoner]);

    return response.rows[0] ? response.rows[0].matches : [];
  } catch (error) {
    console.log('Get Database MatchIDs error: ', error);
    return Promise.reject(error);
  }
};

const oldGetAllMatchIDs = async (index, accountID, dbMatches) => {
  const urlMatches = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountID}?queue=420&beginIndex=${index}&`;

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
    console.log('New Match IDs: ', newMatches.length);
    const allMatches = newMatches.length > 0 ? newMatches.concat(dbMatches) : dbMatches;

    if (newMatches.length < 100) {
      return allMatches;
    }
    return (getAllMatchIDs(index + 100, accountID, allMatches));
  } catch (error) {
    console.log('Get all matches error: ', error);
    return Promise.reject(error);
  }
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
*/
