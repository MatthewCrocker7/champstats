const filterTeam = (teams, id) => {
  const result = teams.filter((team) => {
    return team.teamId === id;
  });
  return result;
};

module.exports = {
  filterTeam
};
