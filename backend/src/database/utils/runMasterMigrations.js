// // src/database/utils/runMasterMigrations.js
// const { knex } = require('../knex');

// module.exports = async function runMasterMigrations() {
//   await knex.migrate.latest({
//     directory: './src/database/master-migrations',
//     tableName: 'knex_master_migrations'
//   });
// };


// src/database/utils/runMasterMigrations.js
const { knex } = require('../knex');

/**
 * Runs all master migrations (tenants, modules, superadmins, etc.)
 * This should run only once during application startup.
 */
async function runMasterMigrations() {
  console.log('Running master migrations...');

  await knex.migrate.latest({
    directory: './src/database/master-migrations',
    tableName: 'knex_master_migrations',
  });

  console.log('Master migrations completed.');
}

module.exports = runMasterMigrations;
