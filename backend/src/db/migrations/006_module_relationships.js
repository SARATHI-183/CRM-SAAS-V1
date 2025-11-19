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
table
.integer("target_module_id")
.unsigned()
.references("id")
.inTable("modules")
.onDelete("CASCADE")
.notNullable();
table.string("relationship_type").notNullable();
table.string("field_name").notNullable();
table.boolean("is_custom").defaultTo(true);
table.timestamp("created_at").defaultTo(knex.fn.now());
table.timestamp("updated_at").defaultTo(knex.fn.now());
table.unique(["module_id","target_module_id","field_name"], "uniq_module_relationships");
});
};

exports.down = function (knex) {
return knex.schema.dropTableIfExists("module_relationships");
};