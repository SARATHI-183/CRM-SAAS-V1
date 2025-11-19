// seeds/002_roles_modules.js
exports.seed = async function (knex) {
  // Delete existing data
  await knex("roles").del();
  await knex("modules").del();

  // Insert system roles
  await knex("roles").insert([
    { id: 1, role_name: "Super Admin", description: "Owner", is_system_role: true, tenant_id: null },
    { id: 2, role_name: "Admin", description: "Tenant Admin", is_system_role: true, tenant_id: null },
    { id: 3, role_name: "Manager", description: "Manager", is_system_role: true, tenant_id: null },
    { id: 4, role_name: "Sales", description: "Sales Rep", is_system_role: true, tenant_id: null },
  ]);

  // Insert system modules
  await knex("modules").insert([
    { module_name: "Dashboard", is_core: true, tenant_id: null },
    { module_name: "Leads", is_core: true, tenant_id: null },
    { module_name: "Customers", is_core: true, tenant_id: null },
    { module_name: "Quotes", is_core: true, tenant_id: null },
    { module_name: "Orders", is_core: true, tenant_id: null },
    { module_name: "Products", is_core: true, tenant_id: null },
    { module_name: "Invoices", is_core: true, tenant_id: null },
    { module_name: "Payments", is_core: true, tenant_id: null },
    { module_name: "Reports", is_core: true, tenant_id: null },
    { module_name: "Settings", is_core: true, tenant_id: null },
  ]);
};
