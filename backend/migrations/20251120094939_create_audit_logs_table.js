exports.up = function (knex) {
  return knex.schema.createTable('audit_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('tenant_id')
      .notNullable()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');

    table.uuid('module_id');
    table.uuid('record_id');

    table.uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.string('action').notNullable(); // created, updated, deleted, approved
    table.jsonb('old_value');
    table.jsonb('new_value');

    table.timestamp('timestamp').defaultTo(knex.fn.now());

    table.index(['tenant_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('audit_logs');
};
