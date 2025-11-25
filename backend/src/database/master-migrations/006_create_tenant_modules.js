// // src/database/master-migrations/004_create_tenant_modules.js

// exports.up = async function (knex) {
//   await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

//   await knex.schema.createTable("tenant_modules", (t) => {
//     t.uuid("id")
//       .primary()
//       .defaultTo(knex.raw("uuid_generate_v4()"));

//     // Tenant who owns this module
//     t.uuid("tenant_id")
//       .notNullable()
//       .references("id")
//       .inTable("tenants")
//       .onDelete("CASCADE"); // SAFE: remove mapping when tenant is removed

//     // Module assigned to tenant
//     t.uuid("module_id")
//       .notNullable()
//       .references("id")
//       .inTable("modules")
//       .onDelete("NO ACTION"); // DO NOT CASCADE! Prevent accidental module deletion

//     t.boolean("is_enabled")
//       .notNullable()
//       .defaultTo(true);

//     t.jsonb("config")
//       .notNullable()
//       .defaultTo("{}"); // module-level per tenant config

//     t.timestamps(true, true);

//     // Prevent duplicate assignments
//     t.unique(["tenant_id", "module_id"]);
//   });

//   // Indexes for performance
//   await knex.schema.raw(`
//     CREATE INDEX IF NOT EXISTS tenant_modules_tenant_idx ON tenant_modules (tenant_id);
//     CREATE INDEX IF NOT EXISTS tenant_modules_module_idx ON tenant_modules (module_id);
//     CREATE INDEX IF NOT EXISTS tenant_modules_enabled_idx ON tenant_modules (is_enabled);
//   `);
// };

// exports.down = async function (knex) {
//   await knex.schema.dropTableIfExists("tenant_modules");
// };


// src/database/master-migrations/004_create_tenant_modules.js

exports.up = async function (knex) {
  // Ensure UUID extension exists
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await knex.schema.createTable("tenant_modules", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));

    // Tenant → owning tenant
    table
      .uuid("tenant_id")
      .notNullable()
      .references("id")
      .inTable("tenants")
      .onDelete("CASCADE"); // Delete tenant = delete module mapping (safe)

    // Module → referenced module
    table
      .uuid("module_id")
      .notNullable()
      .references("id")
      .inTable("modules")
      .onDelete("RESTRICT"); // safer than NO ACTION → prevents accidental removal

    // Whether tenant has the module enabled
    table
      .boolean("is_enabled")
      .notNullable()
      .defaultTo(true);

    // JSONB config unique per tenant per module
    table
      .jsonb("config")
      .notNullable()
      .defaultTo("{}");

    table.timestamps(true, true);

    // Prevent duplicate module assignment per tenant
    table.unique(["tenant_id", "module_id"]);
  });

  // Indexes
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_tenant_modules_tenant_id ON tenant_modules (tenant_id);
    CREATE INDEX IF NOT EXISTS idx_tenant_modules_module_id ON tenant_modules (module_id);
    CREATE INDEX IF NOT EXISTS idx_tenant_modules_enabled ON tenant_modules (is_enabled);
  `);
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("tenant_modules");
};
