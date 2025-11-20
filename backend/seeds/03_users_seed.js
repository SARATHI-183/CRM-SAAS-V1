const crypto = require('crypto');
const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Delete existing users
  await knex('users').del();

  // Fetch the tenant ID dynamically from tenants table
  const tenant = await knex('tenants').first('id');
  if (!tenant) {
    throw new Error('No tenant found. Please seed tenants first.');
  }
  const tenantId = tenant.id;

  // Define users
  const users = [
    { first_name: 'Super', last_name: 'Admin', email: 'superadmin@example.com', password: 'Password123!' },
    { first_name: 'Admin', last_name: 'User', email: 'admin@example.com', password: 'Password123!' },
    { first_name: 'Sales', last_name: 'Rep', email: 'sales@example.com', password: 'Password123!' },
    { first_name: 'Support', last_name: 'Agent', email: 'support@example.com', password: 'Password123!' }
  ];

  // Hash passwords and prepare insert data
  const usersToInsert = await Promise.all(users.map(async (user) => ({
    id: crypto.randomUUID(),
    tenant_id: tenantId,
    email: user.email,
    password_hash: await bcrypt.hash(user.password, 10),
    first_name: user.first_name,
    last_name: user.last_name,
    is_active: true,
    last_login: null,
    settings: JSON.stringify({}),
    created_at: new Date(),
    updated_at: new Date()
  })));

  // Insert into users table
  await knex('users').insert(usersToInsert);
};
