// src/database/tenant-migrations/007_audit_log.js
exports.up = async function(knex) {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  // ---------------------------------------
  // AUDIT LOGS TABLE
  // ---------------------------------------
  await knex.schema.createTable('audit_logs', (t) => {
    t.uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    t.string('table_name', 150)
      .notNullable(); // Table where the change occurred

    t.uuid('record_id')
      .nullable(); // ID of the record changed

    t.string('operation', 20)
      .notNullable(); // INSERT, UPDATE, DELETE

    t.jsonb('old_data')
      .nullable(); // snapshot before change

    t.jsonb('new_data')
      .nullable(); // snapshot after change

    t.uuid('performed_by')
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL'); // user who performed the action

    t.timestamp('changed_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    t.timestamps(true, true); // created_at, updated_at
  });

  // -----------------------------
  // INDEXES FOR PERFORMANCE
  // -----------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name
    ON audit_logs (table_name);

    CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id
    ON audit_logs (record_id);

    CREATE INDEX IF NOT EXISTS idx_audit_logs_performed_by
    ON audit_logs (performed_by);
  `);
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('audit_logs');
};
