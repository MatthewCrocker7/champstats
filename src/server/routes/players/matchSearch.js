const RiotRateLimiter = require('riot-ratelimiter');
const db = require('../../db');
const util = require('../references/utils');
const m = require('./matchParse');
const statsUtil = require('./createPlayerStats');

const API_KEY = process.env.RIOT_API_KEY || '';
const limiter = new RiotRateLimiter();


const parsePlayer = (id, match) => {
  const playerIdenity = m.getPlayerStats(match.participantIdentities, id);
  const playerStats = m.getPlayerStats(match.participants, id);
  const params = [
    playerIdenity.player.accountId,
    match.gameId,
    id,
    playerStats.stats.kills,
    playerStats.stats.deaths,
    playerStats.stats.assists,
  ];

  console.log(params);

  return params;
};

const parseAllPlayers = (match) => {
  const result = [
    parsePlayer(1, match),
    parsePlayer(2, match),
    parsePlayer(3, match),
    parsePlayer(4, match),
    parsePlayer(5, match),
    parsePlayer(6, match),
    parsePlayer(7, match),
    parsePlayer(8, match),
    parsePlayer(9, match),
    parsePlayer(10, match),
  ];

  return result;
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
*/

const matchSearch = async (matches) => {
  const t0 = Date.now();
  try {
    const promises = matches.map(async (match) => {
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
    console.log('Match data retrieved: ', util.logTime(t0), 's');

    const parsedPlayerMatchData = rawMatchData.map((match) => {
      return parseAllPlayers(match);
    });
    console.log('Match data parsed: ', util.logTime(t0), 's');

    const result = [].concat(...parsedPlayerMatchData);

    return result;
  } catch (error) {
    console.log('Match search error: ', error);
    throw error;
  }
};

module.exports = matchSearch;
