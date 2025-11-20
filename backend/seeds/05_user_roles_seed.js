const crypto = require('crypto');

exports.seed = async function(knex) {
  // Delete existing user_roles
  await knex('user_roles').del();

  // Fetch a tenant
  const tenant = await knex('tenants').first('id');
  if (!tenant) {
    throw new Error('No tenant found. Please seed tenants first.');
  }
  const tenantId = tenant.id;

  // Fetch users and roles for this tenant
  const users = await knex('users').where({ tenant_id: tenantId }).select('id');
  const roles = await knex('roles').where({ tenant_id: tenantId }).select('id');

  if (users.length === 0 || roles.length === 0) {
    throw new Error('No users or roles found. Please seed users and roles first.');
  }

  // Assign all roles to the first user as an example
  const userRoles = roles.map(role => ({
    id: crypto.randomUUID(),
    tenant_id: tenantId,
    user_id: users[0].id, // assign to first user
    role_id: role.id,
    created_at: new Date()
  }));

  // Insert into user_roles table
  await knex('user_roles').insert(userRoles);
};
