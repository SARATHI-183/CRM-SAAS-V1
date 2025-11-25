// src/database/tenant-migrations/008_tenant_indexes.js

exports.up = async function(knex) {
  // -----------------------------
  // USERS TABLE INDEXES
  // -----------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_users_email
    ON users (email);

    CREATE INDEX IF NOT EXISTS idx_users_is_active
    ON users (is_active);
  `);

  // -----------------------------
  // CONTACTS TABLE INDEXES
  // -----------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_contacts_email
    ON contacts (email);

    CREATE INDEX IF NOT EXISTS idx_contacts_phone
    ON contacts (phone);
  `);

  // -----------------------------
  // LEADS TABLE INDEXES
  // -----------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_leads_status
    ON leads (status);

    CREATE INDEX IF NOT EXISTS idx_leads_assigned_to
    ON leads (assigned_to);

    CREATE INDEX IF NOT EXISTS idx_leads_contact_id
    ON leads (contact_id);
  `);

  // -----------------------------
  // DEALS TABLE INDEXES
  // -----------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_deals_stage
    ON deals (stage);

    CREATE INDEX IF NOT EXISTS idx_deals_assigned_to
    ON deals (assigned_to);

    CREATE INDEX IF NOT EXISTS idx_deals_contact_id
    ON deals (contact_id);
  `);

  // -----------------------------
  // USER_ROLES TABLE INDEXES
  // -----------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_user_roles_user_id
    ON user_roles (user_id);

    CREATE INDEX IF NOT EXISTS idx_user_roles_role_id
    ON user_roles (role_id);
  `);

  // -----------------------------
  // CUSTOM MODULE DATA JSONB GIN INDEX
  // -----------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_custom_module_data_jsonb
    ON custom_module_data USING GIN (data);
  `);

  // -----------------------------
  // ACTIVITIES TABLE INDEXES
  // -----------------------------
  await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_activities_module
    ON activities (module);

    CREATE INDEX IF NOT EXISTS idx_activities_module_id
    ON activities (module_id);

    CREATE INDEX IF NOT EXISTS idx_activities_created_by
    ON activities (created_by);
  `);

};

exports.down = async function(knex) {
  await knex.schema.raw(`DROP INDEX IF EXISTS idx_users_email`);
  await knex.schema.raw(`DROP INDEX IF EXISTS idx_users_is_active`);

  await knex.schema.raw(`DROP INDEX IF EXISTS idx_contacts_email`);
  await knex.schema.raw(`DROP INDEX IF EXISTS idx_contacts_phone`);

  await knex.schema.raw(`DROP INDEX IF EXISTS idx_leads_status`);
  await knex.schema.raw(`DROP INDEX IF EXISTS idx_leads_assigned_to`);
  await knex.schema.raw(`DROP INDEX IF EXISTS idx_leads_contact_id`);

  await knex.schema.raw(`DROP INDEX IF EXISTS idx_deals_stage`);
  await knex.schema.raw(`DROP INDEX IF EXISTS idx_deals_assigned_to`);
  await knex.schema.raw(`DROP INDEX IF EXISTS idx_deals_contact_id`);

  await knex.schema.raw(`DROP INDEX IF EXISTS idx_user_roles_user_id`);
  await knex.schema.raw(`DROP INDEX IF EXISTS idx_user_roles_role_id`);

  await knex.schema.raw(`DROP INDEX IF EXISTS idx_custom_module_data_jsonb`);

  await knex.schema.raw(`DROP INDEX IF EXISTS idx_activities_module`);
  await knex.schema.raw(`DROP INDEX IF EXISTS idx_activities_module_id`);
  await knex.schema.raw(`DROP INDEX IF EXISTS idx_activities_created_by`);
};
