// 007_module_relationships.js
exports.up = function (knex) {
  return knex.schema.createTable("module_relationships", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("module_id")
      .references("id")
      .inTable("modules")
      .onDelete("CASCADE")
      .notNullable();
    table.uuid("target_module_id")
      .references("id")
      .inTable("modules")
      .onDelete("CASCADE")
      .notNullable();
    table.string("relationship_type").notNullable();
    table.string("field_name").notNullable();
    table.boolean("is_custom").defaultTo(true);
    table.timestamps(true, true);
    table.unique(["module_id", "target_module_id", "field_name"], "uniq_module_relationships");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("module_relationships");
};
