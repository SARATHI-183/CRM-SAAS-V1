
exports.up = async function (knex) {
  // --------------------------------------------------------
  // USERS TABLE
  // --------------------------------------------------------
  await knex.schema.createTable("users", (t) => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    t.string("full_name", 200).notNullable();

    t.specificType("email", "citext")
      .notNullable()
      .unique();

    t.string("password_hash", 300).notNullable();

    t.boolean("is_active")
      .notNullable()
      .defaultTo(true);

    t.timestamps(true, true);
  });

  // --------------------------------------------------------
  // ROLES TABLE
  // --------------------------------------------------------
  await knex.schema.createTable("roles", (t) => {
    t.increments("id").primary();
    t.string("name", 100).notNullable(); // Admin, Sales, Manager
    t.timestamps(true, true);
  });

  // --------------------------------------------------------
  // USER_ROLES (Many-to-many)
  // --------------------------------------------------------
  await knex.schema.createTable("user_roles", (t) => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    t.uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // Delete mapping if user removed

    t.integer("role_id")
      .notNullable()
      .references("id")
      .inTable("roles")
      .onDelete("CASCADE"); // Safe

    t.timestamps(true, true);

    t.unique(["user_id", "role_id"]);
  });

  // --------------------------------------------------------
  // INDEXES (performance)
  // --------------------------------------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    CREATE INDEX IF NOT EXISTS idx_users_is_active ON users (is_active);
    CREATE INDEX IF NOT EXISTS idx_roles_name ON roles (name);
    CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles (user_id);
    CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles (role_id);
  `);
};

exports.down = async function (knex) {
  await knex.schema.raw(`
    DROP INDEX IF EXISTS idx_user_roles_role_id;
    DROP INDEX IF EXISTS idx_user_roles_user_id;
    DROP INDEX IF EXISTS idx_roles_name;
    DROP INDEX IF EXISTS idx_users_is_active;
    DROP INDEX IF EXISTS idx_users_email;
  `).catch(() => { /* ignore */ });

  await knex.schema.dropTableIfExists("user_roles");
  await knex.schema.dropTableIfExists("roles");
  await knex.schema.dropTableIfExists("users");
};
