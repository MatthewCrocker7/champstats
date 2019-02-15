const RiotRateLimiter = require('riot-ratelimiter');
const db = require('../../db');
const util = require('../references/utils');
const m = require('./matchParse');
const statsUtil = require('./createPlayerStats');

const API_KEY = process.env.RIOT_API_KEY || '';
const limiter = new RiotRateLimiter();

const parseRawMatchDataPG = (match) => {
  // This function parses match data into an array to save to SQL
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

  return params;
};

/*
-- summoner table
| summoner_id | player_name |

-- summoner_to_match <-----
| summoner_id | match_id | win true/false  | team (red/blue) | stats (json) |    |
| summoner_1 | 1 |
| summoner_2 | 1 |
| summoner_2 | 1 |

-- matches
| match_id | red-team-win: true |  blue-team-win: false |
*/

// fetch summoner - insert into summoner table
// fetch matches for summoner from riot
//   for each:
//      insert into matches the match info
//      insert into summoner_to_match the linkage

//  SELECT * FROM matches
//    JOIN summoner_to_match ON summoner_to_match.match_id = match.match_id
//    JOIN summoner ON summoner.id = summoner_to_match.summoner_id
//  WHERE summoner.summoner_id = $1
//
//  SELECT COUNT(*) FROM matches
//    JOIN summer_to_match ON summoner_to_match.match_id = match.match_id
//    JOIN summoner ON summoner.id = summoner_to_match.summoner_id
//  WHERE summon.summmoner_id = $1 AND match_outcome = loss
//

const matchSearch = async (summoner) => {
  const t0 = Date.now();
  try {
    const curMatchData = await getExistingData(summoner.matchHistory.matchIDs);
    console.log('Current Database match info: ', summoner.name, ' - ', curMatchData.length);
    console.log('Query existing DB time: ', summoner.name, ' - ', util.logTime(t0), 's');

    // Returns an array of matchIDs with existing statistics to compare with potential new IDs
    const curMatchIDs = curMatchData.map((data) => {
      return data.match;
    });
    const searchMatches = summoner.matchHistory.matchIDs.filter((match) => {
      return !curMatchIDs.includes(match);
    });
    console.log('New matches to search/save: ', summoner.name, ' - ', searchMatches.length);

    // Returns if database already holds all matches
    if (searchMatches.length === 0) {
      // console.log(curMatchData);
      const temp = statsUtil.createStats(summoner, curMatchData);
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

    const rawMatchData = await Promise.all(promises);
    const pgParams = rawMatchData.map((match) => {
      return parseRawMatchDataPG(match);
    });
    saveMatchData(pgParams); // Parses and saves new match data to SQL

    const parsedMatchData = parseRawMatchData(rawMatchData);

    const allMatchData = curMatchData.concat(parsedMatchData);
    // console.log(allMatchData);

    const stats = statsUtil.createStats(summoner, allMatchData);
    console.log('MATCH STATS COMPLETE: ', summoner.name, ' - ', util.logTime(t0), 's');

    return allMatchData;
  } catch (error) {
    console.log('Match search error: ', error);
    throw error;
  }
};

module.exports = matchSearch;

/*


const parseRawMatchData = (rawMatches) => {
  const result = rawMatches.map((match) => {
    return {
      match: match.gameId.toString(),
      season: match.seasonId,
      region: match.platformId,
      patch: match.gameVersion, // Patch the game was played on
      duration: match.gameDuration, // Match length in seconds
      blue: m.filterTeam(match.teams, 100), // Blue team
      red: m.filterTeam(match.teams, 200), // Red team
      players: m.filterPlayers(match.participantIdentities, match.participants), // All player stats
    };
  });
  return result;
};

const saveMatchData = async (pgParams) => {
  try {
    const queries = pgParams.map(async (params) => {
      const query = 'INSERT INTO public."matchInfo"'
      + ' (match, season, region, patch, duration, blue, red, players)'
      + ' VALUES($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (match)'
      + ' DO UPDATE SET'
      + ' match = $1, season = $2, region = $3, patch = $4, duration = $5, blue = $6, red = $7,'
      + ' players = $8';
      const response = await db.query(query, params);
      return response.rows;
    });
    return Promise.all(queries);
  } catch (error) {
    console.log('Save match data error: ', error);
    throw error;
  }
};

*/
