// 004_users.js
exports.up = function(knex) {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("tenant_id")
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE")
      .nullable();
    table.uuid("role_id")
      .references("id")
      .inTable("roles")
      .onDelete("CASCADE")
      .notNullable();
    table.string("full_name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
