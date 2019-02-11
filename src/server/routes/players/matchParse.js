const champions = require('../references/champions.js');

const filterTeam = (teams, id) => {
  const result = teams.filter((team) => {
    return team.teamId === id;
  })[0];
  return result;
};

const filterPlayerTeams = (allPlayerStats, id) => {
  const result = allPlayerStats.filter((player) => {
    return player.teamId === id;
  });
  const teamPlayers = result.map((player) => {
    return player.participantId;
  });
  return teamPlayers;
};

const filterPlayer = (players, allPlayerStats, id) => {
  const identity = players.filter((player) => {
    return player.participantId === id;
  })[0];
  const playerStats = allPlayerStats.filter((player) => {
    return player.participantId === id;
  })[0];
  const result = {
    playerId: id,
    teamId: playerStats.teamId,
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
