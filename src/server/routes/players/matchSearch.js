const RiotRateLimiter = require('riot-ratelimiter');
const db = require('../../db');
const util = require('../references/utils');
const m = require('./matchParse');

const API_KEY = process.env.RIOT_API_KEY || '';
const limiter = new RiotRateLimiter();

const getExistingData = async (matchData) => {
  try {
    const queries = matchData.map(async (match) => {
      const query = 'SELECT match FROM public."matchInfo" WHERE match = $1';
      const response = await db.query(query, [match]);

      return response.rows[0] ? response.rows[0].match : response.rows[0];
    });
    let results = await Promise.all(queries);
    results = results.filter(Boolean);
    return results;
  } catch (error) {
    console.log('Check match data error: ', error);
    return Promise.reject(error);
  }
};

const parseData = (match) => {
  const params = [
    match.gameId, // Unique identifier for each match
    match.seasonId, // Seasons do match integer direction. e.g. season8 = id11
    match.platformId, // Region (NA, EU, KR, etc.)
    match.gameVersion, // Patch the game was played on
    match.gameDuration, // Match length in seconds
    m.filterTeam(match.teams, 100), // Blue team
    m.filterTeam(match.teams, 200), // Red team
    m.filterPlayers(match.participantIdentities, match.participants), // All player stats
  ];
  console.log('Match parameters to save in DB: ', params);

  // console.log('Test match parse: ', testResult);
  return params;
};

const saveMatchData = async (matchData) => {
  try {
    const queries = matchData.map(async (match) => {
      const query = 'INSERT INTO public."matchInfo"'
      + ' (match, season, region, patch, duration, blue, red, players)'
      + ' VALUES($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (match)'
      + ' DO UPDATE SET'
      + ' match = $1, season = $2, region = $3, patch = $4, duration = $5, blue = $6, red = $7,'
      + ' players = $8';
      // const params = parseData(match);
      const params = parseData(match);
      // const params = [match.gameId, match.seasonId];
      const response = await db.query(query, params);
      // console.log(response);
      return response.rows;
    });
    return Promise.all(queries);
  } catch (error) {
    console.log('Save match data error: ', error);
    return Promise.reject(error);
  }
};

const matchSearch = async (summoner) => {
  const t0 = Date.now();
  try {
    const curMatchData = await getExistingData(summoner.matchHistory.matchIDs);
    console.log('Current Database match info: ', summoner.name, ' - ', curMatchData.length);
    console.log(summoner.name, ' - ', util.logTime(t0), 's');

    const searchMatches = summoner.matchHistory.matchIDs.filter((match) => {
      return !curMatchData.includes(match);
    });
    console.log('New matches to search/save: ', summoner.name, ' - ', searchMatches.length);

    // Returns if database already holds all matches
    if (searchMatches.length === 0) {
      return Promise.resolve({});
    }
    const promises = searchMatches.map(async (match) => {
      const urlMatch = `https://na1.api.riotgames.com/lol/match/v4/matches/${match}`;
      const response = await limiter.executing({
        url: urlMatch,
        token: API_KEY,
        resolveWithFullResponse: true
      });
      const matchInfo = JSON.parse(response.body);
      // console.log(matchInfo);
      return matchInfo;
    });
    const detailedMatchData = await Promise.all(promises);
    await saveMatchData(detailedMatchData);

    console.log('New match data saved: ', summoner.name, ' - ', util.logTime(t0), 's');

    return detailedMatchData;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = matchSearch;
