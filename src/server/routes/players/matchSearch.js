const RiotRateLimiter = require('riot-ratelimiter');
const db = require('../../db');
const util = require('../references/utils');
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

const saveMatchData = async (matchData) => {
  try {
    const queries = matchData.map(async (match) => {
      const query = 'INSERT INTO public."matchInfo" (match, season)'
      + ' VALUES($1, $2) ON CONFLICT (match)'
      + ' DO UPDATE SET match = $1, season = $2';
      const response = await db.query(query, [match.gameId, match.seasonId]);
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
    console.log('Database total matches: ', curMatchData.length);
    console.log('Riot total matches: ', summoner.matchHistory.matchIDs.length);
    const searchMatches = summoner.matchHistory.matchIDs.filter((match) => {
      return !curMatchData.includes(match);
    });

    console.log('New Matches: ', searchMatches.length);
    if (searchMatches.length === 0) {
      console.log('Match Data Retreived: ', summoner.name, ' - ', util.logTime(t0), 's');
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

      return matchInfo;
    });
    const detailedMatchData = await Promise.all(promises);
    await saveMatchData(detailedMatchData);

    console.log('Match Search/Save Time: ', summoner.name, ' - ', util.logTime(t0), 's');

    return detailedMatchData;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = matchSearch;
