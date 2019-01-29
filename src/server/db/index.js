const { Client } = require('pg');

const DATABASE_URL = 'postgres://flnejcnfxdjgzl:3c608eb6453b88a16211786063037bde47bcab896d70935345ab5100d836c0b2@ec2-23-21-86-22.compute-1.amazonaws.com:5432/dbsrqnf5gevqua';

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: true,
});
// await client.connect();
