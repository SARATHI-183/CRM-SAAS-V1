// seeds/003_users.js
const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  // Delete existing users
  await knex("users").del();

  const hashedPassword = await bcrypt.hash("SuperAdmin123!", 10);

  // Insert Super Admin
  await knex("users").insert([
    {
      id: 1,
      full_name: "Super Admin",
      email: "superadmin@crm.com",
      password: hashedPassword,
      role_id: 1,       // Super Admin
      tenant_id: null,  // Global
      is_active: true,
    },
  ]);

  // Insert tenant users for testing (optional)
  const tenantUserPassword = await bcrypt.hash("TenantUser123!", 10);

  await knex("users").insert([
    {
      full_name: "Demo Tenant1 Admin",
      email: "admin1@demo1.com",
      password: tenantUserPassword,
      role_id: 2,       // Admin
      tenant_id: 1,
      is_active: true,
    },
    {
      full_name: "Demo Tenant2 Admin",
      email: "admin2@demo2.com",
      password: tenantUserPassword,
      role_id: 2,
      tenant_id: 2,
      is_active: true,
    },
  ]);
};
