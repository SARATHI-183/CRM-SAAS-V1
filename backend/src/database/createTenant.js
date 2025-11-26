
// src/database/createTenant.js
const { knex: masterKnex, tenantKnex } = require('./knex');
const { v4: uuidv4 } = require('uuid');

async function createTenant({ company_name, company_email, subscription_plan = 'free' }) {
  if (!company_name || !company_email) throw new Error('company_name and company_email are required');

  const tenantId = uuidv4();
  const schemaName = `tenant_${tenantId.replace(/-/g, '_')}`;

  let tenantRow;

  try {
    // 1️⃣ Insert tenant in master DB
    [tenantRow] = await masterKnex('tenants')
      .insert({
        id: tenantId,
        company_name,
        company_email,
        db_schema: schemaName,
        subscription_plan,
        is_active: true,
        activated_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');

    console.log(`Tenant created in master DB: ${tenantRow.company_name}`);

    // 2️⃣ Create tenant schema
    await masterKnex.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    console.log(`Schema created: ${schemaName}`);

    // 3️⃣ Enable required extensions & run tenant migrations
    const tk = tenantKnex(schemaName);
    try {
      // Enable required PostgreSQL extensions in the tenant schema
      await tk.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
      await tk.raw(`CREATE EXTENSION IF NOT EXISTS "citext";`);
      await tk.raw(`CREATE EXTENSION IF NOT EXISTS "pg_trgm";`);

      // Run tenant migrations (core + custom modules)
      await tk.migrate.latest();
      console.log(`Tenant migrations completed for schema: ${schemaName}`);
    } finally {
      await tk.destroy();
    }

    // 4️⃣ Log tenant migration in master DB
    await masterKnex('tenant_migration_log').insert({
      tenant_id: tenantRow.id,
      migration_name: `migrated_${schemaName}`,
      ran_at: new Date(), // note: use ran_at column
    });

    return {
      tenant_id: tenantRow.id,
      db_schema: schemaName,
      company_name: tenantRow.company_name,
    };

  } catch (err) {
    console.error('Tenant creation failed:', err);

    // Cleanup: drop schema & delete master tenant row if anything fails
    try { await masterKnex.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`); } catch {}
    try { await masterKnex('tenants').where({ id: tenantRow?.id }).del(); } catch {}

    throw err;
  }
}

module.exports = { createTenant };
