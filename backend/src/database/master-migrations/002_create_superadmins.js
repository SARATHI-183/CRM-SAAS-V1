// // src/database/master-migrations/002_create_superadmins_and_modules.js
// exports.up = async function(knex) {
//   await knex.schema.createTable('superadmins', (t) => {
//     t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
//     t.string('name', 200).notNullable();
//     t.specificType('email', 'citext').notNullable().unique();
//     t.string('password_hash', 300).notNullable();
//     t.boolean('is_active').defaultTo(true);
//     t.timestamps(true, true);
//   });

//   await knex.schema.createTable('modules', (t) => {
//     t.increments('id').primary();
//     t.string('module_key', 100).notNullable().unique(); // leads, contacts, invoices
//     t.string('module_name', 200).notNullable();
//     t.boolean('is_core').defaultTo(true);
//     t.jsonb('meta').defaultTo('{}');
//     t.timestamps(true, true);
//   });

//   // optional: tenant_modules mapping (which modules are enabled for a tenant)
//   await knex.schema.createTable('tenant_modules', (t) => {
//     t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
//     t.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE');
//     t.integer('module_id').notNullable().references('id').inTable('modules').onDelete('CASCADE');
//     t.boolean('enabled').defaultTo(true);
//     t.jsonb('settings').defaultTo('{}');
//     t.timestamps(true, true);
//     t.unique(['tenant_id', 'module_id']);
//   });
// };

// exports.down = async function(knex) {
//   await knex.schema.dropTableIfExists('tenant_modules');
//   await knex.schema.dropTableIfExists('modules');
//   await knex.schema.dropTableIfExists('superadmins');
// };



// src/database/master-migrations/002_create_superadmins.js

exports.up = async function(knex) {
  // --------------------------------------------------------
  // Enable required PostgreSQL extensions
  // --------------------------------------------------------
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "citext";`);

  // --------------------------------------------------------
  // SUPER ADMINS TABLE
  // Stores platform-level administrators (not tenants)
  // --------------------------------------------------------
  await knex.schema.createTable("super_admins", (t) => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    t.string("full_name", 150).notNullable();

    t.specificType("email", "citext")
      .notNullable()
      .unique();

    t.string("password_hash", 255)
      .notNullable(); // stores bcrypt/argon2 hash

    t.string("role", 50)
      .notNullable()
      .defaultTo("superadmin");

    t.boolean("is_active")
      .notNullable()
      .defaultTo(true);

    t.timestamp("last_login_at", { useTz: true }).nullable();

    t.jsonb("meta")
      .notNullable()
      .defaultTo('{}');

    t.timestamps(true, true);
  });

  // --------------------------------------------------------
  // PERFORMANCE INDEXES
  // --------------------------------------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_super_admins_email
      ON super_admins (email);

    CREATE INDEX IF NOT EXISTS idx_super_admins_is_active
      ON super_admins (is_active);
  `);
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("super_admins");
};
