exports.up = function (knex) {
  return knex.schema.createTable("module_fields", (table) => {
    table.increments("id").primary();

    table
      .integer("module_id")
      .unsigned()
      .references("id")
      .inTable("modules")
      .onDelete("CASCADE")
      .notNullable();

    table.string("field_name").notNullable();  // e.g., "budget", "status"
    table.string("field_type").notNullable();  // text, number, date, boolean, select, multi-select
    table.boolean("is_required").defaultTo(false);
    table.boolean("is_custom").defaultTo(true); // true = tenant-added, false = system field
    table.string("default_value").nullable();   // default if any
    table.jsonb("options").nullable();          // for select / multi-select: { "choices": ["A", "B"] }

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("module_fields");
};
