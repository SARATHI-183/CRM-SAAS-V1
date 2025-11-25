// // src/modules/super-admin/service.js
// const { knex } = require('../../database/knex');
// const { createTenantSchemaAndRunMigrations } = require('../../database/utils/schemaCreator');

// async function createTenant({ company_name, company_email, plan = 'free' }) {
//   if (!company_name || !company_email) throw new Error('company_name and company_email required');

//   // generate tenant id + schema name
//   const [tenant] = await knex.transaction(async (trx) => {
//     const inserted = await trx('tenants')
//       .insert({
//         company_name,
//         company_email,
//         db_schema: null, // we'll set after schema name decided
//         plan,
//         is_active: true
//       })
//       .returning('*');

//     const tenantRow = inserted[0];
//     // generate schema name using tenant id short suffix
//     const short = tenantRow.id.slice(0, 8);
//     const schemaName = `tenant_${short}`;

//     // update tenant row with schema name inside same txn
//     await trx('tenants').where({ id: tenantRow.id }).update({ db_schema: schemaName });

//     return [ { ...tenantRow, db_schema: schemaName } ];
//   });

//   // create schema and run tenant migrations (outside txn to avoid long transactions)
//   await createTenantSchemaAndRunMigrations({ tenantId: tenant.id, schemaName: tenant.db_schema });

//   // create default tenant admin user inside the new schema
//   const { tenantKnex } = require('../../database/knex');
//   const tk = tenantKnex(tenant.db_schema);
//   try {
//     // insert default roles and an admin user
//     const [role] = await tk('roles').insert({ name: 'tenant_admin', permissions: JSON.stringify([]) }).returning('*');

//     const bcrypt = require('bcrypt');
//     const defaultPassword = 'ChangeMe@123';
//     const hash = await bcrypt.hash(defaultPassword, 10);

//     const [user] = await tk('users').insert({
//       full_name: `${tenant.company_name} Admin`,
//       email: tenant.company_email,
//       password_hash: hash,
//       is_active: true
//     }).returning('*');

//     await tk('user_roles').insert({ user_id: user.id, role_id: role.id });
//   } finally {
//     await tk.destroy();
//   }

//   return { tenant_id: tenant.id, schema: tenant.db_schema, admin_email: tenant.company_email };
// }

// module.exports = { createTenant };

// src/modules/super-admin/service.js
const { knex, tenantKnex } = require('../../database/knex');
const bcrypt = require('bcrypt');

async function createTenant({ company_name, company_email, plan = 'free' }) {
  if (!company_name || !company_email) throw new Error('company_name and company_email required');

  // 1) Create tenant row in master inside a short transaction
  let tenantRow;
  await knex.transaction(async (trx) => {
    const inserted = await trx('tenants')
      .insert({
        company_name,
        company_email,
        plan,
        is_active: true,
        meta: {}
      })
      .returning(['id', 'company_name', 'company_email']);
    tenantRow = inserted[0];

    const short = tenantRow.id.replace(/-/g, '').slice(0, 8);
    const schemaName = `tenant_${short}`;
    await trx('tenants').where({ id: tenantRow.id }).update({ db_schema: schemaName });
    tenantRow.db_schema = schemaName;
  });

  // 2) Create schema and run tenant migrations OUTSIDE master transaction
  try {
    // Create schema (using master knex)
    await knex.raw('CREATE SCHEMA IF NOT EXISTS ??', [tenantRow.db_schema]);

    // Run tenant migrations using tenantKnex factory
    const tk = tenantKnex(tenantRow.db_schema);
    try {
      await tk.migrate.latest({
        directory: './src/database/tenant-migrations',
        tableName: `${tenantRow.db_schema}_migrations`
      });

      // Insert default roles & admin user inside tenant schema
      // Use short-lived operations via the tenant Knex instance
      const [role] = await tk('roles')
        .insert({ name: 'tenant_admin', permissions: JSON.stringify([]) })
        .returning('*');

      const defaultPassword = process.env.DEFAULT_TENANT_ADMIN_PASS || 'ChangeMe@123!';
      const passwordHash = await bcrypt.hash(defaultPassword, 12);

      const [user] = await tk('users')
        .insert({
          full_name: `${tenantRow.company_name} Admin`,
          email: tenantRow.company_email,
          password_hash: passwordHash,
          is_active: true
        })
        .returning('*');

      await tk('user_roles').insert({ user_id: user.id, role_id: role.id });

    } finally {
      // ensure we destroy tenantKnex
      await tk.destroy();
    }

    // 3) record migration run in master log (non-critical)
    await knex('tenant_migration_log').insert({ tenant_id: tenantRow.id, migration_name: `migrated_${tenantRow.db_schema}` });

    return {
      tenant_id: tenantRow.id,
      db_schema: tenantRow.db_schema,
      admin_email: tenantRow.company_email
    };

  } catch (err) {
    // If anything fails after master row creation, cleanup to avoid orphan tenant rows & schema
    try {
      // drop schema if exists (best-effort)
      await knex.raw('DROP SCHEMA IF EXISTS ?? CASCADE', [tenantRow.db_schema]);
    } catch (dropErr) {
      // log & continue to delete master row
      console.error('Failed to drop schema during rollback cleanup:', dropErr);
    }

    // remove master tenant row
    try {
      await knex('tenants').where({ id: tenantRow.id }).del();
    } catch (delErr) {
      console.error('Failed to delete tenant master row during rollback cleanup:', delErr);
    }

    // rethrow original error for upper layers
    throw err;
  }
}

module.exports = { createTenant };
