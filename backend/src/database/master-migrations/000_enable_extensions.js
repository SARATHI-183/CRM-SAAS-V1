// src/database/master-migrations/000_enable_extensions.js
exports.up = async function(knex) {
  // pgcrypto provides gen_random_uuid()
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "citext";');
};

exports.down = async function(knex) {
  await knex.raw('DROP EXTENSION IF EXISTS "citext";');
  await knex.raw('DROP EXTENSION IF EXISTS "pgcrypto";');
};
