const crypto = require('crypto');

exports.seed = async function(knex) {
  // Delete existing roles
  await knex('roles').del();

  // Fetch the tenant ID dynamically from tenants table
  const tenant = await knex('tenants').first('id');
  if (!tenant) {
    throw new Error('No tenant found. Please seed tenants first.');
  }
  const tenantId = tenant.id;

  // Define roles
  const roles = [
    { role_name: 'Super Admin', description: 'Full access', is_system: true },
    { role_name: 'Admin', description: 'Admin access', is_system: true },
    { role_name: 'Manager', description: 'Manager access', is_system: true },
    { role_name: 'Sales', description: 'Sales role', is_system: false },
    { role_name: 'Support', description: 'Support role', is_system: false },
    { role_name: 'Finance', description: 'Finance role', is_system: false },
    { role_name: 'Inventory', description: 'Inventory role', is_system: false },
    { role_name: 'Read-only', description: 'Read-only role', is_system: false }
  ];

  // Insert roles with dynamic UUIDs
  const rolesToInsert = roles.map(role => ({
    id: crypto.randomUUID(),
    tenant_id: tenantId,
    role_name: role.role_name,
    description: role.description,
    is_system: role.is_system,
    created_at: new Date(),
    updated_at: new Date()
  }));

  await knex('roles').insert(rolesToInsert);
};
