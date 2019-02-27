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

const getTeam = (teams, id) => {
  const team = teams.filter((x) => {
    return x.teamId === id;
  })[0];

  return team;
};

module.exports = {
  getPlayerIdentity,
  getParticipantId,
  getPlayerStats,
  getTeam,
};
