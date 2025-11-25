// src/database/createTenant.js
require('dotenv').config();
const { knex } = require('../knex'); // master DB connection
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * Tenant Knex factory
 */
function getTenantKnex(schemaName) {
  const config = require('../knexfile').tenantConfig(schemaName);
  const Knex = require('knex');
  return Knex(config);
}

/**
 * Create a new tenant with schema, run migrations & seeds
 * @param {Object} tenantData - { company_name, company_email, subscription_plan }
 */
async function createTenant(tenantData) {
  const tenantId = uuidv4();
  const schemaName = `tenant_${tenantId.replace(/-/g, '')}`;

  // 1️⃣ Insert tenant into master DB
  const [tenant] = await knex('tenants')
    .insert({
      id: tenantId,
      company_name: tenantData.company_name,
      company_email: tenantData.company_email,
      db_schema: schemaName,
      subscription_plan: tenantData.subscription_plan || 'free',
      is_active: true,
      activated_at: new Date(),
      deactivated_at: null,
      settings: {},
      billing_info: {},
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');

  console.log(`Tenant created in master DB: ${tenant.company_name}, schema: ${schemaName}`);

  // 2️⃣ Create schema in Postgres
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  console.log(`Schema created: ${schemaName}`);

  // 3️⃣ Run tenant migrations
  const tenantKnex = getTenantKnex(schemaName);
  await tenantKnex.migrate.latest({
    directory: path.join(__dirname, 'tenant-migrations')
  });
  console.log(`Tenant migrations completed for schema: ${schemaName}`);

  // 4️⃣ Run tenant seeds
  await tenantKnex.seed.run({
    directory: path.join(__dirname, 'tenant-seeds')
  });
  console.log(`Tenant seeds completed for schema: ${schemaName}`);

  return tenant;
}

// Example usage
if (require.main === module) {
  (async () => {
    try {
      const tenant = await createTenant({
        company_name: 'ABC Corp',
        company_email: 'contact@abc.com',
        subscription_plan: 'free'
      });
      console.log('Tenant setup finished:', tenant);
      process.exit(0);
    } catch (err) {
      console.error('Error creating tenant:', err);
      process.exit(1);
    }
  })();
}

module.exports = createTenant;
