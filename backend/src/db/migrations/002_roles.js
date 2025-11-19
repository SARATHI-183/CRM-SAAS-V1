exports.up = function (knex) {
return knex.schema.createTable("roles", (table) => {
table.increments("id").primary();
table
.integer("tenant_id")
.unsigned()
.references("id")
.inTable("tenants")
.onDelete("CASCADE")
.nullable(); // null = system role
table.string("role_name").notNullable();
table.string("description");
table.boolean("is_system_role").defaultTo(false);
table.boolean("is_active").defaultTo(true);
table.timestamp("created_at").defaultTo(knex.fn.now());
table.timestamp("updated_at").defaultTo(knex.fn.now());
table.index(["tenant_id"], "idx_roles_tenant_id");
});
};

exports.down = function (knex) {
return knex.schema.dropTableIfExists("roles");
};