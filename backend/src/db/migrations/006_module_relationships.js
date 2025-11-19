exports.up = function (knex) {
  return knex.schema.createTable("module_relationships", (table) => {
    table.increments("id").primary();

    table
      .integer("module_id")
      .unsigned()
      .references("id")
      .inTable("modules")
      .onDelete("CASCADE")
      .notNullable();
    // The source module

    table
      .integer("target_module_id")
      .unsigned()
      .references("id")
      .inTable("modules")
      .onDelete("CASCADE")
      .notNullable();
    // The module this module is related to

    table.string("relationship_type").notNullable();
    // e.g., "one-to-many", "many-to-many"

    table.string("field_name").notNullable();
    // The field name on source module representing this relationship

    table.boolean("is_custom").defaultTo(true);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("module_relationships");
};
