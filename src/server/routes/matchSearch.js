const RiotRateLimiter = require('riot-ratelimiter');
const db = require('../db');
// const API_KEY = require('../../../../riot_api_key.js');
const API_KEY = process.env.RIOT_API_KEY || '';

const limiter = new RiotRateLimiter();

const getExistingData = async (matchData) => {
  try {
    const queries = matchData.map(async (match) => {
      const query = 'SELECT match FROM public."matchInfo" WHERE match = $1';
      const response = await db.query(query, [match]);
      return response.rows[0].match;
    });
    return Promise.all(queries);
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
    console.log('All matches: ', summoner.matchHistory.matchIDs);
    const searchMatches = summoner.matchHistory.matchIDs.filter((match) => {
      return curMatchData.includes(match);
    });
    console.log('Search matches: ', searchMatches);
    console.log('Total current saved matches: ', curMatchData.length);
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

    // const testSave = await saveMatchData(detailedMatchData);
    // console.log(testSave);
    const t1 = (Date.now() - t0) / 1000;
    console.log('Match Search Time : ', summoner.name, ' - ', t1, 's');

    return detailedMatchData;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = matchSearch;
