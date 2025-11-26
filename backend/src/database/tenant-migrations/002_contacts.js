// src/database/tenant-migrations/002_contacts.js

exports.up = async function (knex) {
  await knex.schema.createTable("contacts", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    // Basic fields
    t.string("first_name", 150).notNullable();
    t.string("last_name", 150).notNullable();

    // Email should be citext + indexed
    t.specificType("email", "citext").unique();

    t.string("phone", 50);
    t.jsonb("address").defaultTo("{}");

    // CRM Fields
    t.string("company_name", 200); // common in CRM contacts
    t.string("job_title", 150); // optional but useful

    // Soft delete (standard in industry)
    t.boolean("is_deleted").notNullable().defaultTo(false);

    t.timestamps(true, true);
  });

  // ------------ INDEXES (VERY IMPORTANT) -------------
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);
    CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts (phone);

    -- Full-text search speed boost
    CREATE INDEX IF NOT EXISTS idx_contacts_name_trgm 
    ON contacts USING gin (first_name gin_trgm_ops, last_name gin_trgm_ops);

    -- For filtering active contacts
    CREATE INDEX IF NOT EXISTS idx_contacts_is_deleted ON contacts (is_deleted);
  `);
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("contacts");
};
