// src/database/master-migrations/001_enable_extensions.js
exports.up = async function(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "plpgsql";');    // usually exists by default
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');   // for gen_random_uuid()
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "citext";');     // case-insensitive text
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pg_trgm";');    // for trigram indexes
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');  // for uuid_generate_v4()
};

exports.down = async function(knex) {
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp";');
  await knex.raw('DROP EXTENSION IF EXISTS "pg_trgm";');
  await knex.raw('DROP EXTENSION IF EXISTS "citext";');
  await knex.raw('DROP EXTENSION IF EXISTS "pgcrypto";');
  // plpgsql is usually not dropped
};
