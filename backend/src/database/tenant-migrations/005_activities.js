// src/database/tenant-migrations/005_activities.js
exports.up = async function(knex) {
  // Ensure required extension
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  // -------------------------------
  // ACTIVITIES TABLE
  // -------------------------------
  await knex.schema.createTable('activities', (t) => {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    t.string('module', 50)
      .notNullable(); // e.g., 'lead', 'contact', 'deal'

    t.uuid('module_id')
      .notNullable(); // reference to record in module

    t.string('type', 50)
      .notNullable(); // 'note', 'call', 'meeting', 'task'

    t.text('content')
      .nullable(); // optional details

    t.uuid('created_by')
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL'); // if user removed, keep activity

    t.jsonb('meta')
      .notNullable()
      .defaultTo('{}'); // extra metadata: priority, tags, reminder, attachments

    t.timestamps(true, true); // created_at, updated_at
  });

  // -------------------------------
  // INDEXES
  // -------------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_activities_module ON activities (module);
    CREATE INDEX IF NOT EXISTS idx_activities_module_id ON activities (module_id);
    CREATE INDEX IF NOT EXISTS idx_activities_created_by ON activities (created_by);
  `);
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('activities');
};
