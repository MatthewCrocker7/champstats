const RiotRateLimiter = require('riot-ratelimiter');
const db = require('../../db');
const matchSearch = require('./matchSearch.js');
const util = require('../references/utils');

const API_KEY = process.env.RIOT_API_KEY || '';
const limiter = new RiotRateLimiter();

// Grab existing match IDs from db
// Query riot once with begin index 0 for 100 most recent Matches
// If all 100 matches don't match db data, query next 100 (repeat)
const getDBMatchIds = async (summoner) => {
  // This database will only contain ids if that specific name has been searched
  try {
    const query = 'SELECT * FROM public.summoner_match_ids'
    + ' WHERE account = $1';
    const response = await db.query(query, [summoner.accountId]);

    return response.rows[0] ? response.rows[0].matches : [];
  } catch (error) {
    console.log('Get DB Match Id error: ', error);
    throw error;
  }
};

const saveDBMatchIds = async (summoner, matches) => {
  // This database will only contain ids if that specific name has been searched
  try {
    const query = 'INSERT INTO public.summoner_match_ids (account, matches)'
      + ' VALUES($1, $2) ON CONFLICT (account)'
      + ' DO UPDATE SET account = $1, matches = $2';
    const params = [summoner.accountId, matches];
    const response = await db.query(query, params);

    return response;
  } catch (error) {
    console.log('Save DB Match Id error: ', error);
    throw error;
  }
};

const getAllMatchIds = async (index, accountID, dbMatches) => {
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
    // console.log('New Match IDs: ', newMatches.length);
    const allMatches = newMatches.length > 0 ? newMatches.concat(dbMatches) : dbMatches;

    if (newMatches.length < 100) {
      return allMatches;
    }
    return (getAllMatchIds(index + 100, accountID, allMatches));
  } catch (error) {
    console.log('Get all matches error: ', error);
    throw error;
  }
};

const saveSummonerMatchData = async (summoner, matches) => {
  // This saves match data of everyone in every match
  // Regardless if they were the name searched or not
  const matchData = await matchSearch(summoner, matches);
  try {
    const queries = matchData.map(async (match) => {
      const query = 'INSERT INTO public.summoner_to_match'
        + ' (account, match_id, player_id, kills, deaths, assists)'
        + ' VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT (account, match_id)'
        + ' DO UPDATE SET account = $1, match_id = $2, player_id = $3, kills = $4,'
        + ' deaths = $5, assists = $6';
        // team_id, champion_id, vision_score, item_0 to 6, total_damage_dealt, total_damage_taken
        // damage_dealt_to_champions, double_kills to penta, total_cs, spell_1_id, spell_2_id
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

    if (response.rowCount === 0 || response.rows[0].name !== summoner.name) {
      await saveSummoner(summoner);
    }

    const dbMatchData = response.rows;
    const dbMatchIds = await getDBMatchIds(summoner);

    console.log('DB matches length: ', dbMatchIds.length);
    console.log('Time elapsed: ', summoner.name, ' - ', util.logTime(t0), 's');

    const allMatchIds = await getAllMatchIds(0, summoner.accountId, dbMatchIds); // Gets new matches
    console.log('Total matches length: ', allMatchIds.length);
    console.log('Time elapsed: ', summoner.name, ' - ', util.logTime(t0), 's');

    saveDBMatchIds(summoner, allMatchIds);
    console.log('Database match ids saved!');
    console.log('Time elapsed: ', summoner.name, ' - ', util.logTime(t0), 's');

    const newMatchIds = allMatchIds.filter((match) => { // Filters all match ids into new matches
      return !dbMatchIds.includes(match);
    });
    if (newMatchIds.length === 0 && dbMatchData.length === dbMatchIds.length) {
      // Returns data if there are no new matches
      // Parse stats first
      return dbMatchData;
    }

    let result;
    if (dbMatchData.length === dbMatchIds.length) {
      // Saves only new match data
      const newMatchData = await saveSummonerMatchData(newMatchIds);
      result = newMatchData.concat(dbMatchData);
    } else if (newMatchIds.length === 0) {
      // Saves data that should already be there
      result = await saveSummonerMatchData(dbMatchIds);
    } else {
      // Saves all match data
      result = await saveSummonerMatchData(allMatchIds);
    }

    console.log('Matches saved!');
    console.log('Time elapsed: ', util.logTime(t0), 's');

    // Parse result into final summary stats here

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
