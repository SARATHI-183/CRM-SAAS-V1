// src/database/utils/runTenantMigrations.js
const { tenantKnex } = require('../knex');

/**
 * Run all pending tenant migrations for a specific tenant schema.
 * @param {string} schemaName - The tenant schema to migrate.
 */
async function runTenantMigrations(schemaName) {
  if (!schemaName) throw new Error('runTenantMigrations requires schemaName.');

  console.log(`[Tenant Migration] Starting for schema: ${schemaName}`);

  const tk = tenantKnex(schemaName);

  try {
    // Run migrations
    await tk.migrate.latest({
      directory: './src/database/tenant-migrations',
      tableName: `${schemaName}_knex_migrations`, // per-tenant migration tracking
    });

    console.log(`[Tenant Migration] Completed successfully for schema: ${schemaName}`);
  } catch (err) {
    console.error(`[Tenant Migration] Failed for schema: ${schemaName}`, err);
    throw err; // rethrow for higher-level handling
  } finally {
    await tk.destroy();
  }
}

module.exports = { runTenantMigrations };
