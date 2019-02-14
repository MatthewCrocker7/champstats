const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

/*
async function query(text) {
  const client = await pool.connect()
  try {
    return await client.query(text)
  } finally {
    client.release()

  }
}

const updateAccounts = async (fromId, toId, amount) => {
  const client = await pool.connect();
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET amount = -100 where id = ${fromId}')
  await client.query('UPDATE accounts SET amount = 100 where id = ${toId}')
  await client.query('COMMIT')
} */

module.exports = {
  getMatchIDs: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};
