exports.up = function(knex) {
  return knex.schema.createTable("roles", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("role_key").notNullable().unique();
    table.string("role_name").notNullable();
    table.string("description");
    table.boolean("is_system_role").defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("roles");
};
