// exports.seed = async function(knex) {
//   await knex("roles").del();

//   await knex("roles").insert([
//     { role_key: "super_admin", role_name: "Super Admin", description: "Owner", is_system_role: true },
//     { role_key: "admin", role_name: "Admin", description: "Tenant Admin", is_system_role: true },
//     { role_key: "manager", role_name: "Manager", description: "Manager", is_system_role: true },
//     { role_key: "sales", role_name: "Sales", description: "Sales Rep", is_system_role: true }
//   ]);
// };


// exports.seed = async function (knex) {
//   // Clear existing
//   await knex("roles").del();
//   await knex("modules").del();

//   // Insert core modules (no tenant_id)
//   const coreModules = await knex("modules")
//     .insert([
//       { module_name: "Leads", is_core: true },
//       { module_name: "Contacts", is_core: true },
//       { module_name: "Companies", is_core: true },
//       { module_name: "Deals", is_core: true },
//       { module_name: "Tasks", is_core: true },
//       { module_name: "Tickets", is_core: true },
//       { module_name: "Products", is_core: true },
//       { module_name: "Invoices", is_core: true },
//       { module_name: "Activities", is_core: true },
//       { module_name: "Campaigns", is_core: true },
//     ])
//     .returning(["id", "module_name"]);

//   // Insert roles
//   await knex("roles").insert([
//     { role_name: "Super Admin", description: "Platform owner", is_default: false },
//     { role_name: "Tenant Admin", description: "Admin for tenant", is_default: true },
//     { role_name: "Staff", description: "Basic user", is_default: true },
//   ]);
// };

// const { v4: uuidv4 } = require("uuid");

// exports.seed = async function (knex) {
//   // Clear existing data
//   await knex("roles").del();
//   await knex("modules").del();

//   // ---------- Core Modules ----------
//   const coreModules = await knex("modules")
//     .insert([
//       { id: uuidv4(), module_key: "leads", module_name: "Leads", is_core: true, tenant_id: null },
//       { id: uuidv4(), module_key: "contacts", module_name: "Contacts", is_core: true, tenant_id: null },
//       { id: uuidv4(), module_key: "companies", module_name: "Companies", is_core: true, tenant_id: null },
//       { id: uuidv4(), module_key: "deals", module_name: "Deals", is_core: true, tenant_id: null },
//       { id: uuidv4(), module_key: "tasks", module_name: "Tasks", is_core: true, tenant_id: null },
//       { id: uuidv4(), module_key: "tickets", module_name: "Tickets", is_core: true, tenant_id: null },
//       { id: uuidv4(), module_key: "products", module_name: "Products", is_core: true, tenant_id: null },
//       { id: uuidv4(), module_key: "invoices", module_name: "Invoices", is_core: true, tenant_id: null },
//       { id: uuidv4(), module_key: "activities", module_name: "Activities", is_core: true, tenant_id: null },
//       { id: uuidv4(), module_key: "campaigns", module_name: "Campaigns", is_core: true, tenant_id: null },
//     ])
//     .returning(["id", "module_name"]);

//   // ---------- Roles ----------
//   await knex("roles").insert([
//     { id: uuidv4(), role_key: "super_admin", role_name: "Super Admin", description: "Platform owner", is_system_role: true },
//     { id: uuidv4(), role_key: "tenant_admin", role_name: "Tenant Admin", description: "Admin for tenant", is_system_role: true },
//     { id: uuidv4(), role_key: "staff", role_name: "Staff", description: "Basic user", is_system_role: true },
//   ]);
// };


// seeds/roles_seed.js
exports.seed = async function (knex) {
  // Clear existing roles
  await knex("roles").del();

  // Insert roles and return inserted rows
  const roles = await knex("roles")
    .insert([
      { role_key: "super_admin", role_name: "Super Admin", description: "Platform owner", is_system_role: true },
      { role_key: "tenant_admin", role_name: "Tenant Admin", description: "Admin for tenant", is_system_role: true },
      { role_key: "staff", role_name: "Staff", description: "Basic user", is_system_role: true },
    ])
    .returning("*");

  console.log("Inserted roles:", roles.map((r) => r.id));
  return roles;
};

