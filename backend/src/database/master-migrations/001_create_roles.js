// src/database/master-migrations/002_create_roles_table.js

exports.up = async function(knex) {
  // --------------------------------------------------------
  // ROLES TABLE
  // Stores system roles (like superadmin, manager, user)
  // --------------------------------------------------------
  await knex.schema.createTable('roles', (t) => {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()')); // UUID primary key

    t.string('name', 100)
      .notNullable()
      .unique(); // Role name must be unique

    t.text('description').nullable(); // Optional description

    t.boolean('is_active')
      .notNullable()
      .defaultTo(true);

    t.timestamps(true, true); // created_at and updated_at
  });

  // --------------------------------------------------------
  // PERFORMANCE INDEXES
  // --------------------------------------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_roles_name
      ON roles (name);
  `);
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('roles');
};
