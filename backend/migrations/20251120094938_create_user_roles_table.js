exports.up = function (knex) {
  return knex.schema.createTable('user_roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('tenant_id')
      .notNullable()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');

    table.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.uuid('role_id')
      .notNullable()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');

    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index(['tenant_id']);
    table.unique(['user_id', 'role_id']); // prevent duplicate role assignment
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('user_roles');
};
