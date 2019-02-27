const parser = require('pg').types;
const gameConstants = require('../references/constants.js');

const getUniqueSeasons = (matchData) => {
  const seasons = matchData.map((match) => {
    return match.season;
  });
  const result = [...new Set(seasons)];
  return result;
};

const getWinRates = (summoner, matchData) => {

};

const getKDA = (matches) => {
  const kills = matches.reduce((total, match) => {
    return total + (match.kills + match.assists);
  }, 0);
  const deaths = matches.reduce((total, match) => {
    return total + (match.deaths);
  }, 0);
  console.log('Reducer Kills: ', kills);
  console.log('Reducer Deaths: ', deaths);
  const result = kills / deaths;
  console.log('Total KDA by reducer: ', result);

  return result;
};

const createStats = (summoner, matchData) => {
  const result = {};
  const seasons = getUniqueSeasons(matchData);
  console.log('Unique seasons: ', seasons);
  result.winRates = getWinRates(summoner, matchData);

  return result;
};

module.exports = {
  getKDA,
  createStats
};
