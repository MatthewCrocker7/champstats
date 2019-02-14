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

const createStats = (summoner, matchData) => {
  const result = {};
  const seasons = getUniqueSeasons(matchData);
  console.log('Unique seasons: ', seasons);
  result.winRates = getWinRates(summoner, matchData);

  return result;
};

module.exports = {
  createStats
};
