exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('tenant_id')
      .notNullable()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');

    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('first_name');
    table.string('last_name');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('last_login');
    table.jsonb('settings').defaultTo('{}');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index(['tenant_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
