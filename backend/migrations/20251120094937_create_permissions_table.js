exports.up = function (knex) {
  return knex.schema.createTable('permissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('tenant_id')
      .notNullable()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');

    table.uuid('module_id'); // dynamic modules (optional)

    table.string('action').notNullable();   // create, read, update, delete, approve

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index(['tenant_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('permissions');
};
