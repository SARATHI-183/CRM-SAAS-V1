const { knex: masterKnex, tenantKnex } = require('../database/knex');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');

async function loginUser(email, password) {
  // 1️⃣ Check superadmin
  const superAdmin = await masterKnex('super_admins').where({ email }).first();
  if (superAdmin) {
    const valid = await bcrypt.compare(password, superAdmin.password_hash);
    if (!valid) throw new Error('Invalid credentials');

    return {
      user: { id: superAdmin.id, full_name: superAdmin.full_name, email, role: superAdmin.role },
      token: signToken({ id: superAdmin.id, email, role: superAdmin.role })
    };
  }

  // 2️⃣ Check tenant user
  const tenant = await masterKnex('tenants').where('is_active', true).first(); 
  if (!tenant) throw new Error('Tenant not found');

  const tk = tenantKnex(tenant.db_schema);
  const user = await tk('users').where({ email }).first();
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid credentials');

  return {
    user: { id: user.id, full_name: user.full_name, email, role: user.role, tenant_id: tenant.id },
    token: signToken({ id: user.id, role: user.role, tenant_id: tenant.id, db_schema: tenant.db_schema })
  };
}

module.exports = { loginUser };
