const bcrypt = require('bcrypt');
const { knex } = require('../knex'); // masterKnex connection

async function createSuperAdmin() {
  try {
    // Check if super admin already exists
    const existing = await knex('super_admins').first();
    if (existing) {
      console.log('Super Admin already exists:', existing.email);
      return existing;
    }

    // Hash the password
    const passwordPlain = 'Admin@123'; // Default password
    const passwordHash = await bcrypt.hash(passwordPlain, 10);

    // Insert super admin
    const [superAdmin] = await knex('super_admins')
      .insert({
        full_name: 'Platform Admin',
        email: 'admin@crm.com',
        password_hash: passwordHash,
        role: 'superadmin',
        is_active: true,
        meta: {},
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    console.log('Super Admin created:', superAdmin.email);
    return superAdmin;

  } catch (err) {
    console.error('Failed to create Super Admin:', err);
    throw err;
  }
}

// Execute directly
if (require.main === module) {
  createSuperAdmin()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { createSuperAdmin };
