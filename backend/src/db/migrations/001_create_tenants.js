exports.up = function (knex) {
return knex.schema.createTable("tenants", (table) => {
table.increments("id").primary();
table.string("company_name").notNullable();
table.string("industry_type").notNullable();
table.string("company_email").notNullable();
table.string("company_phone");
table.string("company_website");
table.boolean("is_active").defaultTo(true);
table.timestamp("created_at").defaultTo(knex.fn.now());
table.timestamp("updated_at").defaultTo(knex.fn.now());
});
};

exports.down = function (knex) {
return knex.schema.dropTableIfExists("tenants");
};