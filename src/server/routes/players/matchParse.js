const gameConstants = require('../references/constants.js');

const getTeammates = (playerIdentities, allPlayerStats, playerId, teamId) => {
  const teammates = allPlayerStats.filter((player) => {
    return (player.teamId === teamId && player.participantId !== playerId);
  });
  const result = teammates.map((player) => {
    return {
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
      champion: gameConstants.getChampion(player.championId),
      lane: player.timeline.lane,
    };
  });
  return result;
};

const getPlayerIdentity = (playerIdentities, id) => {
  const playerIdentity = playerIdentities.filter((player) => {
    return player.participantId === id;
  })[0];
  return playerIdentity;
};

const getParticipantId = (playerIdentities, summoner) => {
  const playerIdentity = playerIdentities.filter((player) => {
    return player.player.accountId === summoner.accountId;
  })[0];
  return playerIdentity.participantId;
};

const getPlayerStats = (participants, id) => {
  const stats = participants.filter((player) => {
    return player.participantId === id;
  })[0];
  // console.log(stats);
  return stats;
};


module.exports = {
  getPlayerIdentity,
  getParticipantId,
  getPlayerStats,
};
