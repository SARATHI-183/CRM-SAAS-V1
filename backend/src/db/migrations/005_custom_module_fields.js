// 006_custom_modules_fields.js
exports.up = function(knex) {
  return knex.schema
    .createTable("custom_modules", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("tenant_id")
        .references("id")
        .inTable("tenants")
        .onDelete("CASCADE")
        .nullable();
      table.string("module_key").notNullable();
      table.string("name").notNullable();
      table.jsonb("config").nullable();
      table.boolean("is_enabled").defaultTo(true);
      table.timestamps(true, true);
      table.index(["tenant_id"], "idx_custom_modules_tenant_id");
    })
    .createTable("custom_fields", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("module_id")
        .references("id")
        .inTable("custom_modules")
        .onDelete("CASCADE")
        .notNullable();
      table.string("field_key").notNullable();
      table.string("label").notNullable();
      table.string("field_type").notNullable();
      table.boolean("is_required").defaultTo(false);
      table.jsonb("meta").nullable();
      table.timestamps(true, true);
      table.unique(["module_id", "field_key"], "uniq_custom_fields");
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("custom_fields")
    .dropTableIfExists("custom_modules");
};
