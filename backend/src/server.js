// src/server.js
require('dotenv').config();
const app = require('./app');
const { knex } = require('./database/knex');
const runMasterMigrations = require('./database/utils/runMasterMigrations');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // run master migrations first
    await runMasterMigrations();
    console.log('Master migrations applied');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
