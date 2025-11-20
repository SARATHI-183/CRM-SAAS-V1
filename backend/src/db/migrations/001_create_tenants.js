exports.up = function(knex) {
  return knex.schema.createTable("tenants", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("company_name").notNullable();
    table.string("industry_type").notNullable();
    table.string("company_email").notNullable();
    table.string("company_phone");
    table.string("company_website");
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("tenants");
};
