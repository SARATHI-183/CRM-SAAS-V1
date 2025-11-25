// src/database/tenant-migrations/004_deals.js
exports.up = async function(knex) {
  // Ensure extensions exist
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  // -------------------------------
  // DEALS TABLE
  // -------------------------------
  await knex.schema.createTable('deals', (t) => {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    t.string('title', 300)
      .notNullable();

    t.decimal('amount', 12, 2)
      .notNullable()
      .defaultTo(0);

    // Industry-standard stages: prospect, negotiation, won, loss, onboard
    t.string('stage', 100)
      .notNullable()
      .defaultTo('prospect');

    t.uuid('contact_id')
      .nullable()
      .references('id')
      .inTable('contacts')
      .onDelete('SET NULL');

    t.uuid('assigned_to')
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    t.jsonb('meta')
      .notNullable()
      .defaultTo('{}'); // additional custom info

    t.timestamps(true, true);
  });

  // -------------------------------
  // INDEXES FOR PERFORMANCE
  // -------------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals (stage);
    CREATE INDEX IF NOT EXISTS idx_deals_contact_id ON deals (contact_id);
    CREATE INDEX IF NOT EXISTS idx_deals_assigned_to ON deals (assigned_to);
  `);
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('deals');
};
