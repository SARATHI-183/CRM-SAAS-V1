exports.up = function (knex) {
  return knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('tenant_id')
      .notNullable()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');

    table.string('role_name').notNullable();
    table.string('description');
    table.boolean('is_system').defaultTo(false);

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index(['tenant_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('roles');
};
