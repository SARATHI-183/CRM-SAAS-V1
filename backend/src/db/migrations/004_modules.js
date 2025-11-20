// 005_modules.js
exports.up = function(knex) {
  return knex.schema.createTable("modules", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("tenant_id")
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE")
      .nullable();
    table.string("module_key").notNullable().unique();
    table.string("module_name").notNullable();
    table.string("description");
    table.boolean("is_enabled").defaultTo(true);
    table.boolean("is_core").defaultTo(false); // Add is_core column for seed distinction
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("modules");
};
