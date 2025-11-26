

exports.up = async function (knex) {

  await knex.schema.createTable("domains", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));

    // Domain belongs to tenant
    table
      .uuid("tenant_id")
      .notNullable()
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE"); // delete tenant → delete mapped domains

    // Domain or subdomain string
    table
      .string("domain", 255)
      .notNullable()
      .unique();

    // Only one primary domain per tenant (enforced in app logic)
    table
      .boolean("is_primary")
      .notNullable()
      .defaultTo(false);

    table
      .jsonb("meta")
      .notNullable()
      .defaultTo("{}"); // SSL, CNAME, redirects, branding, etc.

    table.timestamps(true, true);
  });

  // Indexes
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_domains_tenant_id ON domains (tenant_id);
    CREATE INDEX IF NOT EXISTS idx_domains_is_primary ON domains (is_primary);
  `);
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("domains");
};
