const champions = require('../references/champions.js');

const filterTeam = (teams, teamId) => {
  const result = teams.filter((team) => {
    return team.teamId === teamId;
  })[0];
  return result;
};

const filterPlayerTeams = (allPlayerStats, teamId) => {
  const result = allPlayerStats.filter((player) => {
    return player.teamId === teamId;
  });
  const teamPlayers = result.map((player) => {
    return player.participantId;
  });
  return teamPlayers;
};

const getIdentity = (playerIdentities, playerId) => {
  const playerIdentity = playerIdentities.filter((player) => {
    return player.participantId === playerId;
  })[0];
  return playerIdentity.player.summonerName;
};

const getTeammates = (playerIdentities, allPlayerStats, playerId, teamId) => {
  const teammates = allPlayerStats.filter((player) => {
    return (player.teamId === teamId && player.participantId !== playerId);
  });
  const result = teammates.map((player) => {
    return {
      name: getIdentity(playerIdentities, player.participantId),
      champion: champions[player.championId],
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
      champion: champions[player.championId],
      lane: player.timeline.lane,
    };
  });
  return result;
};

const filterPlayer = (playerIdentities, allPlayerStats, playerId) => {
  const identity = playerIdentities.filter((player) => {
    return player.participantId === playerId;
  })[0];
  const playerStats = allPlayerStats.filter((player) => {
    return player.participantId === playerId;
  })[0];

  // Final return result
  const result = {
    participantId: playerId,
    player: {
      name: identity.player.summonerName,
      accountId: identity.player.accountId,
    },
    teamId: playerStats.teamId,
    teammates: getTeammates(playerIdentities, allPlayerStats, playerId, playerStats.teamId),
    enemies: getEnemies(playerIdentities, allPlayerStats, playerId, playerStats.teamId),
    champion: {
      id: playerStats.championId,
      name: champions[playerStats.championId],
      spell1: playerStats.spell1Id,
      spell2: playerStats.spell2Id,
    }
  };
  return result;
};

module.exports = {
  filterTeam,
  filterPlayer
};
