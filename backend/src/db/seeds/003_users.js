// seeds/users_seed.js
const bcrypt = require("bcryptjs");

exports.seed = async function(knex) {
  await knex("users").del();

  const hashedSuperAdmin = await bcrypt.hash("superadmin", 10);
  const hashedTenantUser  = await bcrypt.hash("tenantuser", 10);

  const tenants = await knex("tenants").select("id");
  const roles = await knex("roles").select("id", "role_key");

  await knex("users").insert([
    {
      full_name: "Super Admin",
      email: "superadmin@crm.com",
      password: hashedSuperAdmin,
      role_id: roles.find(r => r.role_key === "super_admin").id,
      tenant_id: null
    },
    {
      full_name: "Demo Tenant1 Admin",
      email: "admin1@demo1.com",
      password: hashedTenantUser,
      role_id: roles.find(r => r.role_key === "tenant_admin").id,
      tenant_id: tenants[0].id
    },
    {
      full_name: "Demo Tenant2 Admin",
      email: "admin2@demo2.com",
      password: hashedTenantUser,
      role_id: roles.find(r => r.role_key === "tenant_admin").id,
      tenant_id: tenants[1].id
    }
  ]);
};
