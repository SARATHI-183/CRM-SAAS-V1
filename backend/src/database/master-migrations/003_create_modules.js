
exports.up = async function (knex) {
  

  // ----------------------------------------
  // MODULES TABLE
  // ----------------------------------------
  await knex.schema.createTable("modules", (t) => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));

    t.string("name", 120).notNullable();   // Display label: Leads, Quotes, Invoice
    t.string("key", 120)
      .notNullable()
      .unique();                           // System key: leads, quotes, invoices

    t.boolean("is_core")
      .notNullable()
      .defaultTo(true);                    // Default modules shipped with CRM

    t.boolean("is_premium")
      .notNullable()
      .defaultTo(false);                   // Future add-ons/modules

    t.jsonb("meta")
      .notNullable()
      .defaultTo("{}");                    // UI config: icon, category, sort order

    t.boolean("is_active")
      .notNullable()
      .defaultTo(true);

    t.timestamps(true, true);              // created_at, updated_at
  });

  // ----------------------------------------
  // PERFORMANCE INDEXES
  // ----------------------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS modules_key_idx
      ON modules (key);

    CREATE INDEX IF NOT EXISTS modules_is_active_idx
      ON modules (is_active);
  `);

  // ----------------------------------------
  // SEED: Default CRM Modules
  // ----------------------------------------
  const defaultModules = [
    { name: "Dashboard",  key: "dashboard",  is_core: true },
    { name: "Leads",      key: "leads",      is_core: true },
    { name: "Customers",  key: "customers",  is_core: true },
    { name: "Quotes",     key: "quotes",     is_core: true },
    { name: "Invoices",   key: "invoices",   is_core: true },
    { name: "Activities", key: "activities", is_core: true },
    { name: "Offers",     key: "offers",     is_core: false },
    { name: "Orders",     key: "orders",     is_core: true },
    { name: "Payments",   key: "payments",   is_core: true },
    { name: "Settings",   key: "settings",   is_core: true }
  ];

  await knex("modules").insert(
    defaultModules.map((m) => ({
      name: m.name,
      key: m.key,
      is_core: m.is_core,
      is_premium: false,
      meta: {},
      is_active: true
    }))
  );
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("modules");
};
