
exports.up = async function(knex) {

  // --------------------------------------------------------
  // TENANTS TABLE
  // Stores all companies using your CRM SaaS.
  // --------------------------------------------------------
  await knex.schema.createTable("tenants", (t) => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    t.string("company_name", 200).notNullable();

    t.specificType("company_email", "citext")
      .notNullable()
      .unique(); // prevents duplicates system-wide

    t.string("db_schema", 150)
      .notNullable()
      .unique(); // schema-per-tenant mapping

    t.string("subscription_plan", 50)
      .notNullable()
      .defaultTo("free");

    t.boolean("is_active")
      .notNullable()
      .defaultTo(true);

    t.timestamp("activated_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    t.timestamp("deactivated_at", { useTz: true })
      .nullable();

    // JSONB fields allow extra optional settings without schema changes
    t.jsonb("settings")
      .notNullable()
      .defaultTo('{}');

    t.jsonb("billing_info")
      .notNullable()
      .defaultTo('{}');

    t.timestamps(true, true); // created_at, updated_at
  });

  // --------------------------------------------------------
  // PERFORMANCE INDEXES
  // --------------------------------------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_tenants_company_email
      ON tenants (company_email);

    CREATE INDEX IF NOT EXISTS idx_tenants_is_active
      ON tenants (is_active);

    CREATE INDEX IF NOT EXISTS idx_tenants_db_schema
      ON tenants (db_schema);
  `);

  // --------------------------------------------------------
  // TENANT MIGRATION LOG
  // Tracks which tenant-level migrations have executed
  // --------------------------------------------------------
  await knex.schema.createTable("tenant_migration_log", (t) => {
    t.bigIncrements("id").primary();

    t.uuid("tenant_id")
      .notNullable()
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE"); // cleanup when tenant deleted

    t.string("migration_name", 255).notNullable();

    t.timestamp("ran_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  // Index for fast filtering
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_tenant_migration_log_tenant_id
      ON tenant_migration_log (tenant_id);
  `);
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("tenant_migration_log");
  await knex.schema.dropTableIfExists("domains");
  await knex.schema.dropTableIfExists("tenant_modules");

  // Then drop tenants
  await knex.schema.dropTableIfExists("tenants");
};
