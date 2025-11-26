

// src/database/master-migrations/002_create_superadmins.js

exports.up = async function(knex) {
 
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
