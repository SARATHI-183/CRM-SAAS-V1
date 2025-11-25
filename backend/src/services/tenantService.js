const { knex } = require('../knex'); // master DB
const { v4: uuidv4 } = require('uuid');
const Knex = require('knex');
const knexfile = require('../knexfile');

async function createTenant({ company_name, company_email, subscription_plan = 'free' }) {
  const tenantId = uuidv4();
  const schemaName = `tenant_${tenantId.replace(/-/g, '_')}`; // safe schema name

  // 1️⃣ Create schema in DB
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

  // 2️⃣ Insert tenant record into public.tenants
  await knex('tenants').insert({
    id: tenantId,
    company_name,
    company_email,
    db_schema: schemaName,
    subscription_plan,
    is_active: true,
    activated_at: new Date(),
    deactivated_at: null,
    settings: {},
    billing_info: {},
    created_at: new Date(),
    updated_at: new Date(),
  });

  // 3️⃣ Run tenant migrations programmatically
  const tenantKnex = Knex(knexfile.tenantConfig(schemaName));
  await tenantKnex.migrate.latest();  // runs all migrations in tenant schema

  // 4️⃣ Run tenant seeds if needed
  await tenantKnex.seed.run();       // optional initial data

  console.log(`Tenant ${company_name} created with schema: ${schemaName}`);
  return { tenantId, schemaName };
}

module.exports = { createTenant };
