exports.up = function (knex) {
return knex.schema.createTable("users", (table) => {
table.increments("id").primary();
table
.integer("tenant_id")
.unsigned()
.references("id")
.inTable("tenants")
.onDelete("CASCADE")
.nullable(); // Super Admin tenant_id = null
table
.integer("role_id")
.unsigned()
.references("id")
.inTable("roles")
.onDelete("SET NULL")
.nullable();
table.string("full_name").notNullable();
table.string("email").notNullable().unique();
table.string("password").notNullable();
table.string("phone");
table.boolean("is_active").defaultTo(true);
table.boolean("email_verified").defaultTo(false);
table.string("email_verification_token");
table.timestamp("verification_token_expires");
table.timestamp("created_at").defaultTo(knex.fn.now());
table.timestamp("updated_at").defaultTo(knex.fn.now());
table.index(["tenant_id"], "idx_users_tenant_id");
});
};

exports.down = function (knex) {
return knex.schema.dropTableIfExists("users");
};