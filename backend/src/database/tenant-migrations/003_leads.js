// src/database/tenant-migrations/003_leads.js

exports.up = async function (knex) {
  // Needed for better search

  await knex.schema.createTable("leads", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    // CRM Lead Title (e.g., "Website Inquiry", "Big Deal Opportunity")
    t.string("title", 300).notNullable();

    // Better industry-standard ENUM (text-based)
    t
      .enu("status", ["new", "open", "in_progress", "qualified", "lost", "won"], {
        useNative: false,
        enumName: "lead_status_enum"
      })
      .notNullable()
      .defaultTo("new");

    t.string("source", 150); // Website, LinkedIn, Referral, etc.

    // Relation to contacts
    t
      .uuid("contact_id")
      .nullable()
      .references("id")
      .inTable("contacts")
      .onDelete("SET NULL");

    // Assigned user (sales agent / employee)
    t
      .uuid("assigned_to")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    // Optional scoring system
    t.integer("lead_score").defaultTo(0);

    // Custom small fields inline
    t.jsonb("meta").defaultTo("{}");

    t.boolean("is_deleted").notNullable().defaultTo(false);

    t.timestamps(true, true);
  });

  // ------------------------------------------------------
  // INDUSTRY LEVEL INDEXES
  // ------------------------------------------------------
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
    CREATE INDEX IF NOT EXISTS idx_leads_contact_id ON leads (contact_id);
    CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads (assigned_to);

    -- Accelerator for search on title
    CREATE INDEX IF NOT EXISTS idx_leads_title_trgm 
    ON leads USING gin (title gin_trgm_ops);

    -- Soft delete filter index
    CREATE INDEX IF NOT EXISTS idx_leads_is_deleted ON leads (is_deleted);
  `);
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("leads");
  await knex.raw(`DROP TYPE IF EXISTS lead_status_enum;`);
};
