const RiotRateLimiter = require('riot-ratelimiter');
const db = require('../../db');
const util = require('../references/utils');
const m = require('./matchParse');

const API_KEY = process.env.RIOT_API_KEY || '';
const limiter = new RiotRateLimiter();

const savePlayerMatchInfo = async (players) => {
  try {
    const queries = players.map(async (player) => {
      const query = 'INSERT INTO public.summoner_to_match'
        + ' (account, match_id, player_id, kills, deaths, assists, team_id,'
        + ' champion_id, total_cs, spell_1_id, spell_2_id, vision_score,'
        + ' item_0, item_1, item_2, item_3, item_4, item_5, item_6, double_kills,'
        + ' triple_kills, quadra_kills, penta_kills, total_damage_dealt,'
        + ' damage_dealt_to_champions, total_damage_taken, damage_self_mitigated,'
        + ' total_healing, gold_earned, gold_spent, champion_level, perk_0, perk_1,'
        + ' perk_2, perk_3, perk_4, perk_5, stat_perk_0, stat_perk_1, stat_perk_2)'
        + ' VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,'
        + ' $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,'
        + ' $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40)'
        + ' ON CONFLICT (account, match_id)'
        + ' DO UPDATE SET account = $1, match_id = $2, player_id = $3, kills = $4,'
        + ' deaths = $5, assists = $6, team_id = $7, champion_id = $8, total_cs = $9,'
        + ' spell_1_id = $10, spell_2_id = $11, vision_score = $12, item_0 = $13,'
        + ' item_1 = $14, item_2 = $15, item_3 = $16, item_4 = $17, item_5 = $18,'
        + ' item_6 = $19, double_kills = $20, triple_kills = $21, quadra_kills = $22,'
        + ' penta_kills = $23, total_damage_dealt = $24, damage_dealt_to_champions = $25,'
        + ' total_damage_taken = $26, damage_self_mitigated = $27, total_healing = $28,'
        + ' gold_earned = $29, gold_spent = $30, champion_level = $31, perk_0 = $32,'
        + ' perk_1 = $33, perk_2 = $34, perk_3 = $35, perk_4 = $36, perk_5 = $37,'
        + ' stat_perk_0 = $38, stat_perk_1 = $39, stat_perk_2 = $40';
      // team_id, champion_id, vision_score, item_0 to 6, total_damage_dealt, total_damage_taken
      // damage_dealt_to_champions, double_kills to penta, total_cs, spell_1_id, spell_2_id
      const response = await db.query(query, player);
      return response.rows[0];
    });
    return Promise.all(queries);
  } catch (error) {
    console.log('Save player match data error: ', error);
    throw error;
  }
};

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

const parseAllPlayers = async (match) => {
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

  return savePlayerMatchInfo(result);
};

const saveTeamMatchInfo = async (teams) => {
  try {
    const queries = teams.map(async (team) => {
      const query = 'INSERT INTO public.matches'
      + ' (match_id, team_id, win, first_drag, first_baron, first_blood, first_tower, first_inhib,'
      + ' drag_kills, baron_kills, tower_kills, inhib_kills, first_rift_herald, season, region,'
      + ' game_version, game_length, queue_id)'
      + ' VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)'
      + ' ON CONFLICT (match_id, team_id)'
      + ' DO UPDATE SET match_id = $1, team_id = $2, win = $3, first_drag = $4, first_baron = $5,'
      + ' first_blood = $6, first_tower = $7, first_inhib = $8, drag_kills = $9, baron_kills = $10,'
      + ' tower_kills = $11, inhib_kills = $12, first_rift_herald = $13, season = $14, region = $15,'
      + ' game_version = $16, game_length = $17, queue_id = $18';
      const response = await db.query(query, team);
      return response.rows[0];
    });

    return Promise.all(queries);
  } catch (error) {
    console.log('Save team data error: ', error);
    throw error;
  }
};

const parseTeam = (id, match) => {
  const team = m.getTeam(match.teams, id);

  const params = [
    match.gameId,
    team.teamId,
    team.win === 'Win',
    team.firstDragon,
    team.firstBaron,
    team.firstBlood,
    team.firstTower,
    team.firstInhibitor,
    team.dragonKills,
    team.baronKills,
    team.towerKills,
    team.inhibitorKills,
    team.firstRiftHerald,
    match.seasonId,
    match.platformId,
    match.gameVersion,
    match.gameDuration,
    match.queueId,
  ];

  return params;
};

const parseTeams = async (match) => {
  const result = [
    parseTeam(100, match),
    parseTeam(200, match),
  ];

  return saveTeamMatchInfo(result);
};

const parseAllData = async (match) => {
  const result = await Promise.all([parseAllPlayers(match), parseTeams(match)]);

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
      return parseAllData(match);
    });
    console.log('Match data parsed: ', util.logTime(t0), 's');

    // const result = [].concat(...parsedPlayerMatchData);
    const result = await Promise.all(parsedPlayerMatchData);
    return result;
  } catch (error) {
    console.log('Match search error: ', error);
    throw error;
  }
};

module.exports = matchSearch;
