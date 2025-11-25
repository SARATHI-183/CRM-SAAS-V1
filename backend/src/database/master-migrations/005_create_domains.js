// // src/database/master-migrations/005_create_domains.js

// exports.up = async function (knex) {
//   await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

//   await knex.schema.createTable("domains", (t) => {
//     t.uuid("id")
//       .primary()
//       .defaultTo(knex.raw("uuid_generate_v4()"));

//     // The tenant this domain points to
//     t.uuid("tenant_id")
//       .notNullable()
//       .references("id")
//       .inTable("tenants")
//       .onDelete("CASCADE"); 
//       // Safe: if tenant removed → domain entry should also be removed

//     // Domain or subdomain
//     t.string("domain", 255)
//       .notNullable()
//       .unique(); // cannot have duplicate domains

//     // is this the primary domain for that tenant?
//     t.boolean("is_primary")
//       .notNullable()
//       .defaultTo(false);

//     // extra config for SSL, redirects, branding, etc.
//     t.jsonb("meta")
//       .notNullable()
//       .defaultTo("{}");

//     t.timestamps(true, true);
//   });

//   // Performance indexes
//   await knex.schema.raw(`
//     CREATE INDEX IF NOT EXISTS domains_tenant_idx ON domains (tenant_id);
//     CREATE INDEX IF NOT EXISTS domains_primary_idx ON domains (is_primary);
//   `);
// };

// exports.down = async function (knex) {
//   await knex.schema.dropTableIfExists("domains");
// };


// src/database/master-migrations/005_create_domains.js

exports.up = async function (knex) {
  // UUID support
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

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
