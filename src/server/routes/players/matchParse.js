const gameConstants = require('../references/constants.js');

const filterTeam = (teams, teamId) => {
  const result = teams.filter((team) => {
    return team.teamId === teamId;
  })[0];
  return result;
};

const getIdentity = (playerIdentities, playerId) => {
  const playerIdentity = playerIdentities.filter((player) => {
    return player.participantId === playerId;
  })[0];
  return playerIdentity.player.summonerName;
};

const getParticipantId = (playerIdentities, summoner) => {
  const playerIdentity = playerIdentities.filter((player) => {
    return player.player.accountId === summoner.accountId;
  })[0];
  return playerIdentity.participantId;
};

const getTeammates = (playerIdentities, allPlayerStats, playerId, teamId) => {
  const teammates = allPlayerStats.filter((player) => {
    return (player.teamId === teamId && player.participantId !== playerId);
  });
  const result = teammates.map((player) => {
    return {
      name: getIdentity(playerIdentities, player.participantId),
      champion: gameConstants.getChampion(player.championId),
      lane: player.timeline.lane,
    };
  });
  return result;
};

const getEnemies = (playerIdentities, allPlayerStats, playerId, teamId) => {
  const enemies = allPlayerStats.filter((player) => {
    return (player.teamId !== teamId);
  });
  const result = enemies.map((player) => {
    return {
      name: getIdentity(playerIdentities, player.participantId),
      champion: gameConstants.getChampion(player.championId),
      lane: player.timeline.lane,
    };
  });
  return result;
};

const getPlayerStats = (participants, id) => {
  const stats = participants.filter((player) => {
    return player.participantId === id;
  })[0];
  // console.log(stats);
  return stats;
};

const filterPlayers = (playerIdentities, allPlayerStats) => {
  const result = allPlayerStats.map((player) => {
    const playerIdentity = playerIdentities.filter((identity) => {
      return player.participantId === identity.participantId;
    })[0];

    return {
      participantId: player.participantId,
      player: {
        name: playerIdentity.player.summonerName,
        accountId: playerIdentity.player.accountId,
      },
      teamId: player.teamId,
      team: getTeammates(playerIdentities, allPlayerStats, player.participantId, player.teamId),
      enemies: getEnemies(playerIdentities, allPlayerStats, player.participantId, player.teamId),
      champion: {
        id: player.championId,
        name: gameConstants.getChampion(player.championId),
        spell1: player.spell1Id,
        spell2: player.spell2Id,
      },
      stats: {
        win: player.stats.win,
        kills: player.stats.kills,
        deaths: player.stats.deaths,
        assists: player.stats.assists,
        doubleKills: player.stats.doubleKills,
        tripleKills: player.stats.tripleKills,
        quadraKills: player.stats.quadraKills,
        pentaKills: player.stats.pentaKills,
        item0: player.stats.item0,
        item1: player.stats.item1,
        item2: player.stats.item2,
        item3: player.stats.item3,
        item4: player.stats.item4,
        item5: player.stats.item5,
        item6: player.stats.item6,
        champLevel: player.stats.champLevel,
        cs: player.stats.totalMinionsKilled,
        firstBlood: player.stats.firstBloodKill,
        goldEarned: player.stats.goldEarned,
        visionScore: player.stats.visionScore,
        wardsPlaced: player.stats.wardsPlaced,
        totalDamageToChampions: player.stats.totalDamageDealthToChampions,
        totalDamageTaken: player.stats.totalDamageTaken,
        damageSelfMitigated: player.stats.damageSelfMitigated,
      }
    };
  });
  return result;
};

module.exports = {
  filterTeam,
  getTeammates,
  getEnemies,
  filterPlayers,
  getParticipantId,
  getPlayerStats
};
