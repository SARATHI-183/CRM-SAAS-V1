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
table.string("field_name").notNullable();
table.string("field_type").notNullable();
table.boolean("is_required").defaultTo(false);
table.boolean("is_custom").defaultTo(true);
table.string("default_value").nullable();
table.jsonb("options").nullable();
table.timestamp("created_at").defaultTo(knex.fn.now());
table.timestamp("updated_at").defaultTo(knex.fn.now());
table.unique(["module_id", "field_name"], "uniq_module_fields");
});
};

exports.down = function (knex) {
return knex.schema.dropTableIfExists("module_fields");
};