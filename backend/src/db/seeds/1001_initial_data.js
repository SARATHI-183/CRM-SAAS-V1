// src/db/seeds/002_roles_modules.js
exports.seed = async function(knex) {
  await knex("roles").del();
  await knex("modules").del();

  await knex("roles").insert([
    { id: 1, role_name: "Super Admin", description: "Owner" },
    { id: 2, role_name: "Admin", description: "Tenant Admin" },
    { id: 3, role_name: "Manager", description: "Manager" },
    { id: 4, role_name: "Sales", description: "Sales Rep" },
  ]);

  await knex("modules").insert([
    { module_name: "Dashboard", is_core: true },
    { module_name: "Leads", is_core: true },
    { module_name: "Customers", is_core: true },
    { module_name: "Quotes", is_core: true },
    { module_name: "Orders", is_core: true },
    { module_name: "Products", is_core: true },
    { module_name: "Invoices", is_core: true },
    { module_name: "Payments", is_core: true },
    { module_name: "Reports", is_core: true },
    { module_name: "Settings", is_core: true },
  ]);
};
