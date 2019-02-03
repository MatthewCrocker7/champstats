const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

module.exports = {
  getMatchIDs: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};

// Update match IDs of a player
// const sqlQuery = 'INSERT INTO public."playerMatches" (player, matches) VALUES($1, $2) ON CONFLICT (player) DO UPDATE SET matches = $2 RETURNING *'
// Get player current matcheIDs
// const response = await db.getMatchIDs('SELECT * FROM public."playerMatches" WHERE player = $1', [id]);
