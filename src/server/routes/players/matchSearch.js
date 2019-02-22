const RiotRateLimiter = require('riot-ratelimiter');
const db = require('../../db');
const util = require('../references/utils');
const m = require('./matchParse');
const statsUtil = require('./createPlayerStats');

const API_KEY = process.env.RIOT_API_KEY || '';
const limiter = new RiotRateLimiter();


const parsePlayer = (id, match) => {
  const playerIdenity = m.getPlayerStats(match.participantIdentities, id);
  const player = m.getPlayerStats(match.participants, id);
  const params = [
    playerIdenity.player.accountId,
    match.gameId,
    id,
    player.stats.kills,
    player.stats.deaths,
    player.stats.assists,
    player.teamId, // team id
    player.championId, // champ id
    player.stats.totalMinionsKilled + player.stats.neutralMinionsKilled, // cs
    player.spell1Id, // spell 1 id
    player.spell2Id, // spell 2 id
    player.stats.visionScore, // vision score
    player.stats.item0, // item 0
    player.stats.item1, // item 1
    player.stats.item2, // item 2
    player.stats.item3, // item 3
    player.stats.item4, // item 4
    player.stats.item5, // item 5
    player.stats.item6, // item 6
    player.stats.doubleKills, // double kills
    player.stats.tripleKills, // triple
    player.stats.quadraKills, // quadra
    player.stats.pentaKills, // penta
    player.stats.totalDamageDealt, // damage dealt
    player.stats.totalDamageDealtToChampions, // damage to champs
    player.stats.totalDamageTaken, // damage taken
    player.stats.damageSelfMitigated, // damage mitigated
    player.stats.totalHeal, // total healing 28
    player.stats.goldEarned, // gold earned
    player.stats.goldSpent, // gold spent
    player.stats.champLevel, // champion level 31
    player.stats.perk0,
    player.stats.perk1,
    player.stats.perk2,
    player.stats.perk3,
    player.stats.perk4,
    player.stats.perk5,
    player.stats.statPerk0,
    player.stats.statPerk1,
    player.stats.statPerk2,
  ];
  // gold_earned, gold_spent, champion_level, damage_self_mitigated (added to table) total_heal?
  // perk_0 through perk_5, stat_perk_0 to 2
  // console.log(params);

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
