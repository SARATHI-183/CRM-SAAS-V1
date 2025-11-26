const { knex } = require('../../database/knex');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function createTenantAdmin(tenantSchema, adminData) {
  const tenantKnex = require('../../database/knex').tenantKnex(tenantSchema);
  const hashedPassword = await bcrypt.hash(adminData.password, 10);
  const newAdmin = {
    id: uuidv4(),
    full_name: adminData.full_name,
    email: adminData.email,
    password_hash: hashedPassword,
    role: 'admin',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  };
  await tenantKnex('users').insert(newAdmin);
  return newAdmin;
}

module.exports = { createTenantAdmin };
