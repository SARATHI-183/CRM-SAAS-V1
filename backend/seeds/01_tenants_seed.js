const crypto = require('crypto');

exports.seed = async function(knex) {
  // Delete existing tenants
  await knex('tenants').del();

  // Generate a dynamic UUID for the tenant
  const tenantId = crypto.randomUUID();

  // Insert a new tenant
  await knex('tenants').insert([
    {
      id: tenantId, 
      name: 'Default Tenant',
      domain: 'default.com',
      plan: 'free',
      settings: JSON.stringify({}), // Empty JSON object
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Return the generated tenantId for use in other seeds (optional)
  return tenantId;
};
