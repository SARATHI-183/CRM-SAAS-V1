// // src/database/utils/schemaCreator.js
// const { knex, tenantKnex } = require('../knex');

// /**
//  * Create new tenant schema and run tenant migrations.
//  * Returns { tenantId, schemaName } only if migrations succeed.
//  */
// async function createTenantSchemaAndRunMigrations({ tenantId, schemaName }) {
//   // create schema
//   await knex.raw(`CREATE SCHEMA IF NOT EXISTS ??`, [schemaName]);

//   // run tenant migrations using tenantKnex (so migrations create tables inside schema)
//   const tk = tenantKnex(schemaName);
//   try {
//     await tk.migrate.latest({
//       directory: './src/database/tenant-migrations',
//       tableName: `${schemaName}_migrations`
//     });
//   } finally {
//     await tk.destroy();
//   }

//   // record in tenant_migration_log
//   await knex('tenant_migration_log').insert({
//     tenant_id: tenantId,
//     migration_name: `migrated_schema_${schemaName}`
//   });

//   return true;
// }

// module.exports = { createTenantSchemaAndRunMigrations };


// src/database/utils/schemaCreator.js
const { knex, tenantKnex } = require('../knex');

/**
 * Create a tenant schema and run all tenant migrations inside that schema.
 */
async function createTenantSchemaAndRunMigrations({ tenantId, schemaName }) {
  if (!tenantId || !schemaName) {
    throw new Error('createTenantSchemaAndRunMigrations requires tenantId and schemaName.');
  }

  console.log(`Creating schema "${schemaName}"...`);

  // Create schema if not exists
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS ??`, [schemaName]);

  console.log(`Schema created. Running tenant migrations...`);

  const tk = tenantKnex(schemaName);

  try {
    await tk.migrate.latest({
      directory: './src/database/tenant-migrations',
      tableName: `${schemaName}_knex_migrations`,
    });
  } finally {
    await tk.destroy();
  }

  console.log(`Tenant migrations completed for schema "${schemaName}".`);

  // Log migration
  await knex('tenant_migration_log').insert({
    tenant_id: tenantId,
    migration_name: `migrated_schema_${schemaName}`,
  });

  return true;
}

module.exports = { createTenantSchemaAndRunMigrations };
