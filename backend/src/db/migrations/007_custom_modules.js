// src/db/migrations/007_custom_modules.js
exports.up = function(knex) {
  return knex.schema
    .createTable("custom_modules", (table) => {
      table.increments("id").primary();
      table.integer("tenant_id").unsigned().references("id").inTable("tenants").onDelete("CASCADE").nullable();
      table.string("module_key").notNullable(); // internal key e.g., 'patient_records'
      table.string("name").notNullable();
      table.jsonb("config").nullable(); // extra config like list view, permissions
      table.boolean("is_enabled").defaultTo(true);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("custom_fields", (table) => {
      table.increments("id").primary();
      table.integer("module_id").unsigned().references("id").inTable("custom_modules").onDelete("CASCADE");
      table.string("field_key").notNullable(); // slug
      table.string("label").notNullable();
      table.string("field_type").notNullable(); // text, number, date, select, multi-select, lookup
      table.boolean("is_required").defaultTo(false);
      table.jsonb("meta").nullable(); // { choices: [], placeholder: "" }
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("custom_fields")
    .dropTableIfExists("custom_modules");
};
