exports.up = function (knex) {
return knex.schema.createTable("modules", (table) => {
table.increments("id").primary();
table
.integer("tenant_id")
.unsigned()
.references("id")
.inTable("tenants")
.onDelete("CASCADE")
.nullable(); // null = system module
table.string("module_name").notNullable();
table.string("industry").nullable();
table.boolean("is_active").defaultTo(true);
table.boolean("is_core").defaultTo(false);
table.string("description").nullable();
table.timestamp("created_at").defaultTo(knex.fn.now());
table.timestamp("updated_at").defaultTo(knex.fn.now());
table.index(["tenant_id"], "idx_modules_tenant_id");
});
};

exports.down = function (knex) {
return knex.schema.dropTableIfExists("modules");
};