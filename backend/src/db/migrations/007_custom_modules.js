exports.up = function(knex) {
return knex.schema
.createTable("custom_modules", (table) => {
table.increments("id").primary();
table
.integer("tenant_id")
.unsigned()
.references("id")
.inTable("tenants")
.onDelete("CASCADE")
.nullable();
table.string("module_key").notNullable();
table.string("name").notNullable();
table.jsonb("config").nullable();
table.boolean("is_enabled").defaultTo(true);
table.timestamp("created_at").defaultTo(knex.fn.now());
table.timestamp("updated_at").defaultTo(knex.fn.now());
table.index(["tenant_id"], "idx_custom_modules_tenant_id");
})
.createTable("custom_fields", (table) => {
table.increments("id").primary();
table
.integer("module_id")
.unsigned()
.references("id")
.inTable("custom_modules")
.onDelete("CASCADE")
.notNullable();
table.string("field_key").notNullable();
table.string("label").notNullable();
table.string("field_type").notNullable();
table.boolean("is_required").defaultTo(false);
table.jsonb("meta").nullable();
table.timestamp("created_at").defaultTo(knex.fn.now());
table.timestamp("updated_at").defaultTo(knex.fn.now());
table.unique(["module_id", "field_key"], "uniq_custom_fields");
});
};

exports.down = function(knex) {
return knex.schema
.dropTableIfExists("custom_fields")
.dropTableIfExists("custom_modules");
};